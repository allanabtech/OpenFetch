import { useQuery } from '@tanstack/react-query'
import * as tauriApi from '../lib/tauri'

export const useAnalyzeUrl = (url: string | null) => {
  return useQuery({
    queryKey: ['analyzeUrl', url],
    queryFn: () => {
      if (!url) throw new Error('No URL provided');
      return tauriApi.analyzeUrl(url);
    },
    enabled: !!url && url.length > 5,
    staleTime: 60000,
  })
}
