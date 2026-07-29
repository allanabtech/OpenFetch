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
    let client = Client::new();
    let res = client.head(url).send().await?;
    let size = res.headers().get(reqwest::header::CONTENT_LENGTH)
        .and_then(|val| val.to_str().ok())
        .and_then(|s| s.parse::<u64>().ok());
    let media_type = res.headers().get(reqwest::header::CONTENT_TYPE)
        .and_then(|val| val.to_str().ok())
        .map(|s| s.to_string())
        .unwrap_or_else(|| "application/octet-stream".to_string());
    let file_name = url.split('/').last().map(|s| s.to_string());
    Ok(UrlAnalysisResult {
        url: url.to_string(),
        direct_url: Some(url.to_string()),
        media_type,
        file_name,
        file_size: size,
        requires_auth: false,
    })
}

pub async fn download(url: &str, output_path: &str, _options: DownloadOptions) -> Result<()> {
    // simplified implementation
    let client = Client::new();
    let res = client.get(url).send().await?;
    let bytes = res.bytes().await?;
    std::fs::write(output_path, bytes)?;
    Ok(())
}
