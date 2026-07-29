use serde::{Deserialize, Serialize};
use crate::plugins::PluginInfo;

#[tauri::command]
pub async fn get_plugins() -> Result<Vec<PluginInfo>, String> {
    Ok(vec![])
}

#[tauri::command]
pub async fn enable_plugin(id: String) -> Result<(), String> {
    Ok(())
}

#[tauri::command]
pub async fn disable_plugin(id: String) -> Result<(), String> {
    Ok(())
}

#[tauri::command]
pub async fn install_plugin_from_path(path: String) -> Result<PluginInfo, String> {
    Err("Not implemented".into())
}

#[tauri::command]
pub async fn uninstall_plugin(id: String) -> Result<(), String> {
    Ok(())
}

#[tauri::command]
pub async fn get_plugin_settings(id: String) -> Result<serde_json::Value, String> {
    Ok(serde_json::Value::Null)
}

#[tauri::command]
pub async fn set_plugin_settings(id: String, settings: serde_json::Value) -> Result<(), String> {
    Ok(())
}
