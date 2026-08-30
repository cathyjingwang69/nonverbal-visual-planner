// Domain model — mirrors the Architecture Document §3.
// Vocabulary is provider-neutral: concept IDs never reference a symbol asset.

export type Lang = 'en' | 'zh'
export type SymbolProviderId = 'pictogram' | 'pcs'

export interface VocabularyConcept {
  id: string
  en: string
  zh: string
  /** Agency / safety words are never hidden, regardless of frequency. */
  agency?: boolean
}

/** Per-word visual override (family photo or custom image). */
export interface VisualOverride {
  conceptId: string
  dataUrl: string
}

export interface Scene {
  id: string
  en: string
  zh: string
  /** 24h "HH:MM" */
  time: string
  /** Emoji used as the scene visual when no photo is set. */
  icon: string
  photo?: string | null
  contextualConceptIds: string[]
}

export type Modality = 'tap' | 'gesture' | 'gaze' | 'vocal' | 'own_device' | 'pull_hand'

export interface TherapyFocus {
  version: number
  conceptId: string
  rationale: string
  modalities: Modality[]
  waitSeconds: number
  promptGuidance: string
  targetSceneIds: string[]
  reviewDate: string
  updatedAt: string
  author: string
}

export type Classification =
  | 'independent'
  | 'modelled'
  | 'prompted'
  | 'alternative'
  | 'unclear'
  | 'refusal'

export type Partner = 'mum' | 'dad' | 'school' | 'therapist' | 'other'

export interface CommunicationEvent {
  id: string
  at: string
  sceneId: string
  conceptId: string
  classification: Classification
  partner: Partner
  sample?: boolean
}

export interface Settings {
  lang: Lang
  provider: SymbolProviderId
  partner: Partner
  childName: string
  reduceMotion: boolean
  voiceRate: number
}

export interface AppState {
  schema: 1
  core: VocabularyConcept[]
  library: VocabularyConcept[]
  scenes: Scene[]
  currentSceneId: string
  overrides: VisualOverride[]
  focusHistory: TherapyFocus[]
  events: CommunicationEvent[]
  settings: Settings
}
