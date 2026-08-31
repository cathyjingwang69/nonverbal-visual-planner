import { useEffect, type ReactNode } from 'react'
import type { VocabularyConcept } from '../types'
import { useStore } from '../store'
import { ConceptVisual, Icon } from './Glyph'

/** A communication card: visual + word, consistent geometry everywhere. */
export function SymbolCard({
  concept,
  size = 'md',
  tone,
  onClick,
  pressed,
  as: Tag = 'div',
}: {
  concept: VocabularyConcept
  size?: 'sm' | 'md' | 'lg' | 'xl'
  tone?: number
  onClick?: () => void
  pressed?: boolean
  as?: 'div' | 'button'
}) {
  const { label } = useStore()
  const cls = ['sym', `sym-${size}`, tone != null ? `tone-${tone}` : '', pressed ? 'is-pressed' : ''].join(' ')
  const inner = (
    <>
      <div className="sym-visual" aria-hidden="true">
        <ConceptVisual id={concept.id} />
      </div>
      <div className="sym-word">{label(concept)}</div>
    </>
  )
  if (Tag === 'button')
    return (
      <button type="button" className={cls} onClick={onClick} aria-label={label(concept)}>
        {inner}
      </button>
    )
  return (
    <div className={cls} onClick={onClick}>
      {inner}
    </div>
  )
}

export function Chip({ selected, onClick, children, title }: { selected?: boolean; onClick?: () => void; children: ReactNode; title?: string }) {
  return (
    <button type="button" className={'chip' + (selected ? ' is-selected' : '')} onClick={onClick} aria-pressed={selected} title={title}>
      {children}
    </button>
  )
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  )
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="eyebrow">{children}</div>
}

/** Slide-over sheet for editing tasks. */
export function Sheet({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])
  if (!open) return null
  return (
    <>
      <div className="scrim" onClick={onClose} />
      <aside className={'sheet' + (wide ? ' sheet-wide' : '')} role="dialog" aria-modal="true" aria-label={title}>
        <header className="sheet-head">
          <h2>{title}</h2>
          <button type="button" className="btn-icon" onClick={onClose} aria-label="Close">
            <Icon name="close" />
          </button>
        </header>
        <div className="sheet-body">{children}</div>
      </aside>
    </>
  )
}

export function Toast({ msg }: { msg: string | null }) {
  if (!msg) return null
  return (
    <div className="toast" role="status">
      {msg}
    </div>
  )
}
