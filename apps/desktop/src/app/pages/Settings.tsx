import React from 'react'

export default function Settings() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="max-w-2xl space-y-6">
        <div className="glass p-6 rounded-xl">
          <h2 className="text-lg font-medium mb-4">Appearance</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Theme</span>
              <select className="bg-white/10 border-none rounded px-3 py-1 outline-none text-white">
                <option value="glass">Glassmorphism</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
