import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { StoreProvider, useStore } from './store'
import { NavCtx, type Nav, type View } from './nav'
import { Toast } from './components/ui'
import { Icon } from './components/Glyph'
import { Today } from './views/Today'
import { Scenes } from './views/Scenes'
import { ChildMode } from './views/ChildMode'
import { Coach } from './views/Coach'
import { Therapist } from './views/Therapist'
import { Progress } from './views/Progress'
import { Share, ShareReadOnly, decodeShare } from './views/Share'
import { SettingsView } from './views/Settings'
import type { UI_ICONS } from './glyphs'

type IconName = keyof typeof UI_ICONS

const FAMILY_NAV: { id: View; en: string; zh: string; icon: IconName; mobile?: boolean }[] = [
  { id: 'today', en: 'Today', zh: '今天', icon: 'today', mobile: true },
  { id: 'scenes', en: 'Scenes', zh: '场景', icon: 'scenes', mobile: true },
  { id: 'coach', en: 'How to model', zh: '如何示范', icon: 'coach', mobile: true },
  { id: 'progress', en: 'Progress', zh: '进展', icon: 'progress', mobile: true },
  { id: 'share', en: 'Share with team', zh: '与团队分享', icon: 'share' },
  { id: 'settings', en: 'Settings', zh: '设置', icon: 'settings', mobile: true },
]

const CLINIC_NAV: { id: View; key: 'focusPlan' | 'evidence' | 'familyPreview'; icon: IconName }[] = [
  { id: 'therapist', key: 'focusPlan', icon: 'therapist' },
  { id: 'progress', key: 'evidence', icon: 'progress' },
  { id: 'today', key: 'familyPreview', icon: 'today' },
]

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  )
}

function Shell() {
  const { state, dispatch, ready, tr } = useStore()
  const initialClinic = window.location.hash === '#therapist'
  const [mode, setMode] = useState<'family' | 'clinic'>(initialClinic ? 'clinic' : 'family')
  const [view, setView] = useState<View>(initialClinic ? 'therapist' : 'today')
  const [child, setChild] = useState(false)
  const [editing, setEditing] = useState<string | 'new' | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<number | null>(null)

  const shared = useMemo(() => {
    const m = window.location.hash.match(/^#share=(.+)$/)
    return m ? decodeShare(m[1]) : null
  }, [])

  useEffect(() => {
    document.documentElement.lang = state.settings.lang === 'en' ? 'en-AU' : 'zh-CN'
    document.documentElement.classList.toggle('reduce-motion', state.settings.reduceMotion)
  }, [state.settings.lang, state.settings.reduceMotion])

  useEffect(() => {
    const want = mode === 'clinic' ? '#therapist' : ''
    if (window.location.hash !== want && !window.location.hash.startsWith('#share=')) history.replaceState(null, '', window.location.pathname + want)
  }, [mode])

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    if (toastTimer.current) window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 1800)
  }, [])

  const nav = useMemo<Nav>(
    () => ({
      view,
      go: (v) => {
        if (v === 'therapist') setMode('clinic')
        setView(v)
        window.scrollTo({ top: 0 })
      },
      startChild: () => setChild(true),
      editScene: (id) => {
        setView('scenes')
        setEditing(id)
      },
      toast: showToast,
    }),
    [view, showToast],
  )

  if (shared) return <ShareReadOnly p={shared} />
  if (!ready) return null
  if (child) return <ChildMode onExit={() => setChild(false)} />

  const lang = state.settings.lang
  const name = state.settings.childName

  const content = (
    <>
      {view === 'today' && <Today />}
      {view === 'scenes' && <Scenes editing={editing} onEdit={setEditing} />}
      {view === 'coach' && <Coach />}
      {view === 'therapist' && <Therapist />}
      {view === 'progress' && <Progress />}
      {view === 'share' && <Share />}
      {view === 'settings' && <SettingsView />}
    </>
  )

  if (mode === 'clinic')
    return (
      <NavCtx.Provider value={nav}>
        <div className="clinic">
          <header className="clinic-bar">
            <div className="clinic-brand">
              <span className="brand-mark">
                <Icon name="therapist" size={18} />
              </span>
              <span>
                <b>{tr('clinicianWorkspace')}</b>
                <small>{name}</small>
              </span>
            </div>
            <nav className="clinic-nav" aria-label="Clinician">
              {CLINIC_NAV.map((n) => (
                <button key={n.id} type="button" className={view === n.id ? 'is-active' : ''} onClick={() => { setView(n.id); window.scrollTo({ top: 0 }) }}>
                  <Icon name={n.icon} size={16} /> {tr(n.key)}
                </button>
              ))}
            </nav>
            <button type="button" className="btn-soft" onClick={() => { setMode('family'); setView('today') }}>
              <Icon name="back" size={16} /> {tr('backToFamily')}
            </button>
          </header>
          <main className="main">{content}</main>
          <p className="clinic-foot muted small">{tr('clinicianNote')}</p>
        </div>
        <Toast msg={toast} />
      </NavCtx.Provider>
    )

  return (
    <NavCtx.Provider value={nav}>
      <div className="shell">
        <aside className="sidebar">
          <div className="brand">
            <span className="brand-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path d="M4 13c0-4 3-7 8-7 3 0 5 1 7 3M20 11c0 4-3 7-8 7-3 0-5-1-7-3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </span>
            <span>
              <b>{name}</b>
              <small>{tr('appTagline')}</small>
            </span>
          </div>
          <nav className="nav" aria-label="Main">
            {FAMILY_NAV.map((n) => (
              <button key={n.id} type="button" className={view === n.id ? 'is-active' : ''} onClick={() => nav.go(n.id)} aria-current={view === n.id ? 'page' : undefined}>
                <span className="nav-glyph">
                  <Icon name={n.icon} size={17} />
                </span>
                {lang === 'en' ? n.en : n.zh}
              </button>
            ))}
          </nav>
          <div className="sidebar-foot">
            <button type="button" className="btn-primary btn-block" onClick={nav.startChild}>
              <Icon name="play" size={16} /> {tr('startWith', { name })}
            </button>
            <div className="lang-switch" role="group" aria-label={tr('language')}>
              <button type="button" className={lang === 'en' ? 'is-active' : ''} onClick={() => dispatch({ type: 'setSettings', patch: { lang: 'en' } })}>
                EN
              </button>
              <button type="button" className={lang === 'zh' ? 'is-active' : ''} onClick={() => dispatch({ type: 'setSettings', patch: { lang: 'zh' } })}>
                中文
              </button>
            </div>
            <button type="button" className="btn-link clinic-link" onClick={() => nav.go('therapist')}>
              {tr('openClinician')} →
            </button>
          </div>
        </aside>

        <main className="main">{content}</main>

        <nav className="bottomnav" aria-label="Main">
          {FAMILY_NAV.filter((n) => n.mobile).map((n) => (
            <button key={n.id} type="button" className={view === n.id ? 'is-active' : ''} onClick={() => nav.go(n.id)}>
              <Icon name={n.icon} size={18} />
              {lang === 'en' ? n.en : n.zh}
            </button>
          ))}
        </nav>
        <button type="button" className="fab" onClick={nav.startChild} aria-label={tr('startWith', { name })}>
          <Icon name="play" size={22} />
        </button>
      </div>
      <Toast msg={toast} />
    </NavCtx.Provider>
  )
}
