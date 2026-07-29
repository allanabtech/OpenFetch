use anyhow::Result;
use reqwest::Client;
use serde::{Deserialize, Serialize};
use url::Url;

use crate::commands::analyzer::UrlAnalysis;
use crate::plugins::PluginManifest;

#[derive(Serialize, Deserialize, Debug)]
pub enum MediaType {
    Video,
    Audio,
    Image,
    Document,
    Archive,
    Application,
    Repository,
    Generic,
}

pub async fn analyze_url(url_str: &str, client: &Client) -> Result<UrlAnalysis> {
    let parsed_url = Url::parse(url_str)?;
    let host = parsed_url.host_str().unwrap_or("");
    let path = parsed_url.path();

    // Default filename extracted from path
    let path_filename = path
        .split('/')
        .last()
        .filter(|s| !s.is_empty())
        .map(|s| s.to_string());

    let mut file_name = path_filename;
    let mut file_size = None;
    let mut content_type = None;
    let mut title = None;
    let mut media_type = "generic".to_string();
    let mut plugin_id = Some("generic-http".to_string());

    // Domain-specific detection
    if host.contains("youtube.com") || host.contains("youtu.be") {
        media_type = "video".to_string();
        title = Some("YouTube Content".to_string());
        if file_name.is_none() || file_name.as_deref() == Some("watch") {
            file_name = Some("youtube_download.mp4".to_string());
        }
    } else if host.contains("github.com") {
        if path.contains("/releases/download/") {
            media_type = "application".to_string();
            plugin_id = Some("github-releases".to_string());
        } else {
            media_type = "repository".to_string();
        }
    }

    // Try HEAD request to fetch headers if possible
    if let Ok(res) = client.head(url_str).send().await {
        if res.status().is_success() {
            if let Some(cl) = res.headers().get(reqwest::header::CONTENT_LENGTH) {
                if let Ok(len_str) = cl.to_str() {
                    file_size = len_str.parse::<u64>().ok();
                }
            }
            if let Some(ct) = res.headers().get(reqwest::header::CONTENT_TYPE) {
                if let Ok(ct_str) = ct.to_str() {
                    content_type = Some(ct_str.to_string());
                    if media_type == "generic" {
                        if ct_str.contains("video/") { media_type = "video".to_string(); }
                        else if ct_str.contains("audio/") { media_type = "audio".to_string(); }
                        else if ct_str.contains("image/") { media_type = "image".to_string(); }
                        else if ct_str.contains("application/pdf") { media_type = "document".to_string(); }
                        else if ct_str.contains("zip") || ct_str.contains("tar") || ct_str.contains("gzip") { media_type = "archive".to_string(); }
                    }
                }
            }
            if let Some(cd) = res.headers().get(reqwest::header::CONTENT_DISPOSITION) {
                if let Ok(cd_str) = cd.to_str() {
                    if let Some(filename_part) = cd_str.split("filename=").nth(1) {
                        let clean_name = filename_part.trim_matches('"').trim_matches('\'').to_string();
                        if !clean_name.is_empty() {
                            file_name = Some(clean_name);
                        }
                    }
                }
            }
        }
    }

    // Fallback filename if none detected
    if file_name.is_none() {
        file_name = Some("download.bin".to_string());
    }

    Ok(UrlAnalysis {
        url: url_str.to_string(),
        title,
        description: Some(format!("Host: {}", host)),
        thumbnail_url: None,
        favicon_url: Some(format!("https://{}/favicon.ico", host)),
        media_type,
        file_name,
        file_size,
        content_type,
        plugin_id,
        is_authenticated_required: false,
        is_publicly_available: true,
        available_formats: vec!["Default Format".to_string()],
    })
}

pub fn detect_plugin(url: &str, _plugins: &[PluginManifest]) -> Option<String> {
    if url.contains("github.com") {
        Some("github-releases".to_string())
    } else {
        Some("generic-http".to_string())
    }
}
