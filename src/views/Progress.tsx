import { useMemo } from 'react'
import { useStore } from '../store'
import { Eyebrow } from '../components/ui'
import { CLASSIFICATIONS, PARTNERS } from '../i18n'
import { relTime } from '../utils'

const MIN_CELL = 3

export function Progress() {
  const { state, dispatch, tr, label, focus, conceptById } = useStore()
  const lang = state.settings.lang
  const ev = state.events
  const hasSample = ev.some((e) => e.sample)

  const counts = useMemo(() => {
    const c = { opp: ev.length, independent: 0, modelled: 0, alternative: 0, unclear: 0 }
    for (const e of ev) {
      if (e.classification === 'independent') c.independent++
      else if (e.classification === 'modelled' || e.classification === 'prompted') c.modelled++
      else if (e.classification === 'alternative') c.alternative++
      else if (e.classification === 'unclear') c.unclear++
    }
    return c
  }, [ev])

  // 14-day rhythm: independent vs everything else per day.
  const days = useMemo(() => {
    const out: { key: string; label: string; ind: number; other: number }[] = []
    for (let i = 13; i >= 0; i--) {
      const d = new Date()
      d.setHours(0, 0, 0, 0)
      d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      out.push({ key, label: d.toLocaleDateString(lang === 'en' ? 'en-AU' : 'zh-CN', { weekday: 'narrow' }), ind: 0, other: 0 })
    }
    for (const e of ev) {
      const key = new Date(e.at).toISOString().slice(0, 10)
      const row = out.find((r) => r.key === key)
      if (!row) continue
      if (e.classification === 'independent') row.ind++
      else if (e.classification !== 'refusal') row.other++
    }
    return out
  }, [ev, lang])
  const maxDay = Math.max(1, ...days.map((d) => d.ind + d.other))

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <Eyebrow>{tr('progress')}</Eyebrow>
          <h1>{tr('progressTitle')}</h1>
          <p className="lede">{tr('progressSub')}</p>
        </div>
        {hasSample && (
          <button type="button" className="btn-soft" onClick={() => dispatch({ type: 'clearSample' })}>
            {tr('clearSample')}
          </button>
        )}
      </header>

      <section className="section stats">
        <Stat n={counts.opp} label={tr('opportunitiesN')} />
        <Stat n={counts.independent} label={tr('independentN')} strong />
        <Stat n={counts.modelled} label={tr('modelledN')} />
        <Stat n={counts.alternative} label={tr('otherN')} />
        <Stat n={counts.unclear} label={tr('unclearN')} />
      </section>

      <section className="section grid-2">
        <div className="panel">
          <h2 className="panel-title">{tr('generalisation', { word: label(conceptById(focus.conceptId)).toUpperCase() })}</h2>
          <GeneralisationMatrix conceptId={focus.conceptId} />
          <p className="field-hint">{tr('generalisationHint')}</p>

          <h2 className="panel-title" style={{ marginTop: 22 }}>
            {tr('last14')}
          </h2>
          <div className="rhythm" role="img" aria-label={tr('last14')}>
            {days.map((d) => (
              <div key={d.key} className="rhythm-col" title={`${d.key}: ${d.ind} / ${d.other}`}>
                <div className="rhythm-bar">
                  <span className="rhythm-other" style={{ height: `${(d.other / maxDay) * 100}%` }} />
                  <span className="rhythm-ind" style={{ height: `${(d.ind / maxDay) * 100}%` }} />
                </div>
                <span className="rhythm-label">{d.label}</span>
              </div>
            ))}
          </div>
          <div className="legend">
            <span>
              <i className="sw ind" /> {tr('independentN')}
            </span>
            <span>
              <i className="sw other" /> {tr('modelledN')} / {tr('otherN')}
            </span>
          </div>
        </div>

        <div className="panel">
          <h2 className="panel-title">{tr('recentMoments')}</h2>
          {ev.length === 0 ? (
            <p className="muted">{tr('noEvents')}</p>
          ) : (
            <ul className="moments">
              {ev.slice(0, 14).map((e) => {
                const sc = state.scenes.find((s) => s.id === e.sceneId)
                const cl = CLASSIFICATIONS.find((c) => c.id === e.classification)!
                const pa = PARTNERS.find((p) => p.id === e.partner)!
                return (
                  <li key={e.id} className="moment">
                    <span className="moment-main">
                      <span aria-hidden="true">{sc?.icon ?? '·'}</span> {sc ? label(sc) : e.sceneId} · <b>{label(conceptById(e.conceptId))}</b>
                      <span className="muted">
                        {' '}
                        · {lang === 'en' ? pa.en : pa.zh} · {relTime(e.at, lang)}
                      </span>
                      {e.sample && <span className="badge">{tr('sampleBadge')}</span>}
                    </span>
                    <span className={'tag tag-' + e.classification}>{lang === 'en' ? cl.en : cl.zh}</span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </section>
    </div>
  )
}

function Stat({ n, label, strong }: { n: number; label: string; strong?: boolean }) {
  return (
    <div className={'stat' + (strong ? ' is-strong' : '')}>
      <strong>{n}</strong>
      <span>{label}</span>
    </div>
  )
}

/** Scene × partner matrix: filled dots = independent uses (capped at 3), read only past MIN_CELL moments. */
export function GeneralisationMatrix({ conceptId }: { conceptId: string }) {
  const { state, label } = useStore()
  const lang = state.settings.lang
  const partners = PARTNERS.filter((p) => state.events.some((e) => e.partner === p.id) || ['mum', 'dad', 'school'].includes(p.id))
  const scenes = state.scenes
  const cell = (sceneId: string, partner: string) => {
    const rows = state.events.filter((e) => e.conceptId === conceptId && e.sceneId === sceneId && e.partner === partner)
    const ind = rows.filter((e) => e.classification === 'independent').length
    return { total: rows.length, ind }
  }
  return (
    <table className="matrix">
      <thead>
        <tr>
          <th />
          {partners.map((p) => (
            <th key={p.id}>{lang === 'en' ? p.en : p.zh}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {scenes.map((s) => (
          <tr key={s.id}>
            <th scope="row">
              <span aria-hidden="true">{s.icon}</span> {label(s)}
            </th>
            {partners.map((p) => {
              const c = cell(s.id, p.id)
              if (c.total === 0) return <td key={p.id} className="cell-empty">—</td>
              const filled = Math.min(3, c.ind)
              const thin = c.total < MIN_CELL
              return (
                <td key={p.id} className={'cell' + (thin ? ' is-thin' : '')} title={`${c.ind} independent of ${c.total}`}>
                  <span className="dots" aria-label={`${c.ind} of ${c.total}`}>
                    {'●'.repeat(filled)}
                    {'○'.repeat(3 - filled)}
                  </span>
                  <span className="cell-n">{c.total}</span>
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
