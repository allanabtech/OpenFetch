use anyhow::Result;
use std::collections::HashMap;
use std::sync::Arc;
use tauri::AppHandle;
use tokio::sync::{Mutex, Semaphore};
use tokio::task::JoinSet;

use crate::engine::downloader::{self, DownloadOptions, DownloadTask, DownloadStatus};

pub struct DownloadScheduler {
    pub max_concurrent: usize,
    semaphore: Arc<Semaphore>,
    tasks: HashMap<String, Arc<Mutex<DownloadTask>>>,
    join_set: JoinSet<()>,
}

impl DownloadScheduler {
    pub fn new(max_concurrent: usize) -> Self {
        Self {
            max_concurrent,
            semaphore: Arc::new(Semaphore::new(max_concurrent)),
            tasks: HashMap::new(),
            join_set: JoinSet::new(),
        }
    }

    pub async fn add(
        &mut self,
        url: String,
        options: DownloadOptions,
        app_handle: Option<AppHandle>,
    ) -> Result<String> {
        let id = uuid::Uuid::new_v4().to_string();
        let task = Arc::new(Mutex::new(DownloadTask {
            id: id.clone(),
            url: url.clone(),
            file_path: "".to_string(),
            status: DownloadStatus::Pending,
            total_bytes: 0,
            downloaded_bytes: 0,
            speed_bps: 0,
            chunks: vec![],
        }));

        self.tasks.insert(id.clone(), task.clone());

        // Spawn async background downloader
        let task_ref = task.clone();
        tokio::spawn(async move {
            let _ = downloader::download(task_ref, options, app_handle).await;
        });

        Ok(id)
    }

    pub async fn pause(&self, id: &str) -> Result<()> {
        if let Some(task) = self.tasks.get(id) {
            let mut t = task.lock().await;
            t.status = DownloadStatus::Paused;
        }
        Ok(())
    }

    pub async fn resume(&mut self, id: &str, app_handle: Option<AppHandle>) -> Result<()> {
        if let Some(task) = self.tasks.get(id) {
            let task_ref = task.clone();
            let options = DownloadOptions::default();
            tokio::spawn(async move {
                let _ = downloader::download(task_ref, options, app_handle).await;
            });
        }
        Ok(())
    }

    pub async fn cancel(&self, id: &str) -> Result<()> {
        if let Some(task) = self.tasks.get(id) {
            let mut t = task.lock().await;
            t.status = DownloadStatus::Cancelled;
        }
        Ok(())
    }
    
    pub async fn retry(&mut self, id: &str, app_handle: Option<AppHandle>) -> Result<()> {
        self.resume(id, app_handle).await
    }
    
    pub async fn delete(&mut self, id: &str, _delete_file: bool) -> Result<()> {
        self.tasks.remove(id);
        Ok(())
    }
    
    pub fn get_all(&self) -> Vec<DownloadTask> {
        let mut all = vec![];
        for task in self.tasks.values() {
            if let Ok(t) = task.try_lock() {
                all.push(t.clone());
            }
        }
        all
    }
    
    pub fn get(&self, id: &str) -> Option<DownloadTask> {
        self.tasks.get(id).and_then(|t| t.try_lock().ok().map(|locked| locked.clone()))
    }
    
    pub fn pause_all(&self) {}
    pub fn resume_all(&self) {}
    pub fn cancel_all(&self) {}
    pub fn set_max_concurrent(&mut self, n: usize) {
        self.max_concurrent = n;
        self.semaphore = Arc::new(Semaphore::new(n));
    }
    
    pub fn set_priority(&mut self, _id: &str, _priority: i32) -> Result<()> {
        Ok(())
    }
    
    pub fn open_folder(&self, id: &str) -> Result<()> {
        if let Some(task) = self.tasks.get(id) {
            if let Ok(t) = task.try_lock() {
                if !t.file_path.is_empty() {
                    let path = std::path::Path::new(&t.file_path);
                    let folder = if path.is_file() || path.extension().is_some() {
                        path.parent().unwrap_or(path)
                    } else {
                        path
                    };
                    let _ = open::that(folder);
                    return Ok(());
                }
            }
        }
        if let Some(dir) = dirs::download_dir() {
            let _ = open::that(dir);
        }
        Ok(())
    }
}
