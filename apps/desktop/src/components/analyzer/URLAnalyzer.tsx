import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { UrlAnalysis } from '../../lib/types'
import { Download, Check, AlertCircle } from 'lucide-react'

interface URLAnalyzerProps {
  analysis: UrlAnalysis | null
  onStartDownload?: (analysis: UrlAnalysis) => void
}

export default function URLAnalyzer({ analysis, onStartDownload }: URLAnalyzerProps) {
  const [downloading, setDownloading] = useState(false)
  const [success, setSuccess] = useState(false)

  if (!analysis) return null

  const handleDownloadClick = async () => {
    if (!onStartDownload) return
    setDownloading(true)
    try {
      await onStartDownload(analysis)
      setSuccess(true)
    } catch (err) {
      console.error('Failed to start download:', err)
    } finally {
      setDownloading(false)
    }
  }

  const formattedSize = analysis.file_size
    ? `${(analysis.file_size / (1024 * 1024)).toFixed(2)} MB`
    : 'Unknown size'

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-6 mt-6 w-full max-w-2xl mx-auto rounded-xl border border-accent-violet/30 shadow-glow-violet text-left"
    >
      <div className="flex gap-4 items-start">
        <div className="w-16 h-16 bg-accent-violet/20 border border-accent-violet/40 rounded-lg flex items-center justify-center text-accent-cyan flex-shrink-0">
          {analysis.favicon_url ? (
            <img src={analysis.favicon_url} alt="Favicon" className="w-8 h-8 rounded" onError={(e) => { (e.target as HTMLElement).style.display = 'none' }} />
          ) : (
            <Download className="w-8 h-8 text-accent-cyan" />
          )}
        </div>

        <div className="flex-1 overflow-hidden">
          <h3 className="font-bold text-lg text-white truncate">
            {analysis.file_name || analysis.title || 'Direct Download'}
          </h3>
          <p className="text-xs text-gray-400 mt-1 truncate">{analysis.url}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="px-2.5 py-1 text-xs font-semibold bg-accent-violet/20 border border-accent-violet/40 text-violet-300 rounded-full capitalize">
              {analysis.media_type || 'generic'}
            </span>
            <span className="px-2.5 py-1 text-xs bg-white/10 text-gray-300 rounded-full">
              {formattedSize}
            </span>
            {analysis.plugin_id && (
              <span className="px-2.5 py-1 text-xs bg-accent-cyan/10 border border-accent-cyan/30 text-cyan-300 rounded-full">
                {analysis.plugin_id}
              </span>
            )}
          </div>
        </div>
      </div>

      <button 
        onClick={handleDownloadClick}
        disabled={downloading || success}
        className="w-full mt-6 btn-primary py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all"
      >
        {success ? (
          <>
            <Check className="w-5 h-5" /> Download Started! Check Downloads tab
          </>
        ) : downloading ? (
          'Starting Download...'
        ) : (
          <>
            <Download className="w-5 h-5" /> Start Download Now
          </>
        )}
      </button>
    </motion.div>
  )
}
