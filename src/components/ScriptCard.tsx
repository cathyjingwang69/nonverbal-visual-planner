import type { Script } from '../data/coach'
import { useStore } from '../store'
import { WaitTimer } from './WaitTimer'
import { ConceptVisual } from './Glyph'

/** A modelling idea as a script an adult can follow in the moment. */
export function ScriptCard({ script, compact }: { script: Script; compact?: boolean }) {
  const { state, tr, focus, conceptById, label } = useStore()
  const lang = state.settings.lang
  return (
    <article className={'script' + (compact ? ' script-compact' : '')}>
      <header className="script-head">
        {script.aboutId && (
          <span className="script-visual" aria-hidden="true">
            <ConceptVisual id={script.aboutId} />
          </span>
        )}
        <div>
          <h3>{script.title}</h3>
          {script.aboutId && <span className="muted small">{tr('aboutWord', { word: label(conceptById(script.aboutId)) })}</span>}
          {script.why && <span className="muted small">{script.why}</span>}
        </div>
      </header>
      <ol className="script-steps">
        <li>
          <span className="step-label">{tr('setUp')}</span>
          <span>{script.setup}</span>
        </li>
        <li>
          <span className="step-label">{tr('sayAndTap')}</span>
          <span className="script-say">{script.say}</span>
        </li>
        <li>
          <span className="step-label">{tr('thenWait')}</span>
          <WaitTimer seconds={focus.waitSeconds} lang={lang} />
        </li>
        <li>
          <span className="step-label">{tr('ifNothing')}</span>
          <span>{script.ifNothing}</span>
        </li>
      </ol>
    </article>
  )
}
