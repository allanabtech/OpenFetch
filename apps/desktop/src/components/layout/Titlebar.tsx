import React from 'react'
import { invoke } from '@tauri-apps/api/core'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { Minus, Square, X } from 'lucide-react'

export default function Titlebar() {
  const handleMinimize = async () => {
    try {
      await invoke('window_minimize')
    } catch {
      try {
        await getCurrentWindow().minimize()
      } catch (err) {
        console.error('Minimize failed:', err)
      }
    }
  }

  const handleMaximize = async () => {
    try {
      await invoke('window_toggle_maximize')
    } catch {
      try {
        const win = getCurrentWindow()
        if (await win.isMaximized()) {
          await win.unmaximize()
        } else {
          await win.maximize()
        }
      } catch (err) {
        console.error('Maximize failed:', err)
      }
    }
  }

  const handleClose = async () => {
    try {
      await invoke('window_close')
    } catch {
      try {
        await getCurrentWindow().close()
      } catch (err) {
        console.error('Close failed:', err)
      }
    }
  }

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
          onClick={handleMinimize}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/10 text-gray-400 transition-colors cursor-pointer"
          title="Minimize"
        >
          <Minus size={14} />
        </button>
        <button 
          onClick={handleMaximize}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/10 text-gray-400 transition-colors cursor-pointer"
          title="Maximize"
        >
          <Square size={12} />
        </button>
        <button 
          onClick={handleClose}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-red-500/80 hover:text-white text-gray-400 transition-colors cursor-pointer"
          title="Close"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}
