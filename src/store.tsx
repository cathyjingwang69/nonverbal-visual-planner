import { createContext, useContext, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from 'react'
import { get, set } from 'idb-keyval'
import type { AppState, CommunicationEvent, Scene, Settings, TherapyFocus, VisualOverride, VocabularyConcept } from './types'
import { initialState } from './data/defaults'
import { t, type StringKey } from './i18n'
import { LEGACY_SCENE_EMOJI } from './glyphs'

const KEY = 'ccc-state-v1'

type Action =
  | { type: 'hydrate'; state: AppState }
  | { type: 'setCurrentScene'; id: string }
  | { type: 'upsertScene'; scene: Scene }
  | { type: 'deleteScene'; id: string }
  | { type: 'moveScene'; id: string; dir: -1 | 1 }
  | { type: 'setOverride'; override: VisualOverride }
  | { type: 'clearOverride'; conceptId: string }
  | { type: 'addConcept'; concept: VocabularyConcept }
  | { type: 'publishFocus'; focus: Omit<TherapyFocus, 'version' | 'updatedAt'> }
  | { type: 'logEvent'; event: CommunicationEvent }
  | { type: 'clearSample' }
  | { type: 'setSettings'; patch: Partial<Settings> }
  | { type: 'reset' }

function reducer(s: AppState, a: Action): AppState {
  switch (a.type) {
    case 'hydrate':
      return a.state
    case 'setCurrentScene':
      return { ...s, currentSceneId: a.id }
    case 'upsertScene': {
      const exists = s.scenes.some((x) => x.id === a.scene.id)
      const scenes = exists ? s.scenes.map((x) => (x.id === a.scene.id ? a.scene : x)) : [...s.scenes, a.scene]
      scenes.sort((x, y) => x.time.localeCompare(y.time))
      return { ...s, scenes, currentSceneId: a.scene.id }
    }
    case 'deleteScene': {
      const scenes = s.scenes.filter((x) => x.id !== a.id)
      if (!scenes.length) return s
      return { ...s, scenes, currentSceneId: s.currentSceneId === a.id ? scenes[0].id : s.currentSceneId }
    }
    case 'moveScene': {
      const i = s.scenes.findIndex((x) => x.id === a.id)
      const j = i + a.dir
      if (i < 0 || j < 0 || j >= s.scenes.length) return s
      const scenes = [...s.scenes]
      // Swap times so the ordering is meaningful, not just positional.
      const ti = scenes[i].time
      scenes[i] = { ...scenes[i], time: scenes[j].time }
      scenes[j] = { ...scenes[j], time: ti }
      ;[scenes[i], scenes[j]] = [scenes[j], scenes[i]]
      return { ...s, scenes }
    }
    case 'setOverride':
      return { ...s, overrides: [...s.overrides.filter((o) => o.conceptId !== a.override.conceptId), a.override] }
    case 'clearOverride':
      return { ...s, overrides: s.overrides.filter((o) => o.conceptId !== a.conceptId) }
    case 'addConcept':
      if (s.library.some((c) => c.id === a.concept.id) || s.core.some((c) => c.id === a.concept.id)) return s
      return { ...s, library: [...s.library, a.concept] }
    case 'publishFocus': {
      const version = (s.focusHistory[0]?.version ?? 0) + 1
      const focus: TherapyFocus = { ...a.focus, version, updatedAt: new Date().toISOString() }
      return { ...s, focusHistory: [focus, ...s.focusHistory] }
    }
    case 'logEvent':
      return { ...s, events: [a.event, ...s.events] }
    case 'clearSample':
      return { ...s, events: s.events.filter((e) => !e.sample) }
    case 'setSettings':
      return { ...s, settings: { ...s.settings, ...a.patch } }
    case 'reset':
      return initialState()
  }
}

interface Ctx {
  state: AppState
  dispatch: (a: Action) => void
  ready: boolean
  /** Translate with the current language. */
  tr: (key: StringKey, vars?: Record<string, string | number>) => string
  /** Label a concept or scene in the current language. */
  label: (o: { en: string; zh: string }) => string
  scene: Scene
  focus: TherapyFocus
  allConcepts: VocabularyConcept[]
  conceptById: (id: string) => VocabularyConcept
}

const StoreCtx = createContext<Ctx | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState)
  const [ready, setReady] = useState(false)
  const hydrated = useRef(false)

  useEffect(() => {
    get<AppState>(KEY)
      .then((saved) => {
        if (saved && saved.schema === 1) {
          // Merge library additions from newer builds without losing user data.
          const base = initialState()
          const libIds = new Set(saved.library.map((c) => c.id))
          saved.library = [...saved.library, ...base.library.filter((c) => !libIds.has(c.id))]
          saved.scenes = saved.scenes.map((sc) => ({ ...sc, icon: LEGACY_SCENE_EMOJI[sc.icon] ?? sc.icon }))
          dispatch({ type: 'hydrate', state: saved })
        }
      })
      .finally(() => {
        hydrated.current = true
        setReady(true)
      })
  }, [])

  useEffect(() => {
    if (!hydrated.current) return
    set(KEY, state).catch(() => {})
  }, [state])

  const value = useMemo<Ctx>(() => {
    const lang = state.settings.lang
    const scene = state.scenes.find((s) => s.id === state.currentSceneId) ?? state.scenes[0]
    const all = [...state.core, ...state.library]
    return {
      state,
      dispatch,
      ready,
      tr: (key, vars) => t(lang, key, vars),
      label: (o) => (lang === 'en' ? o.en : o.zh),
      scene,
      focus: state.focusHistory[0],
      allConcepts: all,
      conceptById: (id) => all.find((c) => c.id === id) ?? { id, en: id, zh: id },
    }
  }, [state, ready])

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>
}

export function useStore() {
  const c = useContext(StoreCtx)
  if (!c) throw new Error('StoreProvider missing')
  return c
}
