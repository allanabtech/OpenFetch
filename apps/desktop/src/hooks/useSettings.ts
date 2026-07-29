import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as tauriApi from '../lib/tauri'
import { AppSettings } from '../lib/types'

export const useSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: tauriApi.getSettings,
  })
}

export const useUpdateSettings = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (settings: AppSettings) => tauriApi.setSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
    },
  })
}

export const useUpdateSetting = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: any }) => tauriApi.setSetting(key, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
    },
  })
}
