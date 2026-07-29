import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import URLAnalyzer from '../../components/analyzer/URLAnalyzer'
import { analyzeUrl, startDownload } from '../../lib/tauri'
import { UrlAnalysis } from '../../lib/types'

export default function Home() {
  const [url, setUrl] = useState('')
  const [analysis, setAnalysis] = useState<UrlAnalysis | null>(null)
  const [loading, setLoading] = useState(false)

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    setLoading(true)
    try {
      const res = await analyzeUrl(url.trim())
      setAnalysis(res)
    } catch (err) {
      console.warn('URL analysis fallback:', err)
      setAnalysis({
        url: url.trim(),
        file_name: url.split('/').pop() || 'download.bin',
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

  const handleStartDownload = async (targetAnalysis: UrlAnalysis, selectedFormat?: string) => {
    const isAudio = selectedFormat?.includes('MP3') || selectedFormat?.includes('FLAC') || selectedFormat?.includes('Audio')
    const ext = isAudio ? '.mp3' : '.mp4'
    let customFilename = targetAnalysis.file_name || 'download.bin'

    if (targetAnalysis.media_type === 'video' && !customFilename.endsWith(ext) && !customFilename.endsWith('.mp4')) {
      customFilename = `${customFilename.split('.')[0]}${ext}`
    }

    await startDownload(targetAnalysis.url, {
      filename: customFilename,
      save_path: '',
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
      className="p-8 h-full flex flex-col items-center justify-center relative min-h-[500px]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent-violet/10 via-base to-base pointer-events-none" />
      
      <div className="z-10 w-full max-w-2xl text-center">
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-5xl font-bold mb-4 gradient-text"
        >
          OpenFetch
        </motion.h1>
        <motion.p 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-gray-400 mb-8"
        >
          The last download manager you'll ever need.
        </motion.p>

        <motion.form 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleAnalyze} 
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-accent-violet to-accent-cyan rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
          <div className="relative flex items-center bg-surface/80 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl">
            <Search className="ml-4 text-gray-400" />
            <input 
              type="text" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste any URL here..." 
              className="flex-1 bg-transparent border-none outline-none text-white p-4 placeholder-gray-500"
            />
            <button type="submit" disabled={loading} className="btn-primary mr-2">
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
        </motion.form>

        {analysis && (
          <URLAnalyzer analysis={analysis} onStartDownload={handleStartDownload} />
        )}
      </div>
    </motion.div>
  )
}
