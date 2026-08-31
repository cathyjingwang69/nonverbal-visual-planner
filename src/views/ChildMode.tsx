import { useCallback, useEffect, useRef, useState } from 'react'
import { useStore } from '../store'
import { SymbolCard } from '../components/ui'
import { Icon, SceneVisual } from '../components/Glyph'
import { speak } from '../speech'
import type { VocabularyConcept } from '../types'

const HOLD_MS = 2000

/**
 * Child Mode (Design §4):
 * - one grid; every word visible at once, no side panel
 * - the core row is always first and its positions never change
 * - scene words follow at the same tile size
 * - tap = calm pressed feedback + speech; no correctness state, no rewards
 * - parent exit is a labelled, deliberate 2-second hold
 */
export function ChildMode({ onExit }: { onExit: () => void }) {
  const { state, scene, label, tr } = useStore()
  const [pressedId, setPressedId] = useState<string | null>(null)
  const [holding, setHolding] = useState(false)
  const holdTimer = useRef<number | null>(null)
  const pressTimer = useRef<number | null>(null)

  useEffect(() => {
    document.documentElement.requestFullscreen?.().catch(() => {})
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

  const sceneWords = scene.contextualConceptIds.map((id) => state.library.find((x) => x.id === id) ?? state.core.find((x) => x.id === id) ?? { id, en: id, zh: id })
  const cols = 5
  const rows = 1 + Math.max(1, Math.ceil(sceneWords.length / cols))

  return (
    <div className={'child' + (state.settings.reduceMotion ? ' reduce-motion' : '')} role="application" aria-label="Child mode">
      <header className="child-top">
        <div className="child-scene">
          <span className="child-scene-visual" aria-hidden="true">
            <SceneVisual icon={scene.icon} photo={scene.photo} />
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
          aria-label={tr('parentsHold')}
        >
          <span className="parent-lock-ring" aria-hidden="true">
            <Icon name="lock" size={16} />
          </span>
          <span className="parent-lock-text">{holding ? tr('keepHolding') : tr('parentsHold')}</span>
        </button>
      </header>

      <div className="child-grid" style={{ ['--cols' as string]: cols, ['--rows' as string]: rows }}>
        {state.core.map((c, i) => (
          <SymbolCard key={c.id} concept={c} as="button" size="xl" tone={i} onClick={() => press(c)} pressed={pressedId === c.id} />
        ))}
        {sceneWords.map((c) => (
          <SymbolCard key={c.id} concept={c} as="button" size="xl" onClick={() => press(c)} pressed={pressedId === c.id} />
        ))}
      </div>
    </div>
  )
}
