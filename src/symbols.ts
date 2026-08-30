// Symbol abstraction — Architecture Document §4.
// Vocabulary stores concept IDs only. Visuals resolve through a SymbolProvider.
// PCS (Tobii Dynavox) is a licensed provider: this prototype ships a stub that
// declares itself unavailable and falls back to the built-in pictogram set.

import type { SymbolProviderId, VisualOverride } from './types'

export type ResolvedSymbol =
  | { kind: 'image'; src: string; source: 'custom' }
  | { kind: 'glyph'; glyph: string; source: SymbolProviderId; licensed: boolean }

export interface SymbolProvider {
  id: SymbolProviderId
  name: string
  licensed: boolean
  getSymbol(conceptId: string): ResolvedSymbol | null
}

const GLYPHS: Record<string, string> = {
  more: '➕', stop: '✋', no: '🚫', help: '🤝', go: '➡️',
  up: '⬆️', clothes: '👕', light: '💡', bed: '🛏️', eat: '🍽️', drink: '🥤',
  cereal: '🥣', finished: '✅', bag: '🎒', bus: '🚌', friend: '🧑‍🤝‍🧑', home: '🏠',
  toy: '🧸', swing: '🛝', outside: '🌳', again: '🔁', food: '🍲', water: '💧',
  hot: '🔥', cold: '❄️', towel: '🧺', toilet: '🚻', music: '🎵', book: '📖',
  bath: '🛁', open: '📦', wait: '⏳', tired: '😴', hurt: '🩹', mum: '👩', dad: '👨',
  car: '🚗', shoes: '👟', sleep: '🌙', play: '🪁', like: '💛', different: '🔀',
}

const pictogram: SymbolProvider = {
  id: 'pictogram',
  name: 'Built-in pictograms',
  licensed: true,
  getSymbol(conceptId) {
    const glyph = GLYPHS[conceptId]
    return glyph ? { kind: 'glyph', glyph, source: 'pictogram', licensed: true } : null
  },
}

// Stub: resolves nothing until a PCS licence and asset bundle are configured.
const pcs: SymbolProvider = {
  id: 'pcs',
  name: 'PCS (Tobii Dynavox) — licence required',
  licensed: false,
  getSymbol() {
    return null
  },
}

export const PROVIDERS: Record<SymbolProviderId, SymbolProvider> = { pictogram, pcs }

/** Resolve a concept's visual: per-word override → chosen provider → pictogram fallback. */
export function resolveSymbol(
  conceptId: string,
  providerId: SymbolProviderId,
  overrides: VisualOverride[],
): ResolvedSymbol {
  const o = overrides.find((x) => x.conceptId === conceptId)
  if (o) return { kind: 'image', src: o.dataUrl, source: 'custom' }
  const fromProvider = PROVIDERS[providerId].getSymbol(conceptId)
  if (fromProvider) return fromProvider
  return pictogram.getSymbol(conceptId) ?? { kind: 'glyph', glyph: '◻︎', source: 'pictogram', licensed: true }
}

export function glyphFor(conceptId: string) {
  return GLYPHS[conceptId] ?? '◻︎'
}
