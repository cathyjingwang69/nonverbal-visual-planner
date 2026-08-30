export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36)

/** Resize an uploaded image to a small JPEG data URL for local storage. */
export function fileToDataUrl(file: File, max = 640): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height))
      const c = document.createElement('canvas')
      c.width = Math.round(img.width * scale)
      c.height = Math.round(img.height * scale)
      c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height)
      URL.revokeObjectURL(url)
      resolve(c.toDataURL('image/jpeg', 0.82))
    }
    img.onerror = () => reject(new Error('Could not read image'))
    img.src = url
  })
}

export function fmtTime(hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number)
  if (Number.isNaN(h)) return hhmm
  const suffix = h >= 12 ? 'pm' : 'am'
  const hh = ((h + 11) % 12) + 1
  return `${hh}:${String(m ?? 0).padStart(2, '0')} ${suffix}`
}

export function relTime(iso: string, lang: 'en' | 'zh') {
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 3600_000)
  if (h < 1) return lang === 'en' ? 'just now' : '刚刚'
  if (h < 24) return lang === 'en' ? `${h}h ago` : `${h}小时前`
  const d = Math.floor(h / 24)
  return lang === 'en' ? `${d}d ago` : `${d}天前`
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10)
}
