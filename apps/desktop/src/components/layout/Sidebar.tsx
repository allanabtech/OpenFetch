import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Download, ListOrdered, History, Star, Puzzle, Globe, BarChart2, Settings, ChevronLeft, ChevronRight } from 'lucide-react'
import { useDownloads } from '../../hooks/useDownloads'

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/downloads', label: 'Downloads', icon: Download, badge: true },
  { path: '/queue', label: 'Queue', icon: ListOrdered },
  { path: '/history', label: 'History', icon: History },
  { path: '/favorites', label: 'Favorites', icon: Star },
  { path: '/plugins', label: 'Plugins', icon: Puzzle },
  { path: '/browser', label: 'Browser', icon: Globe },
  { path: '/analytics', label: 'Analytics', icon: BarChart2 },
  { path: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { data: downloads } = useDownloads()
  const activeCount = downloads?.filter(d => ['downloading', 'pending'].includes(d.status)).length || 0

  return (
    <motion.aside
      initial={{ width: 220 }}
      animate={{ width: collapsed ? 64 : 220 }}
      className="glass glass-border h-full flex flex-col shrink-0 relative transition-all duration-300 rounded-none border-t-0 border-b-0 border-l-0 z-10"
    >
      <div className="p-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-md bg-gradient-to-br from-accent-violet to-accent-cyan flex items-center justify-center shadow-glow-violet shrink-0">
          <Download size={18} className="text-white" />
        </div>
        {!collapsed && (
          <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            OpenFetch
          </span>
        )}
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item, i) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 relative group
              ${isActive ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}
            `}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-gradient-to-r from-accent-violet/20 to-transparent rounded-lg border-l-2 border-accent-violet"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon size={20} className="relative z-10" />
                {!collapsed && <span className="relative z-10 text-sm font-medium">{item.label}</span>}
                {!collapsed && item.badge && activeCount > 0 && (
                  <span className="ml-auto bg-accent-violet text-white text-[10px] px-2 py-0.5 rounded-full z-10">
                    {activeCount}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-2 border-t border-white/5">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
    </motion.aside>
  )
}
