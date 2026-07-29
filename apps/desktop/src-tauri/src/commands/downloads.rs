use std::sync::Arc;
use serde::Serialize;
use tauri::State;
use tokio::sync::Mutex;

use crate::engine::scheduler::DownloadScheduler;
use crate::engine::downloader::{DownloadOptions, DownloadTask};

#[derive(Serialize)]
pub struct Download {
    pub id: String,
    pub url: String,
    pub file_path: String,
    pub status: String,
    pub total_bytes: u64,
    pub downloaded_bytes: u64,
    pub speed_bps: u64,
}

impl From<&DownloadTask> for Download {
    fn from(task: &DownloadTask) -> Self {
        Self {
            id: task.id.clone(),
            url: task.url.clone(),
            file_path: task.file_path.clone(),
            status: format!("{:?}", task.status),
            total_bytes: task.total_bytes,
            downloaded_bytes: task.downloaded_bytes,
            speed_bps: task.speed_bps,
        }
    }
}

impl From<DownloadTask> for Download {
    fn from(task: DownloadTask) -> Self {
        Self::from(&task)
    }
}

#[tauri::command]
pub async fn start_download(
    url: String,
    options: DownloadOptions,
    scheduler: State<'_, Arc<Mutex<DownloadScheduler>>>,
) -> Result<String, String> {
    let mut scheduler = scheduler.lock().await;
    scheduler.add(url, options).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn pause_download(
    id: String,
    scheduler: State<'_, Arc<Mutex<DownloadScheduler>>>,
) -> Result<(), String> {
    let scheduler = scheduler.lock().await;
    scheduler.pause(&id).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn resume_download(
    id: String,
    scheduler: State<'_, Arc<Mutex<DownloadScheduler>>>,
) -> Result<(), String> {
    let mut scheduler = scheduler.lock().await;
    scheduler.resume(&id).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn cancel_download(
    id: String,
    scheduler: State<'_, Arc<Mutex<DownloadScheduler>>>,
) -> Result<(), String> {
    let scheduler = scheduler.lock().await;
    scheduler.cancel(&id).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn retry_download(
    id: String,
    scheduler: State<'_, Arc<Mutex<DownloadScheduler>>>,
) -> Result<(), String> {
    let mut scheduler = scheduler.lock().await;
    scheduler.retry(&id).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_downloads(
    scheduler: State<'_, Arc<Mutex<DownloadScheduler>>>,
) -> Result<Vec<Download>, String> {
    let scheduler = scheduler.lock().await;
    Ok(scheduler.get_all().into_iter().map(Download::from).collect())
}

#[tauri::command]
pub async fn get_download(
    id: String,
    scheduler: State<'_, Arc<Mutex<DownloadScheduler>>>,
) -> Result<Download, String> {
    let scheduler = scheduler.lock().await;
    scheduler.get(&id).map(Download::from).ok_or_else(|| "Not found".into())
}

#[tauri::command]
pub async fn delete_download(
    id: String,
    delete_file: bool,
    scheduler: State<'_, Arc<Mutex<DownloadScheduler>>>,
) -> Result<(), String> {
    let mut scheduler = scheduler.lock().await;
    scheduler.delete(&id, delete_file).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_history() -> Result<Vec<Download>, String> {
    Ok(Vec::new())
}

#[tauri::command]
pub async fn clear_history() -> Result<(), String> {
    Ok(())
}

#[tauri::command]
pub async fn set_download_priority(
    id: String,
    priority: i32,
    scheduler: State<'_, Arc<Mutex<DownloadScheduler>>>,
) -> Result<(), String> {
    let mut scheduler = scheduler.lock().await;
    scheduler.set_priority(&id, priority).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn open_download_folder(
    id: String,
    scheduler: State<'_, Arc<Mutex<DownloadScheduler>>>,
) -> Result<(), String> {
    let scheduler = scheduler.lock().await;
    scheduler.open_folder(&id).map_err(|e| e.to_string())
}
