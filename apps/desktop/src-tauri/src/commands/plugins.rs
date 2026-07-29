use crate::plugins::PluginInfo;

#[tauri::command]
pub async fn get_plugins() -> Result<Vec<PluginInfo>, String> {
    Ok(vec![])
}

#[tauri::command]
pub async fn enable_plugin(_id: String) -> Result<(), String> {
    Ok(())
}

#[tauri::command]
pub async fn disable_plugin(_id: String) -> Result<(), String> {
    Ok(())
}

#[tauri::command]
pub async fn install_plugin_from_path(_path: String) -> Result<PluginInfo, String> {
    Err("Not implemented".into())
}

#[tauri::command]
pub async fn uninstall_plugin(_id: String) -> Result<(), String> {
    Ok(())
}

#[tauri::command]
pub async fn get_plugin_settings(_id: String) -> Result<serde_json::Value, String> {
    Ok(serde_json::Value::Null)
}

#[tauri::command]
pub async fn set_plugin_settings(_id: String, _settings: serde_json::Value) -> Result<(), String> {
    Ok(())
}
