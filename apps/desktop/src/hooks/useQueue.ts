import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as tauriApi from '../lib/tauri'

export const useQueue = () => {
  return useQuery({
    queryKey: ['queue'],
    queryFn: async () => {
      const downloads = await tauriApi.getDownloads()
      return downloads.filter(d => ['pending', 'downloading'].includes(d.status)).sort((a, b) => b.priority - a.priority)
    },
    refetchInterval: 1000,
  })
}

export const useSetPriority = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, priority }: { id: string; priority: number }) => tauriApi.setDownloadPriority(id, priority),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queue'] })
      queryClient.invalidateQueries({ queryKey: ['downloads'] })
    },
  })
}

export const useScheduleDownload = () => {
  // Placeholder for scheduling feature
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, time }: { id: string; time: string }) => {
      console.log('Scheduled', id, time)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['queue'] }),
  })
}
