use anyhow::Result;
use reqwest::Client;
use serde::{Deserialize, Serialize};

#[derive(Serialize)]
pub struct UrlAnalysisResult {
    pub url: String,
    pub direct_url: Option<String>,
    pub media_type: String,
    pub file_name: Option<String>,
    pub file_size: Option<u64>,
    pub requires_auth: bool,
}

#[derive(Deserialize)]
pub struct DownloadOptions {
    pub output_path: String,
    pub headers: Option<std::collections::HashMap<String, String>>,
}

pub async fn analyze(url: &str) -> Result<UrlAnalysisResult> {
    Ok(UrlAnalysisResult {
        url: url.to_string(),
        direct_url: None,
        media_type: "application/json".to_string(),
        file_name: Some("release".to_string()),
        file_size: None,
        requires_auth: false,
    })
}

pub async fn download(url: &str, output_path: &str, _options: DownloadOptions) -> Result<()> {
    let client = Client::new();
    let res = client.get(url).header("User-Agent", "OpenFetch").send().await?;
    let bytes = res.bytes().await?;
    std::fs::write(output_path, bytes)?;
    Ok(())
}
