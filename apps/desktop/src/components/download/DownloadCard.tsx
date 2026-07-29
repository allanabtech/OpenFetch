import React from 'react'
import { motion } from 'framer-motion'
import { Download } from '../../lib/types'
import { Pause, Play, Folder, Trash2, Package, FolderArchive } from 'lucide-react'
import { pauseDownload, resumeDownload, deleteDownload, openDownloadFolder } from '../../lib/tauri'

export default function DownloadCard({ download }: { download: Download }) {
  const filename = download.filename || download.file_path?.split(/[/\\]/).pop() || 'download.bin'
  const progress = download.total_bytes > 0 
    ? Math.min(100, (download.downloaded_bytes / download.total_bytes) * 100) 
    : (download.status === 'Completed' ? 100 : 0)

  const speedMBs = (download.speed_bps / (1024 * 1024)).toFixed(2)
  const downloadedMB = (download.downloaded_bytes / (1024 * 1024)).toFixed(2)
  const totalMB = download.total_bytes > 0 ? (download.total_bytes / (1024 * 1024)).toFixed(2) : '?'

  const domain = (() => {
    try {
      return new URL(download.url).hostname
    } catch {
      return ''
    }
  })()

  const faviconUrl = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : null

  const handlePauseResume = async () => {
    if (download.status === 'Downloading') {
      await pauseDownload(download.id)
    } else {
      await resumeDownload(download.id)
    }
  }

  const handleOpenFolder = async () => {
    await openDownloadFolder(download.id)
  }

  const handleDelete = async () => {
    await deleteDownload(download.id, false)
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="glass p-4 group relative overflow-hidden rounded-xl border border-white/10"
    >
      <div className="flex items-start justify-between gap-4">
        {/* Thumbnail Preview Badge */}
        <div className="w-12 h-12 rounded-lg bg-surface/90 border border-white/10 overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
          {download.thumbnail_url ? (
            <img src={download.thumbnail_url} alt="Thumbnail" className="w-full h-full object-cover rounded-lg" onError={(e) => { (e.target as HTMLElement).style.display = 'none' }} />
          ) : faviconUrl ? (
            <img src={faviconUrl} alt="Favicon" className="w-7 h-7 rounded object-contain" onError={(e) => { (e.target as HTMLElement).style.display = 'none' }} />
          ) : (
            <Package size={20} className="text-accent-cyan" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-white truncate text-sm">{filename}</h3>
            <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize font-medium ${
              download.status === 'Completed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
              download.status === 'Downloading' ? 'bg-accent-violet/20 text-violet-300 border border-accent-violet/30 animate-pulse' :
              download.status === 'Failed' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
              'bg-gray-500/20 text-gray-400 border border-gray-500/30'
            }`}>
              {download.status}
            </span>
          </div>
          <p className="text-xs text-gray-400 truncate mt-1">{download.url}</p>
        </div>

        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {download.status === 'Downloading' ? (
            <button onClick={handlePauseResume} className="p-1.5 hover:bg-white/10 rounded-md text-gray-300 transition-colors" title="Pause">
              <Pause size={16} />
            </button>
          ) : download.status !== 'Completed' ? (
            <button onClick={handlePauseResume} className="p-1.5 hover:bg-white/10 rounded-md text-gray-300 transition-colors" title="Resume">
              <Play size={16} />
            </button>
          ) : null}
          <button onClick={handleOpenFolder} className="p-1.5 hover:bg-white/10 rounded-md text-gray-300 transition-colors" title="Open folder">
            <Folder size={16} />
          </button>
          <button onClick={handleDelete} className="p-1.5 hover:bg-red-500/20 rounded-md text-red-400 transition-colors" title="Delete">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{downloadedMB} MB / {totalMB} MB</span>
          {download.status === 'Downloading' && (
            <span className="text-accent-cyan font-mono">{speedMBs} MB/s</span>
          )}
          <span>{progress.toFixed(1)}%</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-accent-violet to-accent-cyan"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', bounce: 0 }}
          />
        </div>
      </div>
    </motion.div>
  )
}
