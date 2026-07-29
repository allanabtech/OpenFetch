use serde::{Deserialize, Serialize};
use tauri_plugin_dialog::DialogExt;

#[derive(Serialize, Deserialize, Debug, Default)]
pub struct AppSettings {
    pub theme: String,
    pub language: String,
    pub download_folder: String,
    pub max_concurrent_downloads: usize,
    pub bandwidth_limit_kbps: u32,
    pub enable_notifications: bool,
    pub enable_clipboard_monitor: bool,
    pub proxy_url: Option<String>,
    pub proxy_username: Option<String>,
    pub proxy_password: Option<String>,
    pub auto_start_downloads: bool,
    pub auto_organize_files: bool,
    pub default_quality: String,
}

#[tauri::command]
pub async fn get_settings() -> Result<AppSettings, String> {
    Ok(AppSettings::default())
}

#[tauri::command]
pub async fn set_settings(settings: AppSettings) -> Result<(), String> {
    Ok(())
}

#[tauri::command]
pub async fn get_setting(key: String) -> Result<serde_json::Value, String> {
    Ok(serde_json::Value::Null)
}

#[tauri::command]
pub async fn set_setting(key: String, value: serde_json::Value) -> Result<(), String> {
    Ok(())
}

#[tauri::command]
pub async fn choose_download_folder(app: tauri::AppHandle) -> Result<Option<String>, String> {
    let result = app.dialog().file().pick_folder();
    match result {
        Some(path) => Ok(Some(path.to_string())),
        None => Ok(None),
    }
}

#[tauri::command]
pub async fn reset_settings() -> Result<(), String> {
    Ok(())
}
