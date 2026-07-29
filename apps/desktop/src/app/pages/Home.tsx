import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Github, Download } from 'lucide-react'
import URLAnalyzer from '../../components/analyzer/URLAnalyzer'

export default function Home() {
  const [url, setUrl] = useState('')
  const [analyzed, setAnalyzed] = useState(false)

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault()
    if (url) setAnalyzed(true)
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="p-8 h-full flex flex-col items-center justify-center relative"
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
            <button type="submit" className="btn-primary mr-2">
              Analyze
            </button>
          </div>
        </motion.form>

        {analyzed && (
          <URLAnalyzer analysis={{ url, media_type: 'generic', plugin_id: 'core', is_authentication_required: false, is_publicly_available: true }} />
        )}
      </div>
    </motion.div>
  )
}
