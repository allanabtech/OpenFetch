import React from 'react'
import { motion } from 'framer-motion'
import DownloadCard from '../../components/download/DownloadCard'
import { useDownloads } from '../../hooks/useDownloads'

export default function Downloads() {
  const { data: downloads = [] } = useDownloads()

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Downloads</h1>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-sm glass hover:bg-white/10 rounded-md">Pause All</button>
          <button className="px-3 py-1.5 text-sm glass hover:bg-white/10 rounded-md">Resume All</button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {downloads.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <p>No active downloads.</p>
          </div>
        ) : (
          downloads.map(download => (
            <DownloadCard key={download.id} download={download} />
          ))
        )}
      </div>
    </div>
  )
}
