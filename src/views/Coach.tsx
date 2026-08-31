import { useMemo, useState } from 'react'
import { useStore } from '../store'
import { useNav } from '../nav'
import { Chip, Eyebrow, SymbolCard } from '../components/ui'
import { Icon, SceneVisual } from '../components/Glyph'
import { ScriptCard } from '../components/ScriptCard'
import { opportunitiesFor, scriptsFor, ifNothingFor, WHAT_IF, type Script } from '../data/coach'
import { CLASSIFICATIONS, MODALITIES, PARTNERS } from '../i18n'
import { useDayClock } from '../dayclock'
import { fmtTime, uid } from '../utils'
import type { Classification } from '../types'

export function Coach() {
  const { state, dispatch, tr, label, scene, focus, conceptById } = useStore()
  const nav = useNav()
  const lang = state.settings.lang
  const L = lang === 'en' ? 0 : 1
  const clock = useDayClock(state.scenes)
  const [wordId, setWordId] = useState(focus.conceptId)
  const [openQ, setOpenQ] = useState<number | null>(null)
  const [cls, setCls] = useState<Classification | null>(null)

  const word = conceptById(wordId)
  const isNow = clock.current?.id === scene.id

  // Ideas: vetted scene-specific ones first, then scripts composed from the scene's own words.
  const scripts = useMemo<Script[]>(() => {
    const vetted = opportunitiesFor(wordId, scene.id)
    const w = label(word)
    const fromVetted: Script[] = (vetted.length >= 2 ? vetted : []).map((v, i) => ({
      key: 'v' + i,
      aboutId: null,
      title: v.title[L],
      setup: v.step[L],
      say: lang === 'en' ? `"${w}" — tap ${w.toUpperCase()} once, then hands off.` : `说“${w}”——点一次「${w}」，然后把手放开。`,
      ifNothing: ifNothingFor(wordId, lang),
      why: v.why[L],
    }))
    const words = scene.contextualConceptIds.map((id) => ({ id, label: conceptById(id) }))
    return [...fromVetted, ...scriptsFor(wordId, w, words, lang)]
  }, [wordId, scene, lang, L, label, word, conceptById])

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

      {/* Time context */}
      <section className="section nowbar">
        <div className="nowbar-scene">
          <span className="nowbar-visual" aria-hidden="true">
            <SceneVisual icon={scene.icon} photo={scene.photo} />
          </span>
          <div>
            <b>{isNow ? tr('happeningNow', { scene: label(scene) }) : `${label(scene)} · ${fmtTime(scene.time)}`}</b>
            <div className="muted small">
              {clock.next && clock.minutesToNext != null
                ? `${tr('nextUp', { scene: label(clock.next), time: fmtTime(clock.next.time) })} · ${tr('inMinutes', { n: clock.minutesToNext })}`
                : ''}
              {!isNow && clock.current && (
                <button type="button" className="btn-inline" onClick={() => dispatch({ type: 'setCurrentScene', id: clock.current!.id })}>
                  {tr('jumpToNow')} → {label(clock.current)}
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="chips">
          {state.scenes.map((s) => (
            <Chip key={s.id} selected={s.id === scene.id} onClick={() => dispatch({ type: 'setCurrentScene', id: s.id })}>
              {label(s)}
            </Chip>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="vocab-row core">
          {available.map((c, i) => (
            <SymbolCard key={c.id} concept={c} size="sm" tone={i < state.core.length ? i : undefined} as="button" onClick={() => setWordId(c.id)} pressed={c.id === wordId} />
          ))}
        </div>
      </section>

      <section className="section grid-2">
        <div className="stack">
          <div className="section-head" style={{ marginBottom: 0 }}>
            <h2>{tr('opportunities')}</h2>
            <span className="muted small">{tr('ideasFromScene')}</span>
          </div>
          {scripts.length === 0 && <p className="muted">{tr('scriptsEmpty')}</p>}
          {scripts.map((s) => (
            <ScriptCard key={s.key} script={s} />
          ))}
          <div className="panel panel-quiet">
            <span className="field-label">{tr('acceptedWays')}</span>
            <div className="chips" style={{ marginTop: 8 }}>
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
                    <Icon name={openQ === i ? 'up' : 'down'} size={16} />
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
              <span className="muted small">
                {label(scene)} · {label(word)} ·
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
                <Icon name="play" size={16} /> {tr('startWith', { name: state.settings.childName })}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
