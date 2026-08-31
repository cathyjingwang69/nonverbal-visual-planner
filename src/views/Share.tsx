import { useStore } from '../store'
import { useNav } from '../nav'
import { Eyebrow, SymbolCard } from '../components/ui'
import { Icon, SceneVisual } from '../components/Glyph'
import { opportunitiesFor, focusPlainLanguage } from '../data/coach'
import { MODALITIES } from '../i18n'

export interface SharePayload {
  name: string
  lang: 'en' | 'zh'
  word: string
  waitSeconds: number
  modalities: string[]
  reviewDate: string
  author: string
  scenes: { name: string; icon: string; words: string[] }[]
  tips: { scene: string; title: string; step: string }[]
}

export function buildSharePayload(s: ReturnType<typeof useStore>): SharePayload {
  const { state, label, focus, conceptById } = s
  const lang = state.settings.lang
  const L = lang === 'en' ? 0 : 1
  const targets = state.scenes.filter((sc) => focus.targetSceneIds.includes(sc.id))
  return {
    name: state.settings.childName,
    lang,
    word: label(conceptById(focus.conceptId)),
    waitSeconds: focus.waitSeconds,
    modalities: MODALITIES.filter((m) => focus.modalities.includes(m.id)).map((m) => (lang === 'en' ? m.en : m.zh)),
    reviewDate: focus.reviewDate,
    author: focus.author,
    scenes: targets.map((sc) => ({ name: label(sc), icon: '', words: sc.contextualConceptIds.map((id) => label(conceptById(id))) })),
    tips: targets.map((sc) => {
      const t = opportunitiesFor(focus.conceptId, sc.id)[0]
      return { scene: label(sc), title: t.title[L], step: t.step[L] }
    }),
  }
}

export function encodeShare(p: SharePayload) {
  return btoa(unescape(encodeURIComponent(JSON.stringify(p))))
}
export function decodeShare(s: string): SharePayload | null {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(s))))
  } catch {
    return null
  }
}

export function Share() {
  const store = useStore()
  const { state, tr, label, focus, conceptById, scene } = store
  const nav = useNav()
  const lang = state.settings.lang
  const name = state.settings.childName
  const word = conceptById(focus.conceptId)
  const targets = state.scenes.filter((s) => focus.targetSceneIds.includes(s.id))

  const asText = () => {
    const p = buildSharePayload(store)
    const lines = [
      `${name} — ${tr('thisWeekFocus')}: ${p.word.toUpperCase()} (v${focus.version})`,
      focusPlainLanguage(focus, lang, p.word, name),
      '',
      `${tr('acceptedWays')}: ${p.modalities.join(', ')}`,
      '',
      ...p.tips.map((t) => `${t.scene}: ${t.title} — ${t.step}`),
      '',
      ...p.scenes.map((s) => `${s.name}: ${s.words.join(' · ')}`),
      '',
      `${tr('shareWhatNot')}: ${tr('shareDont1')}; ${tr('shareDont2')}; ${tr('shareDont3')}.`,
      `${tr('shareValid', { date: p.reviewDate })} · ${p.author}`,
    ]
    return lines.join('\n')
  }

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      nav.toast(tr('copied'))
    } catch {
      window.prompt('Copy:', text)
    }
  }

  const link = () => {
    const url = new URL(window.location.href)
    url.hash = 'share=' + encodeShare(buildSharePayload(store))
    return url.toString()
  }

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <Eyebrow>{tr('share')}</Eyebrow>
          <h1>{tr('shareWhat')}</h1>
          <p className="lede">{tr('shareExplain', { name })}</p>
        </div>
        <div className="row">
          <button type="button" className="btn-soft" onClick={() => copy(asText())}>
            <Icon name="copy" size={16} /> {tr('shareCopy')}
          </button>
          <button type="button" className="btn-primary" onClick={() => copy(link())}>
            <Icon name="link" size={16} /> {tr('shareLink')}
          </button>
        </div>
      </header>

      <section className="section share-card">
        <div className="share-focus">
          <Eyebrow>{tr('thisWeekFocus')}</Eyebrow>
          <div className="share-word">
            <SymbolCard concept={word} size="md" tone={state.core.findIndex((c) => c.id === word.id)} />
            <div>
              <p className="family-copy">{tr('shareIntro', { name })}</p>
              <p className="family-copy">{focusPlainLanguage(focus, lang, label(word), name)}</p>
            </div>
          </div>
        </div>

        <div className="share-cols">
          <div>
            <h3 className="panel-title">{tr('shareModel')}</h3>
            <ol className="tips">
              {targets.map((s) => {
                const t = opportunitiesFor(focus.conceptId, s.id)[0]
                const L = lang === 'en' ? 0 : 1
                return (
                  <li key={s.id} className="tip">
                    <b>
                      <span className="inline-scene" aria-hidden="true"><SceneVisual icon={s.icon} photo={s.photo} /></span> {label(s)} — {t.title[L]}
                    </b>
                    <span>{t.step[L]}</span>
                  </li>
                )
              })}
            </ol>
            <h3 className="panel-title" style={{ marginTop: 18 }}>
              {tr('acceptedWays')}
            </h3>
            <div className="chips">
              {MODALITIES.filter((m) => focus.modalities.includes(m.id)).map((m) => (
                <span key={m.id} className="chip is-static">
                  {lang === 'en' ? m.en : m.zh}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="panel-title">
              {tr('shareSceneWords')} · {label(scene)}
            </h3>
            <div className="vocab-row core">
              {state.core.map((c, i) => (
                <SymbolCard key={c.id} concept={c} size="sm" tone={i} />
              ))}
            </div>
            <div className="vocab-row scene" style={{ marginTop: 10 }}>
              {scene.contextualConceptIds.map((id) => (
                <SymbolCard key={id} concept={conceptById(id)} size="sm" />
              ))}
            </div>
            <h3 className="panel-title" style={{ marginTop: 18 }}>
              {tr('shareWhatNot')}
            </h3>
            <ul className="donts">
              <li>{tr('shareDont1')}</li>
              <li>{tr('shareDont2')}</li>
              <li>{tr('shareDont3')}</li>
            </ul>
            <p className="muted small">
              {tr('shareValid', { date: focus.reviewDate })} · {focus.author}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

/** Read-only view rendered when the app opens with #share=… */
export function ShareReadOnly({ p }: { p: SharePayload }) {
  const en = p.lang === 'en'
  return (
    <div className="page share-ro">
      <header className="page-head">
        <div>
          <Eyebrow>{en ? 'Team share' : '团队分享'}</Eyebrow>
          <h1>
            {p.name} · {p.word.toUpperCase()}
          </h1>
          <p className="lede">
            {en
              ? `Model it once, wait ${p.waitSeconds} seconds, and respond to any clear communication — not just a tap.`
              : `示范一次，等待 ${p.waitSeconds} 秒，回应任何清楚的沟通——不只是点击。`}
          </p>
        </div>
      </header>
      <section className="section share-card">
        <div className="share-cols">
          <div>
            <h3 className="panel-title">{en ? 'How to model it' : '如何示范'}</h3>
            <ol className="tips">
              {p.tips.map((t, i) => (
                <li key={i} className="tip">
                  <b>
                    {t.scene} — {t.title}
                  </b>
                  <span>{t.step}</span>
                </li>
              ))}
            </ol>
            <h3 className="panel-title" style={{ marginTop: 18 }}>
              {en ? 'Accepted ways to respond' : '可接受的回应方式'}
            </h3>
            <div className="chips">
              {p.modalities.map((m) => (
                <span key={m} className="chip is-static">
                  {m}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="panel-title">{en ? 'Words available' : '可用的词'}</h3>
            <ul className="donts">
              {p.scenes.map((s) => (
                <li key={s.name}>
                  <b>{s.name}</b>: {s.words.join(' · ')}
                </li>
              ))}
            </ul>
            <h3 className="panel-title" style={{ marginTop: 18 }}>
              {en ? 'Please don’t' : '请不要'}
            </h3>
            <ul className="donts">
              <li>{en ? 'Move her hand to the card' : '把她的手移到卡片上'}</li>
              <li>{en ? 'Ask her to tap again and again' : '反复要求她点击'}</li>
              <li>{en ? 'Treat a different tap as wrong' : '把不同的点击当作错误'}</li>
            </ul>
            <p className="muted small">
              {en ? 'Valid until' : '有效期至'} {p.reviewDate} · {p.author}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
