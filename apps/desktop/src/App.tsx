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
import Settings from './app/pages/Settings'

export default function App() {
  useEffect(() => {
    // Basic initialization could go here
    document.documentElement.classList.add('dark')
  }, [])

  return (
    <BrowserRouter>
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-base text-text-primary font-sans">
        <Titlebar />
        <div className="flex flex-1 overflow-hidden relative">
          <Sidebar />
          <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
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
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}
