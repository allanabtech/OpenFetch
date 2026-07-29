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
    let mut thumbnail_url = None;
    let mut available_formats = vec!["Original File (Best Quality)".to_string()];

    // Domain-specific detection
    if host.contains("youtube.com") || host.contains("youtu.be") {
        media_type = "video".to_string();
        plugin_id = Some("generic-http".to_string());
        
        let mut video_id = None;
        if host.contains("youtu.be") {
            video_id = path.strip_prefix('/').map(|s| s.to_string());
        } else if let Some((_, v)) = parsed_url.query_pairs().find(|(k, _)| k == "v") {
            video_id = Some(v.to_string());
        }

        if let Some(id) = video_id {
            thumbnail_url = Some(format!("https://img.youtube.com/vi/{}/hqdefault.jpg", id));
            title = Some(format!("YouTube Media ({})", id));
            file_name = Some(format!("youtube_{}.mp4", id));
        } else {
            title = Some("YouTube Content".to_string());
            file_name = Some("youtube_video.mp4".to_string());
        }

        available_formats = vec![
            "1080p Full HD (MP4)".to_string(),
            "720p HD (MP4)".to_string(),
            "480p SD (MP4)".to_string(),
            "360p Mobile (MP4)".to_string(),
            "MP3 High Quality (320kbps Audio)".to_string(),
            "MP3 Standard (128kbps Audio)".to_string(),
        ];
    } else if host.contains("github.com") {
        if path.contains("/releases/download/") {
            media_type = "application".to_string();
            plugin_id = Some("github-releases".to_string());
        } else {
            media_type = "repository".to_string();
        }
        available_formats = vec![
            "Original Binary / Asset".to_string(),
            "Source Code (ZIP Archive)".to_string(),
            "Source Code (TAR.GZ)".to_string(),
        ];
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
                        if ct_str.contains("video/") {
                            media_type = "video".to_string();
                            available_formats = vec![
                                "1080p Full HD (MP4)".to_string(),
                                "720p HD (MP4)".to_string(),
                                "Original Video Stream".to_string(),
                            ];
                        } else if ct_str.contains("audio/") {
                            media_type = "audio".to_string();
                            available_formats = vec![
                                "MP3 High Quality (320kbps)".to_string(),
                                "MP3 Standard (128kbps)".to_string(),
                                "FLAC Lossless".to_string(),
                                "WAV Audio".to_string(),
                            ];
                        } else if ct_str.contains("image/") {
                            media_type = "image".to_string();
                        } else if ct_str.contains("application/pdf") {
                            media_type = "document".to_string();
                        } else if ct_str.contains("zip") || ct_str.contains("tar") || ct_str.contains("gzip") {
                            media_type = "archive".to_string();
                        }
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

    if file_name.is_none() {
        file_name = Some("download.bin".to_string());
    }

    Ok(UrlAnalysis {
        url: url_str.to_string(),
        title,
        description: Some(format!("Host: {}", host)),
        thumbnail_url,
        favicon_url: Some(format!("https://{}/favicon.ico", host)),
        media_type,
        file_name,
        file_size,
        content_type,
        plugin_id,
        is_authenticated_required: false,
        is_publicly_available: true,
        available_formats,
    })
}

pub fn detect_plugin(url: &str, _plugins: &[PluginManifest]) -> Option<String> {
    if url.contains("github.com") {
        Some("github-releases".to_string())
    } else {
        Some("generic-http".to_string())
    }
}
