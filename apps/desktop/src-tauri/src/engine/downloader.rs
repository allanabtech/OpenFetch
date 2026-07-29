use anyhow::Result;
use futures_util::StreamExt;
use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::path::PathBuf;
use std::sync::Arc;
use tauri::{AppHandle, Emitter};
use tokio::fs::File;
use tokio::io::AsyncWriteExt;
use tokio::sync::Mutex;
use tokio::time::Instant;

use crate::engine::chunk::Chunk;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct DownloadOptions {
    pub save_path: String,
    pub filename: String,
    pub chunk_count: usize,
    pub max_retries: u32,
    pub headers: HashMap<String, String>,
    pub cookies: HashMap<String, String>,
}

impl Default for DownloadOptions {
    fn default() -> Self {
        Self {
            save_path: "".to_string(),
            filename: "download.bin".to_string(),
            chunk_count: 8,
            max_retries: 3,
            headers: HashMap::new(),
            cookies: HashMap::new(),
        }
    }
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
pub enum DownloadStatus {
    Pending,
    Downloading,
    Paused,
    Completed,
    Failed,
    Cancelled,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct DownloadTask {
    pub id: String,
    pub url: String,
    pub file_path: String,
    pub status: DownloadStatus,
    pub total_bytes: u64,
    pub downloaded_bytes: u64,
    pub speed_bps: u64,
    pub chunks: Vec<Chunk>,
}

#[derive(Serialize, Clone, Debug)]
pub struct ProgressPayload {
    pub id: String,
    pub downloaded_bytes: u64,
    pub total_bytes: u64,
    pub speed_bps: u64,
    pub status: String,
}

pub async fn download(
    task: Arc<Mutex<DownloadTask>>,
    options: DownloadOptions,
    app_handle: Option<AppHandle>,
) -> Result<()> {
    let (id, url, target_path) = {
        let mut t = task.lock().await;
        t.status = DownloadStatus::Downloading;
        
        let save_dir = if options.save_path.is_empty() || options.save_path == "." {
            dirs::download_dir().unwrap_or_else(|| PathBuf::from("."))
        } else {
            PathBuf::from(&options.save_path)
        };

        tokio::fs::create_dir_all(&save_dir).await.ok();
        let file_name = if options.filename.is_empty() {
            "download.bin".to_string()
        } else {
            options.filename.clone()
        };

        let full_path = save_dir.join(file_name);
        t.file_path = full_path.to_string_lossy().to_string();
        (t.id.clone(), t.url.clone(), full_path)
    };

    let client = Client::builder()
        .user_agent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) OpenFetch/0.1.0")
        .build()?;

    let response = match client.get(&url).send().await {
        Ok(res) => res,
        Err(err) => {
            let mut t = task.lock().await;
            t.status = DownloadStatus::Failed;
            return Err(anyhow::anyhow!("HTTP Request failed: {}", err));
        }
    };

    let total_size = response.content_length().unwrap_or(0);
    {
        let mut t = task.lock().await;
        t.total_bytes = total_size;
    }

    let mut file = File::create(&target_path).await?;
    let mut stream = response.bytes_stream();

    let mut downloaded: u64 = 0;
    let start_time = Instant::now();
    let mut last_emit = Instant::now();

    while let Some(item) = stream.next().await {
        let chunk = match item {
            Ok(c) => c,
            Err(e) => {
                let mut t = task.lock().await;
                t.status = DownloadStatus::Failed;
                return Err(anyhow::anyhow!("Stream error: {}", e));
            }
        };

        file.write_all(&chunk).await?;
        downloaded += chunk.len() as u64;

        let elapsed = start_time.elapsed().as_secs_f64();
        let speed = if elapsed > 0.0 {
            (downloaded as f64 / elapsed) as u64
        } else {
            0
        };

        {
            let mut t = task.lock().await;
            t.downloaded_bytes = downloaded;
            t.speed_bps = speed;
        }

        if last_emit.elapsed().as_millis() > 300 {
            last_emit = Instant::now();
            if let Some(ref handle) = app_handle {
                let payload = ProgressPayload {
                    id: id.clone(),
                    downloaded_bytes: downloaded,
                    total_bytes: total_size,
                    speed_bps: speed,
                    status: "Downloading".to_string(),
                };
                let _ = handle.emit("download-progress", payload);
            }
        }
    }

    file.flush().await?;

    {
        let mut t = task.lock().await;
        t.status = DownloadStatus::Completed;
        t.downloaded_bytes = if total_size > 0 { total_size } else { downloaded };
        t.speed_bps = 0;
    }

    if let Some(ref handle) = app_handle {
        let payload = ProgressPayload {
            id: id.clone(),
            downloaded_bytes: downloaded,
            total_bytes: total_size,
            speed_bps: 0,
            status: "Completed".to_string(),
        };
        let _ = handle.emit("download-progress", payload);
    }

    Ok(())
}
