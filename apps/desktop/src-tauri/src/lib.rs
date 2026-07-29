pub mod analyzer;
pub mod clipboard;
pub mod commands;
pub mod db;
pub mod engine;
pub mod plugins;

use std::sync::Arc;
use tauri::Manager;
use tracing_subscriber::{EnvFilter, FmtSubscriber};
use db::Repository;
use engine::scheduler::DownloadScheduler;
use tokio::sync::Mutex;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let subscriber = FmtSubscriber::builder()
        .with_env_filter(EnvFilter::from_default_env())
        .finish();
    tracing::subscriber::set_global_default(subscriber).expect("setting default subscriber failed");

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_os::init())
        .setup(|app| {
            // DB Setup
            let app_dir = app.path().app_data_dir().unwrap_or_else(|_| std::path::PathBuf::from("."));
            std::fs::create_dir_all(&app_dir).unwrap_or_default();
            let db_path = app_dir.join("openfetch.db");
            
            let repo = Repository::new(db_path.to_str().unwrap()).expect("Failed to init db");
            app.manage(repo);

            let scheduler = Arc::new(Mutex::new(DownloadScheduler::new(4)));
            app.manage(scheduler);

            let handle = app.handle().clone();
            tauri::async_runtime::spawn(async move {
                clipboard::start_watching(handle, 1000).await;
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::downloads::start_download,
            commands::downloads::pause_download,
            commands::downloads::resume_download,
            commands::downloads::cancel_download,
            commands::downloads::retry_download,
            commands::downloads::get_downloads,
            commands::downloads::get_download,
            commands::downloads::delete_download,
            commands::downloads::get_history,
            commands::downloads::clear_history,
            commands::downloads::set_download_priority,
            commands::downloads::open_download_folder,
            commands::analyzer::analyze_url,
            commands::analyzer::detect_plugin,
            commands::plugins::get_plugins,
            commands::plugins::enable_plugin,
            commands::plugins::disable_plugin,
            commands::plugins::install_plugin_from_path,
            commands::plugins::uninstall_plugin,
            commands::plugins::get_plugin_settings,
            commands::plugins::set_plugin_settings,
            commands::settings::get_settings,
            commands::settings::set_settings,
            commands::settings::get_setting,
            commands::settings::set_setting,
            commands::settings::choose_download_folder,
            commands::settings::reset_settings,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
