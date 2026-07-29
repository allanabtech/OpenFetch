export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatSpeed(bps: number): string {
  return `${formatBytes(bps)}/s`;
}

export function formatETA(seconds: number): string {
  if (!seconds || seconds === Infinity) return '--:--:--';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return [h, m > 9 ? m : h ? '0' + m : m || '0', s > 9 ? s : '0' + s]
    .filter(Boolean)
    .join(':');
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('default', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function getMediaTypeIcon(mediaType: string): string {
  if (mediaType.startsWith('video/')) return '🎥';
  if (mediaType.startsWith('audio/')) return '🎵';
  if (mediaType.startsWith('image/')) return '🖼️';
  if (mediaType.includes('pdf')) return '📄';
  if (mediaType.includes('zip') || mediaType.includes('compressed')) return '📦';
  return '📄';
}

export function getDomainFromUrl(url: string): string {
  try {
    const { hostname } = new URL(url);
    return hostname;
  } catch (e) {
    return '';
  }
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

export function generateDownloadFilename(url: string, contentType: string): string {
  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname;
    const parts = pathname.split('/');
    let filename = parts[parts.length - 1] || 'download';
    if (!filename.includes('.')) {
      const extMap: Record<string, string> = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'video/mp4': 'mp4',
        'application/pdf': 'pdf',
        'application/zip': 'zip'
      };
      const ext = extMap[contentType];
      if (ext) filename += `.${ext}`;
    }
    return filename;
  } catch (e) {
    return 'download';
  }
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
