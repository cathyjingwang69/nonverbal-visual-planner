// Original pictogram set. Every glyph lives on a 64×64 grid, 4px round strokes,
// optional soft fill (`f`). Drawn in-house: no emoji, no licensed assets.
// `s` = stroke paths (currentColor), `f` = fill paths (var(--glyph-fill)).

export interface Glyph {
  s: string
  f?: string
}

export const CONCEPT_GLYPHS: Record<string, Glyph> = {
  // ── core ──
  more: { s: 'M32 14v36M14 32h36' },
  stop: {
    s: 'M18 34V20a3.5 3.5 0 0 1 7 0v10M25 30V14a3.5 3.5 0 0 1 7 0v16M32 30V16a3.5 3.5 0 0 1 7 0v14M39 30v-8a3.5 3.5 0 0 1 7 0v14c0 10-6 18-14 18h-4c-6 0-10-3-13-8l-6-10a3.5 3.5 0 0 1 6-3.5l3 4',
  },
  no: { s: 'M32 12a20 20 0 1 0 0 40 20 20 0 0 0 0-40zM18 18l28 28' },
  help: {
    f: 'M32 10a22 22 0 1 0 0 44 22 22 0 0 0 0-44zm0 12a10 10 0 1 1 0 20 10 10 0 0 1 0-20z',
    s: 'M32 10a22 22 0 1 0 0 44 22 22 0 0 0 0-44zM32 22a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM32 10v12M32 42v12M10 32h12M42 32h12',
  },
  go: { s: 'M12 32h36M34 18l14 14-14 14' },
  // ── contextual ──
  up: { s: 'M32 52V16M18 30l14-14 14 14' },
  clothes: { f: 'M20 12l-10 8 6 8 4-2v26h24V26l4 2 6-8-10-8h-6a6 6 0 0 1-12 0z', s: 'M20 12l-10 8 6 8 4-2v26h24V26l4 2 6-8-10-8h-6a6 6 0 0 1-12 0z' },
  light: { f: 'M32 8a14 14 0 0 0-8 25c2 2 2 5 2 7h12c0-2 0-5 2-7a14 14 0 0 0-8-25z', s: 'M32 8a14 14 0 0 0-8 25c2 2 2 5 2 7h12c0-2 0-5 2-7a14 14 0 0 0-8-25zM26 46h12M28 53h8' },
  bed: { f: 'M12 26h10a4 4 0 0 1 4 4v10H12z', s: 'M8 46V22M8 40h48v6M56 40V30a4 4 0 0 0-4-4H26v14M12 26h10a4 4 0 0 1 4 4v10' },
  eat: { s: 'M18 8v14a6 6 0 0 0 6 6v28M12 8v14M30 8v14M44 8c-6 0-8 6-8 12s3 8 8 8 8-3 8-8-2-12-8-12zM44 28v28' },
  drink: { f: 'M18 22h28l-3 32H21z', s: 'M18 22h28l-3 32H21zM36 22l8-14M16 32h32' },
  cereal: { f: 'M10 30h44c0 12-8 22-22 22S10 42 10 30z', s: 'M10 30h44c0 12-8 22-22 22S10 42 10 30zM40 30l8-16' },
  finished: { s: 'M14 34l12 12 24-26' },
  bag: { f: 'M18 22h28v30a4 4 0 0 1-4 4H22a4 4 0 0 1-4-4z', s: 'M18 22h28v30a4 4 0 0 1-4 4H22a4 4 0 0 1-4-4zM24 22v-6a8 8 0 0 1 16 0v6M24 40h16v10H24z' },
  bus: { f: 'M12 14h40a4 4 0 0 1 4 4v28H8V18a4 4 0 0 1 4-4z', s: 'M12 14h40a4 4 0 0 1 4 4v28H8V18a4 4 0 0 1 4-4zM8 32h48M14 46v6M50 46v6M14 20h14v8H14zM36 20h14v8H36z' },
  friend: { s: 'M22 14a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM42 14a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM10 52c0-8 5-14 12-14s12 6 12 14M30 52c0-8 5-14 12-14s12 6 12 14' },
  home: { f: 'M14 26v28h36V26L32 12z', s: 'M8 30L32 10l24 20M14 26v28h36V26M26 54V38h12v16' },
  toy: {
    f: 'M32 12a12 12 0 1 0 0 24 12 12 0 0 0 0-24z',
    s: 'M21 10a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM43 10a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM32 12a12 12 0 1 0 0 24 12 12 0 0 0 0-24zM27 23h.5M37 23h.5M29 29c2 2 4 2 6 0M18 58c0-12 6-20 14-20s14 8 14 20M18 58h28',
  },
  swing: { s: 'M6 56L22 8h20l16 48M24 14v30M40 14v30M18 44h28' },
  outside: { f: 'M32 10L16 32h10L16 46h32L38 32h10z', s: 'M32 10L16 32h10L16 46h32L38 32h10zM32 46v10' },
  again: { s: 'M50 30a18 18 0 1 0-6 14M50 20v10H40' },
  food: { f: 'M32 19a13 13 0 1 0 0 26 13 13 0 0 0 0-26z', s: 'M32 10a22 22 0 1 0 0 44 22 22 0 0 0 0-44zM32 19a13 13 0 1 0 0 26 13 13 0 0 0 0-26z' },
  water: { f: 'M32 8c-8 12-16 20-16 30a16 16 0 0 0 32 0c0-10-8-18-16-30z', s: 'M32 8c-8 12-16 20-16 30a16 16 0 0 0 32 0c0-10-8-18-16-30z' },
  hot: { f: 'M32 8c-4 10-14 16-14 28a14 14 0 0 0 28 0c0-6-3-10-6-14-1 4-3 6-6 7 1-7-2-14-2-21z', s: 'M32 8c-4 10-14 16-14 28a14 14 0 0 0 28 0c0-6-3-10-6-14-1 4-3 6-6 7 1-7-2-14-2-21z' },
  cold: { s: 'M32 8v48M12 20l40 24M52 20L12 44M32 8l-6 6M32 8l6 6M32 56l-6-6M32 56l6-6' },
  towel: { f: 'M16 12h32v40H16z', s: 'M16 12h32v40H16zM16 22h32M22 12V6M42 12V6' },
  toilet: { f: 'M12 28h40c0 14-8 24-20 24S12 42 12 28z', s: 'M20 10h20v18H20zM12 28h40c0 14-8 24-20 24S12 42 12 28zM28 52v6h8v-6' },
  music: { f: 'M22 40a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM44 36a6 6 0 1 0 0 12 6 6 0 0 0 0-12z', s: 'M22 40a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM44 36a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM28 46V14l22-4v32M28 22l22-4' },
  book: { s: 'M32 18c-6-4-14-6-22-6v36c8 0 16 2 22 6 6-4 14-6 22-6V12c-8 0-16 2-22 6zM32 18v36' },
  bath: { f: 'M8 32h48v10a12 12 0 0 1-12 12H20A12 12 0 0 1 8 42z', s: 'M8 32h48v10a12 12 0 0 1-12 12H20A12 12 0 0 1 8 42zM14 32V16a6 6 0 0 1 12 0M16 54v4M48 54v4' },
  open: { f: 'M12 24h40v30H12z', s: 'M12 24h40v30H12zM12 24l8-12h24l8 12M32 12v12' },
  wait: { f: 'M20 8c0 14 12 18 12 24s-12 10-12 24h24c0-14-12-18-12-24s12-10 12-24z', s: 'M18 8h28M18 56h28M20 8c0 14 12 18 12 24s-12 10-12 24M44 8c0 14-12 18-12 24s12 10 12 24' },
  tired: { s: 'M32 10a22 22 0 1 0 0 44 22 22 0 0 0 0-44zM22 30q4 3 8 0M34 30q4 3 8 0M26 42h12' },
  hurt: { f: 'M14 34L34 14l16 16-20 20z', s: 'M14 34L34 14l16 16-20 20zM28 24l12 12M24 28l12 12M32 28h.5M36 32h.5M28 32h.5M32 36h.5' },
  mum: { s: 'M32 12a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM20 24c0-10 6-16 12-16s12 6 12 16M12 56c0-12 8-20 20-20s20 8 20 20' },
  dad: { s: 'M32 12a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM24 14c4-4 12-4 16 0M12 56c0-12 8-20 20-20s20 8 20 20' },
  car: { f: 'M10 36l6-14h32l6 14v10H10z', s: 'M10 36l6-14h32l6 14v14H10zM10 36h44M16 50v4M48 50v4M18 40a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM46 40a4 4 0 1 0 0 8 4 4 0 0 0 0-8z' },
  shoes: { f: 'M8 44c0-6 10-8 18-8l8-10h6l6 10c8 0 10 4 10 8H8z', s: 'M8 44c0-6 10-8 18-8l8-10h6l6 10c8 0 10 4 10 8H8zM8 44v6h48v-6M34 36l4-4' },
  sleep: { f: 'M40 10a20 20 0 1 0 14 34 16 16 0 0 1-14-34z', s: 'M40 10a20 20 0 1 0 14 34 16 16 0 0 1-14-34z' },
  play: { s: 'M32 10a22 22 0 1 0 0 44 22 22 0 0 0 0-44zM14 20c12 6 24 6 36 0M14 44c12-6 24-6 36 0M32 10v44' },
  like: { f: 'M32 54S8 40 8 24a12 12 0 0 1 24-4 12 12 0 0 1 24 4c0 16-24 30-24 30z', s: 'M32 54S8 40 8 24a12 12 0 0 1 24-4 12 12 0 0 1 24 4c0 16-24 30-24 30z' },
  different: { f: 'M20 22a10 10 0 1 0 0 20 10 10 0 0 0 0-20z', s: 'M20 22a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM38 22h20v20H38z' },
}

export const SCENE_GLYPHS: Record<string, Glyph> = {
  wake: { f: 'M20 44a12 12 0 0 1 24 0z', s: 'M8 44h48M32 24v-8M14 30l-6-6M50 30l6-6M20 44a12 12 0 0 1 24 0' },
  breakfast: CONCEPT_GLYPHS.cereal,
  school: CONCEPT_GLYPHS.bag,
  play: CONCEPT_GLYPHS.play,
  dinner: { f: 'M12 28h40v16a10 10 0 0 1-10 10H22a10 10 0 0 1-10-10z', s: 'M12 28h40v16a10 10 0 0 1-10 10H22a10 10 0 0 1-10-10zM6 28h52M22 20h20M26 12h12' },
  bath: CONCEPT_GLYPHS.bath,
  night: CONCEPT_GLYPHS.sleep,
  car: CONCEPT_GLYPHS.car,
  building: { f: 'M8 56V26l24-14 24 14v30z', s: 'M8 56V26l24-14 24 14v30M24 56V40h16v16M32 22v-8M8 56h48' },
  park: CONCEPT_GLYPHS.outside,
  book: CONCEPT_GLYPHS.book,
  music: CONCEPT_GLYPHS.music,
  toy: CONCEPT_GLYPHS.toy,
  apple: { f: 'M32 14c-4-4-10-4-14 0-6 6-6 20 0 30 4 6 8 8 14 6 6 2 10 0 14-6 6-10 6-24 0-30-4-4-10-4-14 0z', s: 'M32 14c-4-4-10-4-14 0-6 6-6 20 0 30 4 6 8 8 14 6 6 2 10 0 14-6 6-10 6-24 0-30-4-4-10-4-14 0zM32 14V6M32 8c4-4 8-4 10-2' },
  clinic: { s: 'M32 10a22 22 0 1 0 0 44 22 22 0 0 0 0-44zM32 20v24M20 32h24' },
  shop: { s: 'M6 10h8l6 30h30l4-20H18M24 48a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM44 48a3 3 0 1 0 0 6 3 3 0 0 0 0-6z' },
}

export const SCENE_ICON_IDS = Object.keys(SCENE_GLYPHS)

// Emoji → glyph id, for migrating data saved by earlier builds.
export const LEGACY_SCENE_EMOJI: Record<string, string> = {
  '🌅': 'wake', '🥣': 'breakfast', '🎒': 'school', '🪁': 'play', '🍲': 'dinner', '🛁': 'bath', '🌙': 'night',
  '🚗': 'car', '🏫': 'building', '🏞️': 'park', '📚': 'book', '🎵': 'music', '🧸': 'toy', '🍎': 'apple',
  '🧑‍⚕️': 'clinic', '🛒': 'shop',
}

// UI line icons (24×24, 2px strokes) for navigation and controls.
export const UI_ICONS: Record<string, string> = {
  today: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  scenes: 'M4 5h16M4 12h16M4 19h16M8 5v14',
  coach: 'M12 3l2.5 6 6.5.5-5 4 1.5 6.5L12 16.5 6.5 20 8 13.5l-5-4L9.5 9z',
  progress: 'M4 19h16M6 15l4-5 4 3 4-7',
  therapist: 'M9 3h6v4h-6zM5 7h14v13H5zM12 11v5M9.5 13.5h5',
  share: 'M12 15V4M8 8l4-4 4 4M5 14v5h14v-5',
  settings: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM4 12h2M18 12h2M12 4v2M12 18v2M6.3 6.3l1.4 1.4M16.3 16.3l1.4 1.4M6.3 17.7l1.4-1.4M16.3 7.7l1.4-1.4',
  play: 'M7 5l12 7-12 7z',
  lock: 'M6 11h12v9H6zM9 11V7a3 3 0 0 1 6 0v4',
  back: 'M15 5l-7 7 7 7',
  timer: 'M12 7a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM12 10v4M10 3h4',
  plus: 'M12 5v14M5 12h14',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  photo: 'M4 7h4l2-2h4l2 2h4v12H4zM12 10a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z',
  check: 'M5 12l5 5 9-10',
  close: 'M6 6l12 12M18 6L6 18',
  up: 'M12 19V5M6 11l6-6 6 6',
  down: 'M12 5v14M6 13l6 6 6-6',
  reset: 'M4 12a8 8 0 1 0 3-6.2M4 4v5h5',
  copy: 'M8 8h11v12H8zM5 16V4h11',
  link: 'M10 14l4-4M8 12l-2 2a3 3 0 0 0 4 4l2-2M16 12l2-2a3 3 0 0 0-4-4l-2 2',
  people: 'M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 19c0-3 2-5 5-5s5 2 5 5M13 19c0-3 2-5 5-5s5 2 5 5',
}
