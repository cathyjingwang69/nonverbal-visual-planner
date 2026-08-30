import type { Classification, Lang, Modality, Partner } from './types'

const S = {
  // nav
  today: ['Today', '今天'],
  scenes: ['Scenes', '场景'],
  coach: ['How to model', '如何示范'],
  therapist: ['Therapist', '治疗师'],
  progress: ['Progress', '进展'],
  share: ['Team share', '团队分享'],
  settings: ['Settings', '设置'],
  appTagline: ['communication companion', '沟通伙伴'],

  // today
  dayTitle: ['{name}’s day', '{name} 的一天'],
  daySub: ['Everyday moments, made easier to communicate.', '把日常生活变成更容易沟通的时刻。'],
  thisWeekFocus: ['This week’s focus', '本周重点'],
  fromTherapist: ['set by {who} · all other words stay available', '由{who}设定 · 其他词语仍然可用'],
  todaysScenes: ['Today’s scenes', '今天的场景'],
  manageScenes: ['Manage scenes', '管理场景'],
  currentScene: ['Current scene', '当前场景'],
  coreWords: ['Core words', '核心词'],
  fixedEverywhere: ['same place in every scene', '每个场景位置不变'],
  sceneWords: ['Scene words', '场景词'],
  editCards: ['Edit cards', '编辑卡片'],
  startWith: ['Start with {name}', '和 {name} 一起开始'],
  quickIdeas: ['Model ideas', '示范提示'],
  logMoment: ['Log a moment', '记录一次'],
  insight: ['Insight', '观察'],
  addScene: ['Add scene', '添加场景'],
  now: ['now', '现在'],
  next: ['next', '接下来'],
  waitFor: ['wait {n}s', '等待 {n} 秒'],

  // scenes
  scenesTitle: ['Scenes & transitions', '场景与过渡'],
  scenesSub: ['Scenes make up the day. Core words stay available in every one.', '场景组成一天。核心词在每个场景中都可用。'],
  sceneName: ['Scene name', '场景名称'],
  sceneNameZh: ['Name in Chinese', '中文名称'],
  time: ['Time', '时间'],
  sceneIcon: ['Scene icon', '场景图标'],
  scenePhoto: ['Scene photo', '场景照片'],
  photoHint: ['Optional. A real photo can help recognise the context.', '可选。真实照片有助于识别情境。'],
  uploadPhoto: ['Upload photo', '上传照片'],
  removePhoto: ['Remove', '移除'],
  contextualWords: ['Scene words (3–6)', '场景词（3–6 个）'],
  wordLibrary: ['Word library', '词库'],
  addWord: ['Add word', '添加词'],
  newWordEn: ['English', '英文'],
  newWordZh: ['中文', '中文'],
  save: ['Save', '保存'],
  cancel: ['Cancel', '取消'],
  deleteScene: ['Delete scene', '删除场景'],
  moveUp: ['Move earlier', '提前'],
  moveDown: ['Move later', '推后'],
  edit: ['Edit', '编辑'],
  newScene: ['New scene', '新场景'],
  cardVisual: ['Card visuals', '卡片图像'],
  replacePhoto: ['Use photo', '用照片'],
  resetVisual: ['Reset to symbol', '恢复符号'],
  customPhoto: ['Family photo', '家庭照片'],
  defaultSymbol: ['Default symbol', '默认符号'],
  visualsNote: [
    'Symbol changes are deliberate and stay put. Photos are stored on this device only.',
    '图像变更是有意的且保持不变。照片仅存储在本设备。',
  ],

  // child
  holdToExit: ['Hold to exit', '长按退出'],
  childOffline: ['Works offline once loaded', '加载后可离线使用'],

  // coach
  coachTitle: ['How to model', '如何示范'],
  coachSub: ['{word} in {scene}', '在 {scene} 中示范 {word}'],
  opportunities: ['Natural opportunities', '自然机会'],
  whatIf: ['What if…', '如果…'],
  whatHappened: ['What happened?', '发生了什么？'],
  saveMoment: ['Save moment', '保存记录'],
  saved: ['Saved', '已保存'],
  partner: ['Communication partner', '沟通对象'],
  word: ['Word', '词'],
  scene: ['Scene', '场景'],
  waitRule: ['Wait {n} seconds before adding another cue — set by {who}.', '在添加另一个提示前等待 {n} 秒——由{who}设定。'],
  acceptedWays: ['Accepted ways to respond', '可接受的回应方式'],
  anotherIdea: ['Another idea', '换一个'],

  // therapist
  studioTitle: ['Therapist Studio', '治疗师工作室'],
  studioSub: ['Set the week’s focus. Families see a plain-language version; the team sees only what is shared.', '设定本周重点。家庭看到通俗版本；团队只看到共享内容。'],
  targetConcept: ['Target concept', '目标概念'],
  rationale: ['Rationale', '理由'],
  modalities: ['Accepted response modalities', '可接受的回应方式'],
  waitTime: ['Wait time', '等待时间'],
  promptGuidance: ['Prompt guidance', '提示指导'],
  targetScenes: ['Target scenes', '目标场景'],
  reviewDate: ['Review date', '复查日期'],
  publishFocus: ['Publish as v{n}', '发布为第 {n} 版'],
  history: ['Version history', '版本历史'],
  current: ['Current', '当前'],
  evidenceByScene: ['Evidence by scene and partner', '按场景和对象的证据'],
  familyView: ['What the family sees', '家庭看到的内容'],
  seconds: ['seconds', '秒'],

  // progress
  progressTitle: ['Communication evidence', '沟通证据'],
  progressSub: ['A tap on its own is not evidence. These are moments an adult observed and classified.', '单次点击本身不是证据。这些是成人观察并分类的时刻。'],
  opportunitiesN: ['Opportunities', '机会'],
  independentN: ['Independent', '独立'],
  modelledN: ['Modelled / prompted', '示范 / 提示'],
  otherN: ['Other modality', '其他方式'],
  unclearN: ['Unclear', '不明确'],
  generalisation: ['{word} across scenes and partners', '{word} 在不同场景和对象中的表现'],
  generalisationHint: ['Filled dots = independent uses. Needs at least 3 moments per cell to read anything into it.', '实心点 = 独立使用。每格至少 3 次记录才有参考价值。'],
  recentMoments: ['Recent moments', '最近记录'],
  clearSample: ['Clear sample data', '清除示例数据'],
  sampleBadge: ['sample', '示例'],
  noEvents: ['No moments logged yet. Log one from How to model after a real interaction.', '还没有记录。在真实互动后，从“如何示范”记录一次。'],
  last14: ['Last 14 days', '最近 14 天'],

  // share
  shareTitle: ['Team share', '团队分享'],
  shareSub: ['One screen for school, OT, support workers. No dashboard.', '给学校、OT、支持人员的一页。没有仪表板。'],
  shareCopy: ['Copy as text', '复制为文本'],
  shareLink: ['Copy link', '复制链接'],
  copied: ['Copied', '已复制'],
  shareIntro: ['{name} communicates with a device and also with gestures, gaze and her own way of showing you. All of it counts.', '{name} 用设备沟通，也用手势、眼神和她自己的方式。这些都算数。'],
  shareModel: ['How to model it', '如何示范'],
  shareSceneWords: ['Words available today', '今天可用的词'],
  shareWhatNot: ['Please don’t', '请不要'],
  shareDont1: ['Move her hand to the card', '把她的手移到卡片上'],
  shareDont2: ['Ask her to tap again and again', '反复要求她点击'],
  shareDont3: ['Treat a different tap as wrong', '把不同的点击当作错误'],
  shareValid: ['Valid until {date}', '有效期至 {date}'],

  // settings
  language: ['Language', '语言'],
  childName: ['Child’s name', '孩子的名字'],
  symbolProvider: ['Symbol provider', '符号提供方'],
  providerNote: ['Switching providers keeps every word and grid position the same.', '切换提供方时，所有词和网格位置保持不变。'],
  pcsNote: ['PCS is licensed by Tobii Dynavox. Without a licence the app falls back to built-in pictograms.', 'PCS 由 Tobii Dynavox 授权。没有授权时，应用使用内置图标。'],
  reduceMotion: ['Reduce motion', '减少动效'],
  voiceRate: ['Speech rate', '语速'],
  defaultPartner: ['I am', '我是'],
  privacy: ['Privacy', '隐私'],
  privacyNote: ['Everything stays in this browser. Nothing is uploaded. Clearing site data removes it.', '所有内容都保存在此浏览器中。不会上传任何内容。清除站点数据会将其删除。'],
  resetAll: ['Reset to defaults', '恢复默认'],
  resetConfirm: ['This removes scenes, photos, focus history and logged moments on this device.', '这将删除本设备上的场景、照片、重点历史和记录。'],
  testVoice: ['Test voice', '试听'],
} as const

export type StringKey = keyof typeof S

export function t(lang: Lang, key: StringKey, vars: Record<string, string | number> = {}) {
  let s: string = S[key][lang === 'en' ? 0 : 1]
  for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v))
  return s
}

export const CLASSIFICATIONS: { id: Classification; en: string; zh: string; hint: [string, string] }[] = [
  { id: 'independent', en: 'Independent', zh: '独立', hint: ['Used it without a model or prompt', '没有示范或提示就使用了'] },
  { id: 'modelled', en: 'Modelled', zh: '示范后', hint: ['Used it after seeing it modelled once', '看到示范一次后使用了'] },
  { id: 'prompted', en: 'Prompted', zh: '提示后', hint: ['Needed an extra cue', '需要额外提示'] },
  { id: 'alternative', en: 'Other way', zh: '其他方式', hint: ['Gesture, gaze, sound or own device', '手势、眼神、声音或自己的设备'] },
  { id: 'unclear', en: 'Unclear', zh: '不明确', hint: ['Tapped, but not clearly meaningful', '点击了，但不清楚是否有意'] },
  { id: 'refusal', en: 'Stopped', zh: '停止', hint: ['Walked away or declined — that’s fine', '走开或拒绝——没关系'] },
]

export const PARTNERS: { id: Partner; en: string; zh: string }[] = [
  { id: 'mum', en: 'Mum', zh: '妈妈' },
  { id: 'dad', en: 'Dad', zh: '爸爸' },
  { id: 'school', en: 'School', zh: '学校' },
  { id: 'therapist', en: 'Therapist', zh: '治疗师' },
  { id: 'other', en: 'Other', zh: '其他' },
]

export const MODALITIES: { id: Modality; en: string; zh: string }[] = [
  { id: 'tap', en: 'Tap on card', zh: '点击卡片' },
  { id: 'gesture', en: 'Gesture / sign', zh: '手势 / 手语' },
  { id: 'gaze', en: 'Eye gaze', zh: '眼神' },
  { id: 'vocal', en: 'Vocalisation', zh: '发声' },
  { id: 'own_device', en: 'Her own AAC device', zh: '她自己的 AAC 设备' },
  { id: 'pull_hand', en: 'Leads your hand', zh: '拉你的手' },
]
