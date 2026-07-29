use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct UrlAnalysis {
    pub url: String,
    pub title: Option<String>,
    pub description: Option<String>,
    pub thumbnail_url: Option<String>,
    pub favicon_url: Option<String>,
    pub media_type: String,
    pub file_name: Option<String>,
    pub file_size: Option<u64>,
    pub content_type: Option<String>,
    pub plugin_id: Option<String>,
    pub is_authenticated_required: bool,
    pub is_publicly_available: bool,
    pub available_formats: Vec<String>,
}

#[tauri::command]
pub async fn analyze_url(url: String) -> Result<UrlAnalysis, String> {
    let client = reqwest::Client::new();
    crate::analyzer::analyze_url(&url, &client).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn detect_plugin(url: String) -> Result<String, String> {
    crate::analyzer::detect_plugin(&url, &[]).ok_or_else(|| "No plugin found".into())
}
