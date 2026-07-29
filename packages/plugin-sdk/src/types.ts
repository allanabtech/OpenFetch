export interface PluginContext {
  analyzeUrl(url: string): Promise<UrlAnalysisResult>
  downloadUrl(url: string, options: DownloadOptions): Promise<void>
  getSetting<T>(key: string): Promise<T>
  log(level: 'info' | 'warn' | 'error', message: string): void
  emitProgress(downloaded: number, total: number, speed: number): void
}

export interface UrlAnalysisResult {
  url: string
  directUrl?: string
  title?: string
  description?: string
  thumbnail?: string
  mediaType: string
  fileName?: string
  fileSize?: number
  formats?: DownloadFormat[]
  requiresAuth: boolean
}

export interface DownloadFormat {
  id: string
  label: string
  ext: string
  fileSize?: number
  quality?: string
  codec?: string
}

export interface DownloadOptions {
  format?: string
  outputPath: string
  filename?: string
  headers?: Record<string, string>
  cookies?: string
}
