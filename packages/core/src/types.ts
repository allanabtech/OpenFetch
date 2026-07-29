export type DownloadStatus = 'pending' | 'downloading' | 'paused' | 'completed' | 'error' | 'cancelled';

export interface Download {
  id: string;
  url: string;
  filename: string;
  savePath: string;
  status: DownloadStatus;
  bytesDownloaded: number;
  totalBytes: number;
  speed: number; // bytes per second
  eta: number; // seconds
  startTime: number;
  endTime?: number;
  error?: string;
  chunks: DownloadChunk[];
}

export interface DownloadChunk {
  id: string;
  start: number;
  end: number;
  downloaded: number;
  status: 'pending' | 'downloading' | 'completed' | 'error';
}

export interface UrlAnalysis {
  url: string;
  directUrl?: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  mediaType: string;
  fileName?: string;
  fileSize?: number;
  requiresAuth: boolean;
  formats?: {
    id: string;
    label: string;
    ext: string;
    fileSize?: number;
    quality?: string;
    codec?: string;
  }[];
}

export interface PluginInfo {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  isEnabled: boolean;
}

export interface AppSettings {
  defaultDownloadDir: string;
  maxConcurrentDownloads: number;
  defaultMaxChunks: number;
  theme: 'light' | 'dark' | 'system';
  launchOnStartup: boolean;
}

export type DownloadEvent = 
  | { type: 'download-started'; payload: { id: string } }
  | { type: 'download-progress'; payload: { id: string; downloaded: number; total: number; speed: number } }
  | { type: 'download-completed'; payload: { id: string } }
  | { type: 'download-error'; payload: { id: string; error: string } };

export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  homepage?: string;
  icon?: string;
  permissions: string[];
  patterns: string[];
  entry?: string;
  settings_schema?: Record<string, any>;
  min_core_version?: string;
}

export interface AnalyticsEvent {
  event_type: string;
  timestamp: number;
  properties: Record<string, any>;
}
