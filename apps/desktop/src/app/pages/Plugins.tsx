import React from 'react'

export default function Plugins() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Plugins</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass p-4 rounded-xl">
          <h3 className="font-bold">Core Download Plugin</h3>
          <p className="text-sm text-gray-400 mt-2">Handles standard HTTP/HTTPS downloads with multi-part support.</p>
        </div>
      </div>
    </div>
  )
}
