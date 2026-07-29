export type DownloadStatus = 'pending' | 'downloading' | 'paused' | 'completed' | 'failed' | 'cancelled'
export type MediaType = 'video' | 'audio' | 'image' | 'document' | 'archive' | 'application' | 'repository' | 'generic'

export interface Download {
  id: string
  url: string
  filename: string
  save_path: string
  status: DownloadStatus
  total_bytes: number
  downloaded_bytes: number
  speed_bps: number
  eta_seconds: number
  checksum?: string
  plugin_id: string
  media_type: MediaType
  thumbnail_url?: string
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
  completed_at?: string
  priority: number
  chunks: DownloadChunk[]
}

export interface DownloadChunk {
  id: string
  index: number
  start_byte: number
  end_byte: number
  downloaded_bytes: number
  status: 'pending' | 'downloading' | 'completed' | 'failed'
}

export interface UrlAnalysis {
  url: string
  title?: string
  description?: string
  thumbnail_url?: string
  favicon_url?: string
  media_type: MediaType
  file_name?: string
  file_size?: number
  content_type?: string
  plugin_id: string
  is_authentication_required: boolean
  is_publicly_available: boolean
  available_formats?: string[]
  estimated_size?: number
}

export interface PluginInfo {
  id: string
  name: string
  version: string
  author: string
  description: string
  enabled: boolean
  installed_at: string
  icon_url?: string
  homepage_url?: string
  permissions: string[]
  patterns: string[]
}

export interface AppSettings {
  theme: 'glass' | 'cyberpunk' | 'win11' | 'macos' | 'minimal' | 'oled'
  language: string
  download_folder: string
  max_concurrent_downloads: number
  bandwidth_limit_kbps: number
  enable_notifications: boolean
  enable_clipboard_monitor: boolean
  proxy_url?: string
  proxy_username?: string
  proxy_password?: string
  auto_start_downloads: boolean
  auto_organize_files: boolean
  default_quality: string
}

export interface DownloadOptions {
  save_path?: string
  filename?: string
  chunk_count?: number
  headers?: Record<string, string>
  cookies?: string
}

export interface AnalyticsData {
  today_downloads: number
  total_downloads: number
  total_bytes: number
  avg_speed_bps: number
  success_rate: number
  top_domains: { domain: string; count: number }[]
  daily_downloads: { date: string; count: number; bytes: number }[]
}
