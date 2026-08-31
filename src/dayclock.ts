import { useEffect, useState } from 'react'
import type { Scene } from './types'

/** Which scene is happening now, which comes next, and how far away it is. */
export function useDayClock(scenes: Scene[]) {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 30_000)
    return () => window.clearInterval(id)
  }, [])
  void tick
  const d = new Date()
  const nowMin = d.getHours() * 60 + d.getMinutes()
  const toMin = (t: string) => {
    const [h, m] = t.split(':').map(Number)
    return h * 60 + (m || 0)
  }
  const sorted = [...scenes].sort((a, b) => a.time.localeCompare(b.time))
  let current: Scene | null = null
  let next: Scene | null = null
  for (const s of sorted) {
    if (toMin(s.time) <= nowMin) current = s
    else if (!next) next = s
  }
  if (!current) current = sorted[0] ?? null
  const minutesToNext = next ? toMin(next.time) - nowMin : null
  return { current, next, minutesToNext, nowMin }
}
