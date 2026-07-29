import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as tauriApi from '../lib/tauri'

export const useDownloads = () => {
  return useQuery({
    queryKey: ['downloads'],
    queryFn: tauriApi.getDownloads,
    refetchInterval: 500,
  })
}

export const useDownload = (id: string) => {
  return useQuery({
    queryKey: ['downloads', id],
    queryFn: () => tauriApi.getDownload(id),
    enabled: !!id,
    refetchInterval: 500,
  })
}

export const useHistory = () => {
  return useQuery({
    queryKey: ['history'],
    queryFn: tauriApi.getHistory,
  })
}

export const useStartDownload = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ url, options }: { url: string; options?: any }) => tauriApi.startDownload(url, options),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['downloads'] }),
  })
}

export const usePauseDownload = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: tauriApi.pauseDownload,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['downloads'] }),
  })
}

export const useResumeDownload = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: tauriApi.resumeDownload,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['downloads'] }),
  })
}

export const useCancelDownload = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: tauriApi.cancelDownload,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['downloads'] }),
  })
}

export const useDeleteDownload = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, deleteFile }: { id: string; deleteFile: boolean }) => tauriApi.deleteDownload(id, deleteFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['downloads'] })
      queryClient.invalidateQueries({ queryKey: ['history'] })
    },
  })
}

export const useRetryDownload = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: tauriApi.retryDownload,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['downloads'] }),
  })
}
