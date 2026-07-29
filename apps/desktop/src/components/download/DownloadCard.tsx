import React from 'react'
import { motion } from 'framer-motion'
import { Download } from '../../lib/types'
import { Pause, Play, X, RotateCcw, Folder, Trash2 } from 'lucide-react'

export default function DownloadCard({ download }: { download: Download }) {
  const progress = download.total_bytes > 0 ? (download.downloaded_bytes / download.total_bytes) * 100 : 0
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="glass p-4 group relative overflow-hidden"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-white truncate">{download.filename}</h3>
          <p className="text-xs text-gray-400 truncate mt-1">{download.url}</p>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {download.status === 'downloading' ? (
            <button className="p-1.5 hover:bg-white/10 rounded-md text-gray-300"><Pause size={16} /></button>
          ) : (
            <button className="p-1.5 hover:bg-white/10 rounded-md text-gray-300"><Play size={16} /></button>
          )}
          <button className="p-1.5 hover:bg-white/10 rounded-md text-gray-300"><Folder size={16} /></button>
          <button className="p-1.5 hover:bg-red-500/20 rounded-md text-red-400"><Trash2 size={16} /></button>
        </div>
      </div>
      
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{(download.downloaded_bytes / 1024 / 1024).toFixed(2)} MB / {(download.total_bytes / 1024 / 1024).toFixed(2)} MB</span>
          <span>{progress.toFixed(1)}%</span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
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
