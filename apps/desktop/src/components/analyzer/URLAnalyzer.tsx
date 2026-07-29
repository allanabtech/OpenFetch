import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { UrlAnalysis } from '../../lib/types'
import { Download, Check, Settings2, Film, Music, FileText, Package } from 'lucide-react'

interface URLAnalyzerProps {
  analysis: UrlAnalysis | null
  onStartDownload?: (analysis: UrlAnalysis, selectedFormat?: string) => void
}

export default function URLAnalyzer({ analysis, onStartDownload }: URLAnalyzerProps) {
  const [downloading, setDownloading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [selectedFormat, setSelectedFormat] = useState<string>(
    analysis?.available_formats?.[0] || 'Original File (Best Quality)'
  )

  if (!analysis) return null

  const formats = analysis.available_formats && analysis.available_formats.length > 0
    ? analysis.available_formats
    : ['1080p Full HD (MP4)', '720p HD (MP4)', '480p SD (MP4)', 'MP3 High Quality (320kbps)', 'Original File (Best Quality)']

  const handleDownloadClick = async () => {
    if (!onStartDownload) return
    setDownloading(true)
    try {
      await onStartDownload(analysis, selectedFormat)
      setSuccess(true)
    } catch (err) {
      console.error('Failed to start download:', err)
    } finally {
      setDownloading(false)
    }
  }

  const formattedSize = analysis.file_size
    ? `${(analysis.file_size / (1024 * 1024)).toFixed(2)} MB`
    : 'Stream / Variable Size'

  const getMediaIcon = (type?: string) => {
    switch (type?.toLowerCase()) {
      case 'video': return <Film className="w-6 h-6 text-accent-cyan" />
      case 'audio': return <Music className="w-6 h-6 text-violet-400" />
      case 'document': return <FileText className="w-6 h-6 text-yellow-400" />
      default: return <Package className="w-6 h-6 text-accent-cyan" />
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-6 mt-6 w-full max-w-2xl mx-auto rounded-xl border border-accent-violet/30 shadow-glow-violet text-left"
    >
      <div className="flex gap-4 items-start">
        <div className="w-24 h-24 bg-accent-violet/20 border border-accent-violet/40 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0 relative">
          {analysis.thumbnail_url ? (
            <img 
              src={analysis.thumbnail_url} 
              alt="Thumbnail" 
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => { (e.target as HTMLElement).style.display = 'none' }} 
            />
          ) : analysis.favicon_url ? (
            <img src={analysis.favicon_url} alt="Favicon" className="w-10 h-10 rounded" onError={(e) => { (e.target as HTMLElement).style.display = 'none' }} />
          ) : (
            getMediaIcon(analysis.media_type)
          )}
        </div>

        <div className="flex-1 overflow-hidden">
          <h3 className="font-bold text-lg text-white truncate">
            {analysis.title || analysis.file_name || 'Direct Download'}
          </h3>
          <p className="text-xs text-gray-400 mt-1 truncate">{analysis.url}</p>

          <div className="mt-3 flex flex-wrap gap-2 items-center">
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

          {/* Quality & Format Selection Dropdown */}
          <div className="mt-4 flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-gray-400" />
            <label className="text-xs text-gray-400 font-medium">Quality / Format:</label>
            <select 
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="bg-surface/90 border border-white/10 text-white text-xs rounded-lg px-3 py-1.5 outline-none focus:border-accent-violet transition-colors cursor-pointer"
            >
              {formats.map((fmt, i) => (
                <option key={i} value={fmt} className="bg-base text-white">
                  {fmt}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <button 
        onClick={handleDownloadClick}
        disabled={downloading || success}
        className="w-full mt-6 btn-primary py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
      >
        {success ? (
          <>
            <Check className="w-5 h-5" /> Download Started! Go to Downloads tab
          </>
        ) : downloading ? (
          'Starting Download...'
        ) : (
          <>
            <Download className="w-5 h-5" /> Start Download ({selectedFormat.split(' ')[0]})
          </>
        )}
      </button>
    </motion.div>
  )
}
