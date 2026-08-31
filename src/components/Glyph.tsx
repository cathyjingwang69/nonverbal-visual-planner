import { CONCEPT_GLYPHS, SCENE_GLYPHS, UI_ICONS, type Glyph } from '../glyphs'
import { resolveSymbol } from '../symbols'
import { useStore } from '../store'

/** 64×64 pictogram (concept or scene). */
export function Pictogram({ glyph, className }: { glyph: Glyph; className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={'pict' + (className ? ' ' + className : '')} aria-hidden="true" focusable="false">
      {glyph.f && <path d={glyph.f} className="pict-fill" />}
      <path d={glyph.s} className="pict-stroke" />
    </svg>
  )
}

/** Concept visual honouring the current provider and photo overrides. */
export function ConceptVisual({ id, className }: { id: string; className?: string }) {
  const { state } = useStore()
  const s = resolveSymbol(id, state.settings.provider, state.overrides)
  if (s.kind === 'image') return <img src={s.src} alt="" className={className} />
  return <Pictogram glyph={s.glyph} className={className} />
}

/** Scene visual: photo if set, else its pictogram. */
export function SceneVisual({ icon, photo, className }: { icon: string; photo?: string | null; className?: string }) {
  if (photo) return <img src={photo} alt="" className={className} />
  return <Pictogram glyph={SCENE_GLYPHS[icon] ?? SCENE_GLYPHS.play} className={className} />
}

/** 24×24 UI line icon. */
export function Icon({ name, size = 18 }: { name: keyof typeof UI_ICONS; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className="ico" aria-hidden="true" focusable="false">
      <path d={UI_ICONS[name]} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export { CONCEPT_GLYPHS }
