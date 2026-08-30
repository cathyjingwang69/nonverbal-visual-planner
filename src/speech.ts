import type { Lang } from './types'

let voices: SpeechSynthesisVoice[] = []
if (typeof speechSynthesis !== 'undefined') {
  const load = () => {
    voices = speechSynthesis.getVoices()
  }
  load()
  speechSynthesis.addEventListener?.('voiceschanged', load)
}

const LOCALE: Record<Lang, string> = { en: 'en-AU', zh: 'zh-CN' }

function pickVoice(lang: Lang) {
  const want = LOCALE[lang].toLowerCase()
  const base = want.slice(0, 2)
  return (
    voices.find((v) => v.lang.toLowerCase() === want) ??
    voices.find((v) => v.lang.toLowerCase().startsWith(base)) ??
    null
  )
}

export function speak(text: string, lang: Lang, rate = 0.88) {
  if (typeof speechSynthesis === 'undefined') return
  speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = LOCALE[lang]
  u.rate = rate
  const v = pickVoice(lang)
  if (v) u.voice = v
  speechSynthesis.speak(u)
}

export const speechAvailable = typeof speechSynthesis !== 'undefined'
