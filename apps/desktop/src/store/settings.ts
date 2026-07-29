import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AppSettings } from '../lib/types'

interface SettingsState {
  settings: AppSettings
  isLoading: boolean
  setSettings: (settings: AppSettings) => void
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void
}

const defaultSettings: AppSettings = {
  theme: 'glass',
  language: 'en',
  download_folder: '~/Downloads',
  max_concurrent_downloads: 3,
  bandwidth_limit_kbps: 0,
  enable_notifications: true,
  enable_clipboard_monitor: true,
  auto_start_downloads: true,
  auto_organize_files: false,
  default_quality: 'high',
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      isLoading: false,
      setSettings: (settings) => set({ settings }),
      updateSetting: (key, value) => set((state) => ({
        settings: { ...state.settings, [key]: value }
      })),
    }),
    {
      name: 'openfetch-settings',
      partialize: (state) => ({ settings: { theme: state.settings.theme, language: state.settings.language } }),
    }
  )
)
