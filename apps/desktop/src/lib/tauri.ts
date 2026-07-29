import { invoke } from '@tauri-apps/api/core';
import type { 
  UrlAnalysis, DownloadOptions, Download, PluginInfo, AppSettings 
} from './types';
import { listen } from '@tauri-apps/api/event';

export const analyzeUrl = (url: string): Promise<UrlAnalysis> => 
  invoke('analyze_url', { url });

export const startDownload = (url: string, options?: DownloadOptions): Promise<string> => 
  invoke('start_download', { url, options });

export const pauseDownload = (id: string): Promise<void> => 
  invoke('pause_download', { id });

export const resumeDownload = (id: string): Promise<void> => 
  invoke('resume_download', { id });

export const cancelDownload = (id: string): Promise<void> => 
  invoke('cancel_download', { id });

export const retryDownload = (id: string): Promise<void> => 
  invoke('retry_download', { id });

export const getDownloads = (): Promise<Download[]> => 
  invoke('get_downloads');

export const getDownload = (id: string): Promise<Download> => 
  invoke('get_download', { id });

export const deleteDownload = (id: string, deleteFile: boolean): Promise<void> => 
  invoke('delete_download', { id, deleteFile });

export const getHistory = (): Promise<Download[]> => 
  invoke('get_history');

export const clearHistory = (): Promise<void> => 
  invoke('clear_history');

export const setDownloadPriority = (id: string, priority: number): Promise<void> => 
  invoke('set_download_priority', { id, priority });

export const openDownloadFolder = (id: string): Promise<void> => 
  invoke('open_download_folder', { id });

export const getPlugins = (): Promise<PluginInfo[]> => 
  invoke('get_plugins');

export const enablePlugin = (id: string): Promise<void> => 
  invoke('enable_plugin', { id });

export const disablePlugin = (id: string): Promise<void> => 
  invoke('disable_plugin', { id });

export const installPluginFromPath = (path: string): Promise<PluginInfo> => 
  invoke('install_plugin_from_path', { path });

export const uninstallPlugin = (id: string): Promise<void> => 
  invoke('uninstall_plugin', { id });

export const getSettings = (): Promise<AppSettings> => 
  invoke('get_settings');

export const setSettings = (settings: AppSettings): Promise<void> => 
  invoke('set_settings', { settings });

export const getSetting = <T>(key: string): Promise<T> => 
  invoke('get_setting', { key });

export const setSetting = (key: string, value: unknown): Promise<void> => 
  invoke('set_setting', { key, value });

export const chooseDownloadFolder = (): Promise<string | null> => 
  invoke('choose_download_folder');

export const onDownloadProgress = (callback: (payload: any) => void) => {
  return listen('download_progress', (event) => callback(event.payload));
};
