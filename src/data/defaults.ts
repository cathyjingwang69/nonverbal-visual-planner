import type { AppState, CommunicationEvent, Scene, TherapyFocus, VocabularyConcept } from '../types'

// Core set is an example, clinician-configurable. Positions are stable across scenes.
export const CORE: VocabularyConcept[] = [
  { id: 'more', en: 'more', zh: '还要' },
  { id: 'stop', en: 'stop', zh: '停', agency: true },
  { id: 'no', en: 'no', zh: '不要', agency: true },
  { id: 'help', en: 'help', zh: '帮忙', agency: true },
  { id: 'go', en: 'go', zh: '走' },
]

// Contextual library (provider-neutral concept IDs).
export const LIBRARY: VocabularyConcept[] = [
  { id: 'up', en: 'up', zh: '起来' },
  { id: 'clothes', en: 'clothes', zh: '衣服' },
  { id: 'light', en: 'light', zh: '灯' },
  { id: 'bed', en: 'bed', zh: '床' },
  { id: 'eat', en: 'eat', zh: '吃' },
  { id: 'drink', en: 'drink', zh: '喝' },
  { id: 'cereal', en: 'cereal', zh: '麦片' },
  { id: 'finished', en: 'finished', zh: '好了' },
  { id: 'bag', en: 'bag', zh: '书包' },
  { id: 'bus', en: 'bus', zh: '校车' },
  { id: 'friend', en: 'friend', zh: '朋友' },
  { id: 'home', en: 'home', zh: '回家' },
  { id: 'toy', en: 'toy', zh: '玩具' },
  { id: 'swing', en: 'swing', zh: '秋千' },
  { id: 'outside', en: 'outside', zh: '外面' },
  { id: 'again', en: 'again', zh: '再一次' },
  { id: 'food', en: 'food', zh: '食物' },
  { id: 'water', en: 'water', zh: '水' },
  { id: 'hot', en: 'hot', zh: '热' },
  { id: 'cold', en: 'cold', zh: '冷' },
  { id: 'towel', en: 'towel', zh: '毛巾' },
  { id: 'toilet', en: 'toilet', zh: '厕所' },
  { id: 'music', en: 'music', zh: '音乐' },
  { id: 'book', en: 'book', zh: '书' },
  { id: 'bath', en: 'bath', zh: '洗澡' },
  { id: 'open', en: 'open', zh: '打开' },
  { id: 'wait', en: 'wait', zh: '等一下' },
  { id: 'tired', en: 'tired', zh: '累了' },
  { id: 'hurt', en: 'hurt', zh: '痛', agency: true },
  { id: 'mum', en: 'mum', zh: '妈妈' },
  { id: 'dad', en: 'dad', zh: '爸爸' },
  { id: 'car', en: 'car', zh: '车' },
  { id: 'shoes', en: 'shoes', zh: '鞋子' },
  { id: 'sleep', en: 'sleep', zh: '睡觉' },
  { id: 'play', en: 'play', zh: '玩' },
  { id: 'like', en: 'like', zh: '喜欢' },
  { id: 'different', en: 'different', zh: '不一样' },
]

export const DEFAULT_SCENES: Scene[] = [
  { id: 'wake', en: 'Wake up', zh: '起床', time: '07:00', icon: '🌅', contextualConceptIds: ['up', 'clothes', 'light', 'bed'] },
  { id: 'breakfast', en: 'Breakfast', zh: '早餐', time: '07:40', icon: '🥣', contextualConceptIds: ['eat', 'drink', 'cereal', 'finished'] },
  { id: 'school', en: 'School', zh: '学校', time: '08:30', icon: '🎒', contextualConceptIds: ['bag', 'bus', 'friend', 'home'] },
  { id: 'play', en: 'Play', zh: '玩', time: '16:00', icon: '🪁', contextualConceptIds: ['toy', 'swing', 'outside', 'again'] },
  { id: 'dinner', en: 'Dinner', zh: '晚餐', time: '18:15', icon: '🍲', contextualConceptIds: ['eat', 'food', 'water', 'finished'] },
]

const inDays = (n: number) => {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

export const DEFAULT_FOCUS: TherapyFocus = {
  version: 1,
  conceptId: 'help',
  rationale:
    'Requesting help is a high-value, high-frequency function that appears across every routine. It gives Audrey a reliable way to change her environment without needing a full sentence.',
  modalities: ['tap', 'gesture', 'gaze', 'own_device'],
  waitSeconds: 8,
  promptGuidance:
    'Model once on the same card Audrey sees, then wait. If she communicates clearly in another way, respond to that. Do not physically prompt her hand to the card.',
  targetSceneIds: ['breakfast', 'play', 'school'],
  reviewDate: inDays(7),
  updatedAt: new Date().toISOString(),
  author: 'Speech pathologist',
}

// Sample evidence so Progress is legible before real use. Flagged and clearable.
const hoursAgo = (h: number) => new Date(Date.now() - h * 3600_000).toISOString()
export const SAMPLE_EVENTS: CommunicationEvent[] = [
  { id: 's1', at: hoursAgo(2), sceneId: 'play', conceptId: 'help', classification: 'independent', partner: 'mum', sample: true },
  { id: 's2', at: hoursAgo(5), sceneId: 'breakfast', conceptId: 'more', classification: 'modelled', partner: 'mum', sample: true },
  { id: 's3', at: hoursAgo(9), sceneId: 'school', conceptId: 'help', classification: 'prompted', partner: 'school', sample: true },
  { id: 's4', at: hoursAgo(20), sceneId: 'dinner', conceptId: 'finished', classification: 'independent', partner: 'dad', sample: true },
  { id: 's5', at: hoursAgo(26), sceneId: 'play', conceptId: 'help', classification: 'independent', partner: 'dad', sample: true },
  { id: 's6', at: hoursAgo(30), sceneId: 'breakfast', conceptId: 'help', classification: 'independent', partner: 'mum', sample: true },
  { id: 's7', at: hoursAgo(33), sceneId: 'play', conceptId: 'help', classification: 'alternative', partner: 'mum', sample: true },
  { id: 's8', at: hoursAgo(46), sceneId: 'breakfast', conceptId: 'help', classification: 'modelled', partner: 'dad', sample: true },
  { id: 's9', at: hoursAgo(50), sceneId: 'play', conceptId: 'help', classification: 'independent', partner: 'mum', sample: true },
  { id: 's10', at: hoursAgo(52), sceneId: 'school', conceptId: 'help', classification: 'unclear', partner: 'school', sample: true },
  { id: 's11', at: hoursAgo(70), sceneId: 'play', conceptId: 'help', classification: 'modelled', partner: 'dad', sample: true },
  { id: 's12', at: hoursAgo(72), sceneId: 'breakfast', conceptId: 'help', classification: 'independent', partner: 'mum', sample: true },
  { id: 's13', at: hoursAgo(76), sceneId: 'dinner', conceptId: 'help', classification: 'refusal', partner: 'dad', sample: true },
  { id: 's14', at: hoursAgo(95), sceneId: 'play', conceptId: 'help', classification: 'independent', partner: 'mum', sample: true },
  { id: 's15', at: hoursAgo(100), sceneId: 'breakfast', conceptId: 'help', classification: 'modelled', partner: 'mum', sample: true },
  { id: 's16', at: hoursAgo(120), sceneId: 'school', conceptId: 'help', classification: 'prompted', partner: 'school', sample: true },
  { id: 's17', at: hoursAgo(122), sceneId: 'play', conceptId: 'help', classification: 'independent', partner: 'dad', sample: true },
  { id: 's18', at: hoursAgo(140), sceneId: 'breakfast', conceptId: 'help', classification: 'independent', partner: 'mum', sample: true },
]

export function initialState(): AppState {
  return {
    schema: 1,
    core: CORE,
    library: LIBRARY,
    scenes: DEFAULT_SCENES,
    currentSceneId: 'play',
    overrides: [],
    focusHistory: [DEFAULT_FOCUS],
    events: SAMPLE_EVENTS,
    settings: {
      lang: 'en',
      provider: 'pictogram',
      partner: 'mum',
      childName: 'Audrey',
      reduceMotion: false,
      voiceRate: 0.88,
    },
  }
}
