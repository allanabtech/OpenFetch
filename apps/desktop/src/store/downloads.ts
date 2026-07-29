import { create } from 'zustand'
import { Download } from '../lib/types'

interface DownloadsState {
  downloads: Download[]
  history: Download[]
  isLoading: boolean
  error: string | null
  setDownloads: (downloads: Download[]) => void
  addDownload: (download: Download) => void
  updateDownload: (id: string, updates: Partial<Download>) => void
  removeDownload: (id: string) => void
  setHistory: (history: Download[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useDownloadsStore = create<DownloadsState>((set) => ({
  downloads: [],
  history: [],
  isLoading: false,
  error: null,
  setDownloads: (downloads) => set({ downloads }),
  addDownload: (download) => set((state) => ({ downloads: [...state.downloads, download] })),
  updateDownload: (id, updates) => set((state) => ({
    downloads: state.downloads.map(d => d.id === id ? { ...d, ...updates } : d)
  })),
  removeDownload: (id) => set((state) => ({
    downloads: state.downloads.filter(d => d.id !== id)
  })),
  setHistory: (history) => set({ history }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}))
