import { useEffect, useRef, useState } from 'react'
import { Icon } from './Glyph'

/**
 * Wait timer for modelling: counts down the clinician-set wait silently,
 * then tells the adult to carry on. No sound, no alarm — a quiet cue.
 */
export function WaitTimer({ seconds, lang, size = 'md' }: { seconds: number; lang: 'en' | 'zh'; size?: 'md' | 'lg' }) {
  const [left, setLeft] = useState<number | null>(null)
  const [done, setDone] = useState(false)
  const raf = useRef<number | null>(null)
  const startAt = useRef(0)

  useEffect(() => () => { if (raf.current) cancelAnimationFrame(raf.current) }, [])

  const start = () => {
    setDone(false)
    startAt.current = performance.now()
    const tick = () => {
      const elapsed = (performance.now() - startAt.current) / 1000
      const remaining = Math.max(0, seconds - elapsed)
      setLeft(remaining)
      if (remaining > 0) raf.current = requestAnimationFrame(tick)
      else {
        setDone(true)
        setLeft(null)
      }
    }
    tick()
  }
  const reset = () => {
    if (raf.current) cancelAnimationFrame(raf.current)
    setLeft(null)
    setDone(false)
  }

  const running = left !== null
  const pct = running ? 1 - left / seconds : 0
  const r = 16
  const c = 2 * Math.PI * r

  if (done)
    return (
      <div className={'wait wait-done wait-' + size} role="status">
        <span className="wait-msg">{lang === 'en' ? 'Carry on — try again later.' : '继续吧——稍后再试。'}</span>
        <button type="button" className="btn-link" onClick={reset}>
          {lang === 'en' ? 'Again' : '再来一次'}
        </button>
      </div>
    )

  return (
    <button type="button" className={'wait wait-' + size + (running ? ' is-running' : '')} onClick={running ? reset : start} aria-live="polite">
      <span className="wait-ring" aria-hidden="true">
        <svg viewBox="0 0 40 40" width="40" height="40">
          <circle cx="20" cy="20" r={r} className="wait-track" />
          <circle cx="20" cy="20" r={r} className="wait-fill" strokeDasharray={c} strokeDashoffset={c * (1 - pct)} transform="rotate(-90 20 20)" />
        </svg>
        <span className="wait-num">{running ? Math.ceil(left) : <Icon name="timer" size={16} />}</span>
      </span>
      <span className="wait-text">
        {running
          ? lang === 'en' ? 'Waiting… say nothing' : '等待中……什么都不说'
          : lang === 'en' ? `Start ${seconds}-second wait` : `开始 ${seconds} 秒等待`}
      </span>
    </button>
  )
}
