import { create } from 'zustand'
import { UrlAnalysis } from '../lib/types'

interface UiState {
  currentPage: string
  isAnalyzerOpen: boolean
  analyzedUrl: UrlAnalysis | null
  isClipboardPopupOpen: boolean
  clipboardUrl: string | null
  theme: string
  setCurrentPage: (page: string) => void
  openAnalyzer: () => void
  closeAnalyzer: () => void
  setAnalyzedUrl: (url: UrlAnalysis | null) => void
  openClipboardPopup: (url: string) => void
  closeClipboardPopup: () => void
  setTheme: (theme: string) => void
}

export const useUiStore = create<UiState>((set) => ({
  currentPage: '/',
  isAnalyzerOpen: false,
  analyzedUrl: null,
  isClipboardPopupOpen: false,
  clipboardUrl: null,
  theme: 'glass',
  setCurrentPage: (page) => set({ currentPage: page }),
  openAnalyzer: () => set({ isAnalyzerOpen: true }),
  closeAnalyzer: () => set({ isAnalyzerOpen: false }),
  setAnalyzedUrl: (url) => set({ analyzedUrl: url }),
  openClipboardPopup: (url) => set({ isClipboardPopupOpen: true, clipboardUrl: url }),
  closeClipboardPopup: () => set({ isClipboardPopupOpen: false, clipboardUrl: null }),
  setTheme: (theme) => set({ theme }),
}))
