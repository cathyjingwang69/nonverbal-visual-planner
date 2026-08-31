import { useMemo } from 'react'
import { useStore } from '../store'
import { useNav } from '../nav'
import { Eyebrow, SymbolCard } from '../components/ui'
import { ConceptVisual, Icon, SceneVisual } from '../components/Glyph'
import { ScriptCard } from '../components/ScriptCard'
import { scriptsFor, opportunitiesFor, ifNothingFor } from '../data/coach'
import { useDayClock } from '../dayclock'
import { fmtTime } from '../utils'
import { PARTNERS } from '../i18n'

export function Today() {
  const { state, dispatch, tr, label, scene, focus, conceptById } = useStore()
  const nav = useNav()
  const lang = state.settings.lang
  const name = state.settings.childName
  const focusWord = conceptById(focus.conceptId)
  const clock = useDayClock(state.scenes)
  const isNow = clock.current?.id === scene.id

  const dateLabel = new Date().toLocaleDateString(lang === 'en' ? 'en-AU' : 'zh-CN', { weekday: 'long', day: 'numeric', month: 'long' })

  // One script for the current scene — built from its words, so it matches what's actually there.
  const script = useMemo(() => {
    const words = scene.contextualConceptIds.map((id) => ({ id, label: conceptById(id) }))
    const s = scriptsFor(focus.conceptId, label(focusWord), words, lang)
    // Prefer a vetted, scene-specific opportunity if one exists; otherwise the first composed script.
    const vetted = opportunitiesFor(focus.conceptId, scene.id)[0]
    if (vetted && vetted !== undefined && opportunitiesFor(focus.conceptId, scene.id).length >= 2) {
      const L = lang === 'en' ? 0 : 1
      return {
        key: 'vetted',
        aboutId: null,
        title: vetted.title[L],
        setup: vetted.step[L],
        say: lang === 'en' ? `"${label(focusWord)}" — tap ${label(focusWord).toUpperCase()} once, then hands off.` : `说“${label(focusWord)}”——点一次「${label(focusWord)}」，然后把手放开。`,
        ifNothing: ifNothingFor(focus.conceptId, lang),
        why: vetted.why[L],
      }
    }
    return s[0] ?? null
  }, [scene, focus.conceptId, focusWord, lang, label, conceptById])

  const insight = useMemo(() => {
    const ev = state.events.filter((e) => e.conceptId === focus.conceptId)
    if (ev.length < 6) return null
    const byScene = new Map<string, { ind: number; total: number }>()
    for (const e of ev) {
      const r = byScene.get(e.sceneId) ?? { ind: 0, total: 0 }
      r.total++
      if (e.classification === 'independent') r.ind++
      byScene.set(e.sceneId, r)
    }
    const rows = [...byScene].filter(([, r]) => r.total >= 3).map(([id, r]) => ({ id, rate: r.ind / r.total, ...r }))
    if (rows.length < 2) return null
    rows.sort((a, b) => b.rate - a.rate)
    const best = state.scenes.find((s) => s.id === rows[0].id)
    const worst = state.scenes.find((s) => s.id === rows[rows.length - 1].id)
    if (!best || !worst || best.id === worst.id) return null
    return lang === 'en'
      ? `${name} is using ${label(focusWord).toUpperCase()} more independently during ${label(best)} than ${label(worst)}. Try keeping the same card, position and wait time across both this week.`
      : `${name} 在「${label(best)}」中比「${label(worst)}」更独立地使用「${label(focusWord)}」。本周试着在两个场景中保持相同的卡片、位置和等待时间。`
  }, [state.events, state.scenes, focus.conceptId, focusWord, lang, label, name])

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <Eyebrow>{dateLabel}</Eyebrow>
          <h1>{tr('dayTitle', { name })}</h1>
          <p className="lede">{tr('daySub')}</p>
        </div>
        <button type="button" className="focus-pill" onClick={() => nav.go('therapist')}>
          <span className="focus-pill-label">{tr('thisWeekFocus')}</span>
          <span className="focus-pill-word">
            <span className="focus-glyph" aria-hidden="true">
              <ConceptVisual id={focus.conceptId} />
            </span>
            {label(focusWord).toUpperCase()}
            <span className="focus-version">v{focus.version}</span>
          </span>
          <span className="focus-pill-meta">
            {tr('fromTherapist', { who: focus.author })} · {tr('waitFor', { n: focus.waitSeconds })}
          </span>
        </button>
      </header>

      <section className="section">
        <div className="section-head">
          <h2>{tr('todaysScenes')}</h2>
          <button type="button" className="btn-soft" onClick={() => nav.go('scenes')}>
            {tr('manageScenes')}
          </button>
        </div>
        <ol className="dayline" aria-label={tr('todaysScenes')}>
          {state.scenes.map((s) => {
            const active = s.id === scene.id
            const now = clock.current?.id === s.id
            return (
              <li key={s.id} className={'dayline-item' + (active ? ' is-active' : '') + (now ? ' is-now' : '')}>
                <button type="button" className="dayline-btn" onClick={() => dispatch({ type: 'setCurrentScene', id: s.id })} aria-current={active ? 'true' : undefined}>
                  <span className="dayline-time">
                    {fmtTime(s.time)}
                    {now && <em className="dayline-now">{tr('now')}</em>}
                  </span>
                  <span className="dayline-dot" aria-hidden="true" />
                  <span className="dayline-visual">
                    <SceneVisual icon={s.icon} photo={s.photo} />
                  </span>
                  <span className="dayline-name">{label(s)}</span>
                  <span className="dayline-words">{s.contextualConceptIds.map((id) => label(conceptById(id))).join(' · ')}</span>
                </button>
              </li>
            )
          })}
          <li className="dayline-item dayline-add">
            <button type="button" className="dayline-btn" onClick={() => nav.editScene('new')}>
              <span className="dayline-time"> </span>
              <span className="dayline-dot is-add" aria-hidden="true">
                <Icon name="plus" size={12} />
              </span>
              <span className="dayline-name">{tr('addScene')}</span>
            </button>
          </li>
        </ol>
      </section>

      <section className="section grid-2">
        <div className="panel">
          <div className="panel-head">
            <div>
              <Eyebrow>{isNow ? tr('rightNow') : tr('currentScene')}</Eyebrow>
              <h2 className="scene-title">
                <span className="scene-thumb" aria-hidden="true">
                  <SceneVisual icon={scene.icon} photo={scene.photo} />
                </span>
                {label(scene)}
              </h2>
              <div className="muted small">
                {fmtTime(scene.time)}
                {clock.next && isNow && clock.minutesToNext != null && (
                  <>
                    {' · '}
                    {tr('nextUp', { scene: label(clock.next), time: fmtTime(clock.next.time) })} ({tr('inMinutes', { n: clock.minutesToNext })})
                  </>
                )}
                {!isNow && clock.current && (
                  <>
                    {' · '}
                    <button type="button" className="btn-inline" onClick={() => dispatch({ type: 'setCurrentScene', id: clock.current!.id })}>
                      {tr('jumpToNow')} → {label(clock.current)}
                    </button>
                  </>
                )}
              </div>
            </div>
            <button type="button" className="btn-soft" onClick={() => nav.editScene(scene.id)}>
              {tr('editCards')}
            </button>
          </div>

          <div className="vocab-head">
            <span>{tr('coreWords')}</span>
            <span className="muted">{tr('fixedEverywhere')}</span>
          </div>
          <div className="vocab-row core">
            {state.core.map((c, i) => (
              <SymbolCard key={c.id} concept={c} size="sm" tone={i} />
            ))}
          </div>

          <div className="vocab-head">
            <span>{tr('sceneWords')}</span>
            <span className="muted">{label(scene)}</span>
          </div>
          <div className="vocab-row scene">
            {scene.contextualConceptIds.map((id) => (
              <SymbolCard key={id} concept={conceptById(id)} size="sm" />
            ))}
          </div>

          <div className="actions">
            <button type="button" className="btn-primary" onClick={nav.startChild}>
              <Icon name="play" size={16} /> {tr('startWith', { name })}
            </button>
            <button type="button" className="btn-soft" onClick={() => nav.go('coach')}>
              {tr('moreIdeas')}
            </button>
          </div>
        </div>

        <div className="stack">
          <div className="panel">
            <Eyebrow>{tr('tryThisNow')}</Eyebrow>
            <div className="muted small" style={{ marginBottom: 10 }}>
              {label(focusWord).toUpperCase()} · {label(scene)}
            </div>
            {script ? <ScriptCard script={script} compact /> : <p className="muted">{tr('scriptsEmpty')}</p>}
            <button type="button" className="btn-link" onClick={() => nav.go('coach')}>
              {tr('whatIf')} →
            </button>
          </div>
          {insight && (
            <div className="insight">
              <strong>{tr('insight')}</strong>
              <p>{insight}</p>
            </div>
          )}
          <div className="panel panel-quiet">
            <Eyebrow>{tr('partner')}</Eyebrow>
            <div className="chips" style={{ marginTop: 8 }}>
              {PARTNERS.map((p) => (
                <button key={p.id} type="button" className={'chip' + (state.settings.partner === p.id ? ' is-selected' : '')} onClick={() => dispatch({ type: 'setSettings', patch: { partner: p.id } })}>
                  {lang === 'en' ? p.en : p.zh}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
