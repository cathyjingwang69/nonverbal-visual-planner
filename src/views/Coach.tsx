import { useState } from 'react'
import { useStore } from '../store'
import { useNav } from '../nav'
import { Chip, Eyebrow, SymbolCard } from '../components/ui'
import { opportunitiesFor, WHAT_IF } from '../data/coach'
import { CLASSIFICATIONS, MODALITIES, PARTNERS } from '../i18n'
import { uid } from '../utils'
import type { Classification } from '../types'

export function Coach() {
  const { state, dispatch, tr, label, scene, focus, conceptById } = useStore()
  const nav = useNav()
  const lang = state.settings.lang
  const L = lang === 'en' ? 0 : 1
  const [wordId, setWordId] = useState(focus.conceptId)
  const [openQ, setOpenQ] = useState<number | null>(0)
  const [cls, setCls] = useState<Classification | null>(null)
  const [rotate, setRotate] = useState(0)

  const word = conceptById(wordId)
  const allTips = opportunitiesFor(wordId, scene.id)
  const tips = allTips.length > 3 ? allTips.slice(rotate % allTips.length).concat(allTips.slice(0, rotate % allTips.length)).slice(0, 3) : allTips
  const available = [...state.core, ...scene.contextualConceptIds.map(conceptById)]

  const save = () => {
    if (!cls) return
    dispatch({
      type: 'logEvent',
      event: { id: uid(), at: new Date().toISOString(), sceneId: scene.id, conceptId: wordId, classification: cls, partner: state.settings.partner },
    })
    setCls(null)
    nav.toast(tr('saved'))
  }

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <Eyebrow>{tr('coach')}</Eyebrow>
          <h1>{tr('coachSub', { word: label(word).toUpperCase(), scene: label(scene) })}</h1>
          <p className="lede">{tr('waitRule', { n: focus.waitSeconds, who: focus.author })}</p>
        </div>
      </header>

      <section className="section">
        <div className="chips">
          {state.scenes.map((s) => (
            <Chip key={s.id} selected={s.id === scene.id} onClick={() => dispatch({ type: 'setCurrentScene', id: s.id })}>
              {s.icon} {label(s)}
            </Chip>
          ))}
        </div>
        <div className="vocab-row core" style={{ marginTop: 14 }}>
          {available.map((c, i) => (
            <SymbolCard key={c.id} concept={c} size="sm" tone={i < state.core.length ? i : undefined} as="button" onClick={() => setWordId(c.id)} pressed={c.id === wordId} />
          ))}
        </div>
      </section>

      <section className="section grid-2">
        <div className="panel">
          <div className="panel-head">
            <h2 className="panel-title">{tr('opportunities')}</h2>
            {allTips.length > 3 && (
              <button type="button" className="btn-soft" onClick={() => setRotate((r) => r + 1)}>
                {tr('anotherIdea')}
              </button>
            )}
          </div>
          <ol className="tips large">
            {tips.map((tip, i) => (
              <li key={i} className="tip">
                <b>{tip.title[L]}</b>
                <span>{tip.step[L]}</span>
                <em>{tip.why[L]}</em>
              </li>
            ))}
          </ol>
          <div className="modalities">
            <span className="field-label">{tr('acceptedWays')}</span>
            <div className="chips">
              {MODALITIES.filter((m) => focus.modalities.includes(m.id)).map((m) => (
                <span key={m.id} className="chip is-static">
                  {lang === 'en' ? m.en : m.zh}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="stack">
          <div className="panel">
            <h2 className="panel-title">{tr('whatIf')}</h2>
            <div className="accordion">
              {WHAT_IF.map((w, i) => (
                <div key={i} className={'acc-item' + (openQ === i ? ' is-open' : '')}>
                  <button type="button" className="acc-q" onClick={() => setOpenQ(openQ === i ? null : i)} aria-expanded={openQ === i}>
                    {w.q[L]}
                    <span aria-hidden="true">{openQ === i ? '–' : '+'}</span>
                  </button>
                  {openQ === i && <p className="acc-a">{i === 5 ? tr('waitRule', { n: focus.waitSeconds, who: focus.author }) : w.a[L]}</p>}
                </div>
              ))}
            </div>
          </div>

          <div className="panel log">
            <Eyebrow>{tr('logMoment')}</Eyebrow>
            <h2 className="panel-title">{tr('whatHappened')}</h2>
            <div className="class-grid">
              {CLASSIFICATIONS.map((c) => (
                <button key={c.id} type="button" className={'class-btn' + (cls === c.id ? ' is-selected' : '')} onClick={() => setCls(c.id)} aria-pressed={cls === c.id}>
                  <b>{lang === 'en' ? c.en : c.zh}</b>
                  <span>{c.hint[L]}</span>
                </button>
              ))}
            </div>
            <div className="row wrap" style={{ marginTop: 12 }}>
              <span className="muted">
                {tr('scene')}: {label(scene)} · {tr('word')}: {label(word)} · {tr('partner')}:
              </span>
              <div className="chips">
                {PARTNERS.map((p) => (
                  <Chip key={p.id} selected={state.settings.partner === p.id} onClick={() => dispatch({ type: 'setSettings', patch: { partner: p.id } })}>
                    {lang === 'en' ? p.en : p.zh}
                  </Chip>
                ))}
              </div>
            </div>
            <div className="actions">
              <button type="button" className="btn-primary" disabled={!cls} onClick={save}>
                {tr('saveMoment')}
              </button>
              <button type="button" className="btn-soft" onClick={nav.startChild}>
                ▶ {tr('startWith', { name: state.settings.childName })}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
