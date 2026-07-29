import React from 'react'

export default function Analytics() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Analytics</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="glass p-4 rounded-xl">
          <h3 className="text-gray-400 text-sm">Total Downloads</h3>
          <p className="text-2xl font-bold mt-1">0</p>
        </div>
        <div className="glass p-4 rounded-xl">
          <h3 className="text-gray-400 text-sm">Data Downloaded</h3>
          <p className="text-2xl font-bold mt-1">0 GB</p>
        </div>
        <div className="glass p-4 rounded-xl">
          <h3 className="text-gray-400 text-sm">Avg Speed</h3>
          <p className="text-2xl font-bold mt-1">0 MB/s</p>
        </div>
      </div>
    </div>
  )
}
