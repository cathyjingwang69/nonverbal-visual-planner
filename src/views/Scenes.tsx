import { useEffect, useState } from 'react'
import { useStore } from '../store'
import { useNav } from '../nav'
import { Chip, Eyebrow, Field, Sheet, SymbolCard } from '../components/ui'
import { fileToDataUrl, fmtTime, uid } from '../utils'
import type { Scene } from '../types'
import { ConceptVisual, Icon, Pictogram, SceneVisual } from '../components/Glyph'
import { SCENE_GLYPHS, SCENE_ICON_IDS } from '../glyphs'

export function Scenes({ editing, onEdit }: { editing: string | 'new' | null; onEdit: (id: string | 'new' | null) => void }) {
  const { state, dispatch, tr, label, conceptById } = useStore()
  const nav = useNav()

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <Eyebrow>{tr('scenes')}</Eyebrow>
          <h1>{tr('scenesTitle')}</h1>
          <p className="lede">{tr('scenesSub')}</p>
        </div>
        <button type="button" className="btn-primary" onClick={() => onEdit('new')}>
          + {tr('addScene')}
        </button>
      </header>

      <ol className="scene-list">
        {state.scenes.map((s, i) => (
          <li key={s.id} className={'scene-row' + (s.id === state.currentSceneId ? ' is-current' : '')}>
            <button type="button" className="scene-row-main" onClick={() => dispatch({ type: 'setCurrentScene', id: s.id })}>
              <span className="scene-row-visual">
                <SceneVisual icon={s.icon} photo={s.photo} />
              </span>
              <span className="scene-row-text">
                <span className="scene-row-time">{fmtTime(s.time)}</span>
                <span className="scene-row-name">{label(s)}</span>
                <span className="scene-row-words">
                  {s.contextualConceptIds.map((id) => (
                    <span key={id} className="mini-card">
                      <ConceptVisual id={id} /> {label(conceptById(id))}
                    </span>
                  ))}
                </span>
              </span>
            </button>
            <span className="scene-row-actions">
              <button type="button" className="btn-icon" onClick={() => dispatch({ type: 'moveScene', id: s.id, dir: -1 })} disabled={i === 0} aria-label={tr('moveUp')} title={tr('moveUp')}>
                <Icon name="up" />
              </button>
              <button type="button" className="btn-icon" onClick={() => dispatch({ type: 'moveScene', id: s.id, dir: 1 })} disabled={i === state.scenes.length - 1} aria-label={tr('moveDown')} title={tr('moveDown')}>
                <Icon name="down" />
              </button>
              <button type="button" className="btn-soft" onClick={() => onEdit(s.id)}>
                {tr('edit')}
              </button>
              <button type="button" className="btn-soft" onClick={() => { dispatch({ type: 'setCurrentScene', id: s.id }); nav.startChild() }} aria-label={tr('startWith', { name: state.settings.childName })}>
                <Icon name="play" size={16} />
              </button>
            </span>
          </li>
        ))}
      </ol>

      <SceneEditor id={editing} onClose={() => onEdit(null)} />
    </div>
  )
}

export function SceneEditor({ id, onClose }: { id: string | 'new' | null; onClose: () => void }) {
  const { state, dispatch, tr, label, conceptById } = useStore()
  const nav = useNav()
  const existing = id && id !== 'new' ? state.scenes.find((s) => s.id === id) : null
  const [draft, setDraft] = useState<Scene | null>(null)
  const [newEn, setNewEn] = useState('')
  const [newZh, setNewZh] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    if (!id) return setDraft(null)
    setDraft(
      existing
        ? { ...existing, contextualConceptIds: [...existing.contextualConceptIds] }
        : { id: 's_' + uid(), en: '', zh: '', time: '12:00', icon: 'bath', photo: null, contextualConceptIds: [] },
    )
    setFilter('')
  }, [id, existing])

  if (!id || !draft) return null
  const isNew = id === 'new'
  const patch = (p: Partial<Scene>) => setDraft({ ...draft, ...p })
  const toggleWord = (cid: string) => {
    const has = draft.contextualConceptIds.includes(cid)
    if (has) patch({ contextualConceptIds: draft.contextualConceptIds.filter((x) => x !== cid) })
    else if (draft.contextualConceptIds.length < 6) patch({ contextualConceptIds: [...draft.contextualConceptIds, cid] })
  }
  const canSave = draft.en.trim().length > 0 && draft.contextualConceptIds.length >= 1

  const save = () => {
    dispatch({ type: 'upsertScene', scene: { ...draft, en: draft.en.trim(), zh: draft.zh.trim() || draft.en.trim() } })
    nav.toast(tr('saved'))
    onClose()
  }

  const addWord = () => {
    const en = newEn.trim()
    if (!en) return
    const cid = 'c_' + en.toLowerCase().replace(/[^a-z0-9]+/g, '_')
    dispatch({ type: 'addConcept', concept: { id: cid, en: en.toLowerCase(), zh: newZh.trim() || en } })
    if (!draft.contextualConceptIds.includes(cid) && draft.contextualConceptIds.length < 6) patch({ contextualConceptIds: [...draft.contextualConceptIds, cid] })
    setNewEn('')
    setNewZh('')
  }

  const onScenePhoto = async (f?: File) => {
    if (!f) return
    patch({ photo: await fileToDataUrl(f, 800) })
  }
  const onWordPhoto = async (cid: string, f?: File) => {
    if (!f) return
    dispatch({ type: 'setOverride', override: { conceptId: cid, dataUrl: await fileToDataUrl(f, 480) } })
  }

  const libraryFiltered = state.library.filter((c) => !filter || c.en.includes(filter.toLowerCase()) || c.zh.includes(filter))

  return (
    <Sheet open onClose={onClose} title={isNew ? tr('newScene') : `${tr('edit')} · ${label(existing!)}`} wide>
      <div className="grid-2 sheet-grid">
        <div className="stack">
          <Field label={tr('sceneName')}>
            <input value={draft.en} onChange={(e) => patch({ en: e.target.value })} placeholder="Bath" autoFocus={isNew} />
          </Field>
          <Field label={tr('sceneNameZh')}>
            <input value={draft.zh} onChange={(e) => patch({ zh: e.target.value })} placeholder="洗澡" />
          </Field>
          <Field label={tr('time')}>
            <input type="time" value={draft.time} onChange={(e) => patch({ time: e.target.value })} />
          </Field>
          <Field label={tr('sceneIcon')}>
            <div className="icon-grid">
              {SCENE_ICON_IDS.map((ic) => (
                <button key={ic} type="button" className={'icon-pick' + (draft.icon === ic ? ' is-selected' : '')} onClick={() => patch({ icon: ic })} aria-label={ic} aria-pressed={draft.icon === ic}>
                  <Pictogram glyph={SCENE_GLYPHS[ic]} />
                </button>
              ))}
            </div>
          </Field>
          <Field label={tr('scenePhoto')} hint={tr('photoHint')}>
            <div className="photo-row">
              <span className="photo-thumb">
                <SceneVisual icon={draft.icon} photo={draft.photo} />
              </span>
              <span className="btn-soft file-btn">
                {tr('uploadPhoto')}
                <input type="file" accept="image/*" onChange={(e) => onScenePhoto(e.target.files?.[0])} />
              </span>
              {draft.photo && (
                <button type="button" className="btn-link" onClick={() => patch({ photo: null })}>
                  {tr('removePhoto')}
                </button>
              )}
            </div>
          </Field>
        </div>

        <div className="stack">
          <div className="field">
            <span className="field-label">
              {tr('contextualWords')} <span className="muted">{draft.contextualConceptIds.length}/6</span>
            </span>
            <div className="vocab-row scene editor">
              {draft.contextualConceptIds.map((cid) => (
                <div key={cid} className="editor-card">
                  <SymbolCard concept={conceptById(cid)} size="sm" />
                  <div className="editor-card-actions">
                    <span className="btn-icon file-btn" title={tr('replacePhoto')}>
                      <Icon name="photo" size={15} />
                      <input type="file" accept="image/*" onChange={(e) => onWordPhoto(cid, e.target.files?.[0])} />
                    </span>
                    {state.overrides.some((o) => o.conceptId === cid) && (
                      <button type="button" className="btn-icon" title={tr('resetVisual')} onClick={() => dispatch({ type: 'clearOverride', conceptId: cid })}>
                        <Icon name="reset" size={15} />
                      </button>
                    )}
                    <button type="button" className="btn-icon" title="Remove" onClick={() => toggleWord(cid)}>
                      <Icon name="close" size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <span className="field-hint">{tr('visualsNote')}</span>
          </div>

          <div className="field">
            <span className="field-label">{tr('wordLibrary')}</span>
            <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="…" />
            <div className="chips library">
              {libraryFiltered.map((c) => (
                <Chip key={c.id} selected={draft.contextualConceptIds.includes(c.id)} onClick={() => toggleWord(c.id)} title={c.en}>
                  <ConceptVisual id={c.id} /> {label(c)}
                </Chip>
              ))}
            </div>
          </div>

          <div className="field">
            <span className="field-label">{tr('addWord')}</span>
            <div className="row">
              <input value={newEn} onChange={(e) => setNewEn(e.target.value)} placeholder={tr('newWordEn')} onKeyDown={(e) => e.key === 'Enter' && addWord()} />
              <input value={newZh} onChange={(e) => setNewZh(e.target.value)} placeholder={tr('newWordZh')} onKeyDown={(e) => e.key === 'Enter' && addWord()} />
              <button type="button" className="btn-soft" onClick={addWord} aria-label={tr('addWord')}>
                <Icon name="plus" size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <footer className="sheet-foot">
        {!isNew && state.scenes.length > 1 && (
          <button
            type="button"
            className="btn-link danger"
            onClick={() => {
              dispatch({ type: 'deleteScene', id: draft.id })
              onClose()
            }}
          >
            {tr('deleteScene')}
          </button>
        )}
        <span className="spacer" />
        <button type="button" className="btn-soft" onClick={onClose}>
          {tr('cancel')}
        </button>
        <button type="button" className="btn-primary" disabled={!canSave} onClick={save}>
          {tr('save')}
        </button>
      </footer>
    </Sheet>
  )
}
