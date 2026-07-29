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
    pub thumbnail_url: Option<String>,
    pub media_type: Option<String>,
    pub expected_size: Option<u64>,
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
            thumbnail_url: None,
            media_type: None,
            expected_size: None,
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
    pub filename: String,
    pub file_path: String,
    pub thumbnail_url: Option<String>,
    pub media_type: String,
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
    let (id, original_url, target_path) = {
        let mut t = task.lock().await;
        t.status = DownloadStatus::Downloading;
        if let Some(ref thumb) = options.thumbnail_url {
            t.thumbnail_url = Some(thumb.clone());
        }
        if let Some(ref media) = options.media_type {
            t.media_type = media.clone();
        }
        if !options.filename.is_empty() {
            t.filename = options.filename.clone();
        }
        
        let save_dir = if options.save_path.is_empty() || options.save_path == "." {
            dirs::download_dir().unwrap_or_else(|| PathBuf::from("."))
        } else {
            PathBuf::from(&options.save_path)
        };

        tokio::fs::create_dir_all(&save_dir).await.ok();
        let file_name = if t.filename.is_empty() {
            "download.bin".to_string()
        } else {
            t.filename.clone()
        };

        let full_path = save_dir.join(file_name);
        t.file_path = full_path.to_string_lossy().to_string();
        (t.id.clone(), t.url.clone(), full_path)
    };

    let client = Client::builder()
        .user_agent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) OpenFetch/0.1.0")
        .build()?;

    let mut download_target_url = original_url.clone();

    // Cobalt Media Stream Resolution for YouTube/TikTok/Twitter/Instagram links
    if original_url.contains("youtube.com") || original_url.contains("youtu.be") || original_url.contains("tiktok.com") || original_url.contains("twitter.com") || original_url.contains("instagram.com") {
        let is_audio = options.filename.ends_with(".mp3") || options.media_type.as_deref() == Some("audio");
        let video_quality = if options.filename.contains("720") { "720" }
            else if options.filename.contains("480") { "480" }
            else if options.filename.contains("360") { "360" }
            else { "1080" };

        let payload = if is_audio {
            serde_json::json!({
                "url": original_url,
                "downloadMode": "audio",
                "audioFormat": "mp3"
            })
        } else {
            serde_json::json!({
                "url": original_url,
                "videoQuality": video_quality
            })
        };

        if let Ok(cobalt_res) = client.post("https://api.cobalt.tools")
            .header("Accept", "application/json")
            .header("Content-Type", "application/json")
            .json(&payload)
            .send().await
        {
            if cobalt_res.status().is_success() {
                if let Ok(cobalt_json) = cobalt_res.json::<serde_json::Value>().await {
                    if let Some(stream_url) = cobalt_json.get("url").and_then(|v| v.as_str()) {
                        download_target_url = stream_url.to_string();
                    }
                }
            }
        }
    }

    let response = match client.get(&download_target_url).send().await {
        Ok(res) => res,
        Err(err) => {
            let mut t = task.lock().await;
            t.status = DownloadStatus::Failed;
            return Err(anyhow::anyhow!("HTTP Request failed: {}", err));
        }
    };

    let mut total_size = response.content_length().unwrap_or(0);
    if total_size == 0 {
        if let Some(exp) = options.expected_size {
            total_size = exp;
        }
    }

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

        let current_total = if downloaded > total_size { downloaded } else if total_size > 0 { total_size } else { downloaded };

        {
            let mut t = task.lock().await;
            t.downloaded_bytes = downloaded;
            t.total_bytes = current_total;
            t.speed_bps = speed;
        }

        if last_emit.elapsed().as_millis() > 300 {
            last_emit = Instant::now();
            if let Some(ref handle) = app_handle {
                let payload = ProgressPayload {
                    id: id.clone(),
                    downloaded_bytes: downloaded,
                    total_bytes: current_total,
                    speed_bps: speed,
                    status: "Downloading".to_string(),
                };
                let _ = handle.emit("download-progress", payload);
            }
        }
    }

    file.flush().await?;

    let final_total = if downloaded > total_size { downloaded } else if total_size > 0 { total_size } else { downloaded };

    {
        let mut t = task.lock().await;
        t.status = DownloadStatus::Completed;
        t.downloaded_bytes = final_total;
        t.total_bytes = final_total;
        t.speed_bps = 0;
    }

    if let Some(ref handle) = app_handle {
        let payload = ProgressPayload {
            id: id.clone(),
            downloaded_bytes: final_total,
            total_bytes: final_total,
            speed_bps: 0,
            status: "Completed".to_string(),
        };
        let _ = handle.emit("download-progress", payload);
    }

    Ok(())
}
