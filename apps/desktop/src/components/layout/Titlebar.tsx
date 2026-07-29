import React from 'react'
import { Window } from '@tauri-apps/api/window'
import { Minus, Square, X } from 'lucide-react'

export default function Titlebar() {
  const appWindow = new Window('main')

  return (
    <div 
      data-tauri-drag-region 
      className="h-9 glass glass-border border-l-0 border-r-0 border-t-0 flex items-center justify-between px-3 shrink-0 select-none z-50 rounded-none bg-surface/80"
    >
      <div className="flex items-center gap-2 pointer-events-none">
        <span className="text-xs font-semibold text-gray-400">OpenFetch</span>
      </div>
      
      <div className="flex items-center pointer-events-none">
        <span className="text-xs text-gray-500">v0.1.0</span>
      </div>
      
      <div className="flex items-center gap-1">
        <button 
          onClick={() => appWindow.minimize()}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/10 text-gray-400 transition-colors"
        >
          <Minus size={14} />
        </button>
        <button 
          onClick={() => appWindow.toggleMaximize()}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/10 text-gray-400 transition-colors"
        >
          <Square size={12} />
        </button>
        <button 
          onClick={() => appWindow.close()}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-red-500/80 hover:text-white text-gray-400 transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}
