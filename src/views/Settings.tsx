import { useStore } from '../store'
import { Chip, Eyebrow, Field } from '../components/ui'
import { PARTNERS } from '../i18n'
import { PROVIDERS } from '../symbols'
import { speak, speechAvailable } from '../speech'
import type { SymbolProviderId } from '../types'

export function SettingsView() {
  const { state, dispatch, tr } = useStore()
  const s = state.settings
  const lang = s.lang
  const set = (patch: Partial<typeof s>) => dispatch({ type: 'setSettings', patch })

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <Eyebrow>{tr('settings')}</Eyebrow>
          <h1>{tr('settings')}</h1>
        </div>
      </header>

      <section className="section grid-2">
        <div className="panel stack">
          <Field label={tr('language')}>
            <div className="chips">
              <Chip selected={lang === 'en'} onClick={() => set({ lang: 'en' })}>
                English
              </Chip>
              <Chip selected={lang === 'zh'} onClick={() => set({ lang: 'zh' })}>
                中文
              </Chip>
            </div>
          </Field>
          <Field label={tr('childName')}>
            <input value={s.childName} onChange={(e) => set({ childName: e.target.value })} />
          </Field>
          <Field label={tr('defaultPartner')}>
            <div className="chips">
              {PARTNERS.map((p) => (
                <Chip key={p.id} selected={s.partner === p.id} onClick={() => set({ partner: p.id })}>
                  {lang === 'en' ? p.en : p.zh}
                </Chip>
              ))}
            </div>
          </Field>
          <Field label={`${tr('voiceRate')} · ${s.voiceRate.toFixed(2)}`}>
            <div className="row">
              <input type="range" min={0.6} max={1.2} step={0.02} value={s.voiceRate} onChange={(e) => set({ voiceRate: Number(e.target.value) })} />
              <button type="button" className="btn-soft" disabled={!speechAvailable} onClick={() => speak(lang === 'en' ? 'help' : '帮忙', lang, s.voiceRate)}>
                {tr('testVoice')}
              </button>
            </div>
          </Field>
          <Field label={tr('reduceMotion')}>
            <div className="chips">
              <Chip selected={!s.reduceMotion} onClick={() => set({ reduceMotion: false })}>
                {lang === 'en' ? 'System default' : '跟随系统'}
              </Chip>
              <Chip selected={s.reduceMotion} onClick={() => set({ reduceMotion: true })}>
                {lang === 'en' ? 'Always reduce' : '始终减少'}
              </Chip>
            </div>
          </Field>
        </div>

        <div className="stack">
          <div className="panel">
            <Eyebrow>{tr('symbolProvider')}</Eyebrow>
            <div className="stack" style={{ marginTop: 10 }}>
              {(Object.keys(PROVIDERS) as SymbolProviderId[]).map((id) => {
                const p = PROVIDERS[id]
                return (
                  <button key={id} type="button" className={'provider' + (s.provider === id ? ' is-selected' : '')} onClick={() => set({ provider: id })} aria-pressed={s.provider === id}>
                    <b>{p.name}</b>
                    <span>{id === 'pcs' ? tr('pcsNote') : tr('providerNote')}</span>
                  </button>
                )
              })}
            </div>
          </div>
          <div className="panel">
            <Eyebrow>{tr('privacy')}</Eyebrow>
            <p className="muted" style={{ marginTop: 8 }}>
              {tr('privacyNote')}
            </p>
            <p className="muted small">{tr('childOffline')}</p>
            <button
              type="button"
              className="btn-link danger"
              onClick={() => {
                if (window.confirm(tr('resetConfirm'))) dispatch({ type: 'reset' })
              }}
            >
              {tr('resetAll')}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
