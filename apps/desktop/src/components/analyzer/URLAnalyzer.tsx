import React from 'react'
import { motion } from 'framer-motion'
import { UrlAnalysis } from '../../lib/types'

export default function URLAnalyzer({ analysis }: { analysis: UrlAnalysis | null }) {
  if (!analysis) return null
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-6 mt-4 w-full max-w-2xl mx-auto rounded-xl border-accent-violet/30 shadow-glow-violet"
    >
      <div className="flex gap-4">
        <div className="w-24 h-24 bg-white/5 rounded-lg flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-bold text-lg">{analysis.title || analysis.file_name || 'Unknown File'}</h3>
          <p className="text-sm text-gray-400 mt-1">{analysis.url}</p>
          <div className="mt-4 flex gap-2">
            <span className="px-2 py-1 text-xs bg-white/10 rounded">{analysis.media_type}</span>
            {analysis.file_size && (
              <span className="px-2 py-1 text-xs bg-white/10 rounded">
                {(analysis.file_size / 1024 / 1024).toFixed(2)} MB
              </span>
            )}
          </div>
        </div>
      </div>
      <button className="w-full mt-6 btn-primary py-3 rounded-lg font-bold">
        Download Now
      </button>
    </motion.div>
  )
}
