import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Sidebar from './components/layout/Sidebar'
import Titlebar from './components/layout/Titlebar'
import Home from './app/pages/Home'
import Downloads from './app/pages/Downloads'
import Queue from './app/pages/Queue'
import History from './app/pages/History'
import Favorites from './app/pages/Favorites'
import Plugins from './app/pages/Plugins'
import Browser from './app/pages/Browser'
import Analytics from './app/pages/Analytics'

export default function App() {
  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  return (
    <BrowserRouter>
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-base text-text-primary font-sans">
        <Titlebar />
        <div className="flex flex-1 overflow-hidden relative">
          <Sidebar />
          <main className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col">
            <div className="flex-1">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/downloads" element={<Downloads />} />
                  <Route path="/queue" element={<Queue />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/plugins" element={<Plugins />} />
                  <Route path="/browser" element={<Browser />} />
                  <Route path="/analytics" element={<Analytics />} />
                </Routes>
              </AnimatePresence>
            </div>
            <footer className="py-2 px-4 text-center text-[11px] text-gray-500/70 select-none border-t border-white/5 bg-surface/30">
              Made with ❤️ and energy drinks
            </footer>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}
