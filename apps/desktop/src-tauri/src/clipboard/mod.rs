use tauri::{AppHandle, Emitter};
use arboard::Clipboard;
use regex::Regex;
use std::time::Duration;
use tokio::time::sleep;

pub struct ClipboardWatcher;

pub async fn start_watching(app_handle: AppHandle, interval_ms: u64) {
    let mut clipboard = match Clipboard::new() {
        Ok(c) => c,
        Err(_) => return,
    };

    let url_regex = Regex::new(r"^(https?|ftp|git)://[^\s/$.?#].[^\s]*$").unwrap();
    let mut last_content = String::new();

    loop {
        if let Ok(text) = clipboard.get_text() {
            let text = text.trim();
            if text != last_content && url_regex.is_match(text) {
                last_content = text.to_string();
                let _ = app_handle.emit("clipboard-url-detected", text);
            }
        }
        sleep(Duration::from_millis(interval_ms)).await;
    }
}
