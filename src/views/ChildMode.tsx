import { useCallback, useEffect, useRef, useState } from 'react'
import { useStore } from '../store'
import { SymbolCard } from '../components/ui'
import { speak } from '../speech'
import type { VocabularyConcept } from '../types'

const HOLD_MS = 2000

/**
 * Child Mode (Design §4):
 * - core rail is position-stable and identical in every scene
 * - contextual words live in a separate region and change with the scene
 * - tap = calm pressed feedback + speech; no correctness state, no rewards
 * - parent exit requires a deliberate 2s hold
 */
export function ChildMode({ onExit }: { onExit: () => void }) {
  const { state, scene, label, tr } = useStore()
  const [pressedId, setPressedId] = useState<string | null>(null)
  const [holding, setHolding] = useState(false)
  const holdTimer = useRef<number | null>(null)
  const pressTimer = useRef<number | null>(null)

  // Fullscreen where supported (iPad PWA already full-screen from home screen).
  useEffect(() => {
    const el = document.documentElement
    el.requestFullscreen?.().catch(() => {})
    return () => {
      if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {})
    }
  }, [])

  const press = useCallback(
    (c: VocabularyConcept) => {
      speak(label(c), state.settings.lang, state.settings.voiceRate)
      setPressedId(c.id)
      if (pressTimer.current) window.clearTimeout(pressTimer.current)
      pressTimer.current = window.setTimeout(() => setPressedId(null), 160)
    },
    [label, state.settings.lang, state.settings.voiceRate],
  )

  const startHold = () => {
    setHolding(true)
    holdTimer.current = window.setTimeout(onExit, HOLD_MS)
  }
  const cancelHold = () => {
    setHolding(false)
    if (holdTimer.current) window.clearTimeout(holdTimer.current)
  }

  const n = scene.contextualConceptIds.length
  const cols = n <= 4 ? 2 : 3

  return (
    <div className={'child' + (state.settings.reduceMotion ? ' reduce-motion' : '')} role="application" aria-label="Child mode">
      <aside className="child-core" aria-label={tr('coreWords')}>
        {state.core.map((c, i) => (
          <SymbolCard key={c.id} concept={c} as="button" size="lg" tone={i} onClick={() => press(c)} pressed={pressedId === c.id} />
        ))}
      </aside>

      <main className="child-main">
        <header className="child-top">
          <div className="child-scene">
            <span className="child-scene-visual" aria-hidden="true">
              {scene.photo ? <img src={scene.photo} alt="" /> : scene.icon}
            </span>
            <span className="child-scene-name">{label(scene)}</span>
          </div>
          <button
            type="button"
            className={'parent-lock' + (holding ? ' is-holding' : '')}
            style={{ ['--hold' as string]: `${HOLD_MS}ms` }}
            onPointerDown={startHold}
            onPointerUp={cancelHold}
            onPointerLeave={cancelHold}
            onPointerCancel={cancelHold}
            onContextMenu={(e) => e.preventDefault()}
            aria-label={tr('holdToExit')}
            title={tr('holdToExit')}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <rect x="5" y="10" width="14" height="10" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
              <path d="M8 10V7.5a4 4 0 0 1 8 0V10" fill="none" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          </button>
        </header>

        <div className="child-grid" style={{ ['--cols' as string]: cols }} aria-label={tr('sceneWords')}>
          {scene.contextualConceptIds.map((id) => {
            const c = state.library.find((x) => x.id === id) ?? state.core.find((x) => x.id === id) ?? { id, en: id, zh: id }
            return <SymbolCard key={id} concept={c} as="button" size="xl" onClick={() => press(c)} pressed={pressedId === id} />
          })}
        </div>
      </main>
    </div>
  )
}
