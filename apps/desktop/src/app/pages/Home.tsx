import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, History as HistoryIcon, Trash2, ArrowUpRight, Globe } from 'lucide-react'
import URLAnalyzer from '../../components/analyzer/URLAnalyzer'
import { analyzeUrl, startDownload } from '../../lib/tauri'
import { UrlAnalysis } from '../../lib/types'

interface PastedHistoryItem {
  id: string
  url: string
  timestamp: number
}

const HISTORY_STORAGE_KEY = 'openfetch_pasted_history'

export default function Home() {
  const [url, setUrl] = useState('')
  const [analysis, setAnalysis] = useState<UrlAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [pastedHistory, setPastedHistory] = useState<PastedHistoryItem[]>([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY)
      if (saved) {
        setPastedHistory(JSON.parse(saved))
      }
    } catch (e) {
      console.error('Failed to load pasted history:', e)
    }
  }, [])

  const saveToHistory = (newUrl: string) => {
    const trimmed = newUrl.trim()
    if (!trimmed) return

    const updated = [
      { id: Date.now().toString(), url: trimmed, timestamp: Date.now() },
      ...pastedHistory.filter(item => item.url !== trimmed)
    ].slice(0, 5)

    setPastedHistory(updated)
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated))
    } catch (e) {
      console.error('Failed to save pasted history:', e)
    }
  }

  const deleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const updated = pastedHistory.filter(item => item.id !== id)
    setPastedHistory(updated)
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated))
    } catch (err) {
      console.error('Failed to update history:', err)
    }
  }

  const handleAnalyzeUrl = async (targetUrl: string) => {
    if (!targetUrl.trim()) return

    setUrl(targetUrl)
    setLoading(true)
    saveToHistory(targetUrl)

    try {
      const res = await analyzeUrl(targetUrl.trim())
      setAnalysis(res)
    } catch (err) {
      console.warn('URL analysis fallback:', err)
      setAnalysis({
        url: targetUrl.trim(),
        file_name: targetUrl.split('/').pop() || 'download.bin',
        media_type: 'generic',
        plugin_id: 'generic-http',
        is_authentication_required: false,
        is_publicly_available: true,
        available_formats: [
          '1080p Full HD (MP4)',
          '720p HD (MP4)',
          '480p SD (MP4)',
          'MP3 High Quality (320kbps)',
          'Original File (Best Quality)'
        ]
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleAnalyzeUrl(url)
  }

  const handleStartDownload = async (targetAnalysis: UrlAnalysis, selectedFormat?: string) => {
    const isAudio = selectedFormat?.includes('MP3') || selectedFormat?.includes('FLAC') || selectedFormat?.includes('Audio')
    const ext = isAudio ? '.mp3' : '.mp4'
    let customFilename = targetAnalysis.file_name || 'download.bin'

    if (targetAnalysis.media_type === 'video' && !customFilename.endsWith(ext) && !customFilename.endsWith('.mp4')) {
      customFilename = `${customFilename.split('.')[0]}${ext}`
    }

    // Calculate format estimated size if absent
    let estimated = targetAnalysis.file_size || 0
    if (estimated === 0) {
      if (selectedFormat?.includes('1080p')) estimated = 150 * 1024 * 1024
      else if (selectedFormat?.includes('720p')) estimated = 85 * 1024 * 1024
      else if (selectedFormat?.includes('480p')) estimated = 45 * 1024 * 1024
      else if (selectedFormat?.includes('MP3')) estimated = 8 * 1024 * 1024
    }

    await startDownload(targetAnalysis.url, {
      filename: customFilename,
      save_path: '',
      thumbnail_url: targetAnalysis.thumbnail_url || targetAnalysis.favicon_url,
      media_type: targetAnalysis.media_type || 'generic',
      expected_size: estimated > 0 ? estimated : undefined,
      chunk_count: 8,
      max_retries: 3,
      headers: {},
      cookies: {}
    })
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="p-8 h-full flex flex-col items-center justify-center relative min-h-[600px] overflow-y-auto"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent-violet/10 via-base to-base pointer-events-none" />
      
      <div className="z-10 w-full max-w-2xl text-center py-6">
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-5xl font-bold mb-3 gradient-text tracking-tight"
        >
          OpenFetch
        </motion.h1>
        <motion.p 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-gray-400 mb-8 text-sm"
        >
          The last download manager you'll ever need.
        </motion.p>

        <motion.form 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleFormSubmit} 
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-accent-violet to-accent-cyan rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
          <div className="relative flex items-center bg-surface/80 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl">
            <Search className="ml-4 text-gray-400 shrink-0" />
            <input 
              type="text" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste any URL here..." 
              className="flex-1 bg-transparent border-none outline-none text-white p-4 placeholder-gray-500 text-sm"
            />
            <button type="submit" disabled={loading} className="btn-primary mr-2 cursor-pointer">
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
        </motion.form>

        {/* 5 Pasted Links History Box */}
        {pastedHistory.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-left"
          >
            <div className="flex items-center gap-2 mb-2 px-1">
              <HistoryIcon size={14} className="text-accent-violet" />
              <span className="text-xs font-semibold text-gray-400 tracking-wide">Recent Pasted Links</span>
            </div>
            <div className="space-y-1.5">
              <AnimatePresence>
                {pastedHistory.map((item) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    onClick={() => handleAnalyzeUrl(item.url)}
                    className="glass glass-hover p-2.5 rounded-lg flex items-center justify-between gap-3 group cursor-pointer border border-white/5 transition-all"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <Globe size={14} className="text-gray-400 group-hover:text-accent-cyan transition-colors shrink-0" />
                      <span className="text-xs text-gray-300 group-hover:text-white truncate font-mono">{item.url}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 shrink-0">
                      <button 
                        onClick={(e) => handleAnalyzeUrl(item.url)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-accent-cyan transition-all"
                        title="Analyze link"
                      >
                        <ArrowUpRight size={14} />
                      </button>
                      <button 
                        onClick={(e) => deleteHistoryItem(item.id, e)}
                        className="p-1 text-gray-500 hover:text-red-400 transition-colors rounded hover:bg-red-500/10"
                        title="Delete from history"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {analysis && (
          <URLAnalyzer analysis={analysis} onStartDownload={handleStartDownload} />
        )}
      </div>
    </motion.div>
  )
}
