import { useEffect, useState } from 'react'
import { useStore } from '../store'
import { useNav } from '../nav'
import { Chip, Eyebrow, Field } from '../components/ui'
import { MODALITIES, PARTNERS } from '../i18n'
import { focusPlainLanguage } from '../data/coach'
import type { Modality, TherapyFocus } from '../types'
import { GeneralisationMatrix } from './Progress'

export function Therapist() {
  const { state, dispatch, tr, label, focus, conceptById, allConcepts } = useStore()
  const nav = useNav()
  const lang = state.settings.lang
  const [draft, setDraft] = useState<Omit<TherapyFocus, 'version' | 'updatedAt'>>(() => stripMeta(focus))
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    setDraft(stripMeta(focus))
    setDirty(false)
  }, [focus])

  const patch = (p: Partial<typeof draft>) => {
    setDraft({ ...draft, ...p })
    setDirty(true)
  }
  const toggleMod = (m: Modality) => patch({ modalities: draft.modalities.includes(m) ? draft.modalities.filter((x) => x !== m) : [...draft.modalities, m] })
  const toggleScene = (id: string) => patch({ targetSceneIds: draft.targetSceneIds.includes(id) ? draft.targetSceneIds.filter((x) => x !== id) : [...draft.targetSceneIds, id] })

  const publish = () => {
    dispatch({ type: 'publishFocus', focus: draft })
    nav.toast(tr('saved'))
  }

  const candidates = [...state.core, ...allConcepts.filter((c) => !state.core.includes(c) && state.scenes.some((s) => s.contextualConceptIds.includes(c.id)))]

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <Eyebrow>{tr('therapist')}</Eyebrow>
          <h1>{tr('studioTitle')}</h1>
          <p className="lede">{tr('studioSub')}</p>
        </div>
      </header>

      <section className="section grid-2 studio">
        <div className="panel">
          <Field label={tr('targetConcept')}>
            <div className="chips">
              {candidates.map((c) => (
                <Chip key={c.id} selected={draft.conceptId === c.id} onClick={() => patch({ conceptId: c.id })}>
                  {label(c)}
                </Chip>
              ))}
            </div>
          </Field>
          <Field label={tr('rationale')}>
            <textarea rows={3} value={draft.rationale} onChange={(e) => patch({ rationale: e.target.value })} />
          </Field>
          <Field label={tr('modalities')}>
            <div className="chips">
              {MODALITIES.map((m) => (
                <Chip key={m.id} selected={draft.modalities.includes(m.id)} onClick={() => toggleMod(m.id)}>
                  {lang === 'en' ? m.en : m.zh}
                </Chip>
              ))}
            </div>
          </Field>
          <Field label={`${tr('waitTime')} · ${draft.waitSeconds} ${tr('seconds')}`}>
            <input type="range" min={3} max={15} step={1} value={draft.waitSeconds} onChange={(e) => patch({ waitSeconds: Number(e.target.value) })} />
          </Field>
          <Field label={tr('promptGuidance')}>
            <textarea rows={3} value={draft.promptGuidance} onChange={(e) => patch({ promptGuidance: e.target.value })} />
          </Field>
          <Field label={tr('targetScenes')}>
            <div className="chips">
              {state.scenes.map((s) => (
                <Chip key={s.id} selected={draft.targetSceneIds.includes(s.id)} onClick={() => toggleScene(s.id)}>
                  {label(s)}
                </Chip>
              ))}
            </div>
          </Field>
          <div className="row">
            <Field label={tr('reviewDate')}>
              <input type="date" value={draft.reviewDate} onChange={(e) => patch({ reviewDate: e.target.value })} />
            </Field>
            <Field label="Author">
              <input value={draft.author} onChange={(e) => patch({ author: e.target.value })} />
            </Field>
          </div>
          <div className="actions">
            <button type="button" className="btn-primary" disabled={!dirty || draft.modalities.length === 0} onClick={publish}>
              {tr('publishFocus', { n: focus.version + 1 })}
            </button>
          </div>
        </div>

        <div className="stack">
          <div className="panel">
            <Eyebrow>{tr('familyView')}</Eyebrow>
            <p className="family-copy">{focusPlainLanguage({ ...draft, version: focus.version + (dirty ? 1 : 0), updatedAt: '' }, lang, label(conceptById(draft.conceptId)), state.settings.childName)}</p>
          </div>

          <div className="panel">
            <Eyebrow>{tr('evidenceByScene')}</Eyebrow>
            <GeneralisationMatrix conceptId={draft.conceptId} />
          </div>

          <div className="panel">
            <Eyebrow>{tr('history')}</Eyebrow>
            <ol className="versions">
              {state.focusHistory.map((f, i) => (
                <li key={f.version} className={i === 0 ? 'is-current' : ''}>
                  <span className="version-tag">v{f.version}</span>
                  <span>
                    <b>{label(conceptById(f.conceptId))}</b> · {f.waitSeconds}s · {f.targetSceneIds.map((id) => label(state.scenes.find((s) => s.id === id) ?? { en: id, zh: id })).join(', ')}
                  </span>
                  <span className="muted">
                    {new Date(f.updatedAt).toLocaleDateString()} · {f.author}
                    {i === 0 && ` · ${tr('current')}`}
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <p className="muted small">
            {lang === 'en'
              ? `Partners logging evidence: ${PARTNERS.map((p) => p.en).join(', ')}.`
              : `记录证据的对象：${PARTNERS.map((p) => p.zh).join('、')}。`}
          </p>
        </div>
      </section>
    </div>
  )
}

function stripMeta(f: TherapyFocus): Omit<TherapyFocus, 'version' | 'updatedAt'> {
  const { version: _v, updatedAt: _u, ...rest } = f
  return rest
}
