import { createContext, useContext } from 'react'

export type View = 'today' | 'scenes' | 'coach' | 'therapist' | 'progress' | 'share' | 'settings'

export interface Nav {
  view: View
  go: (v: View) => void
  startChild: () => void
  editScene: (id: string | 'new') => void
  toast: (msg: string) => void
}

export const NavCtx = createContext<Nav | null>(null)
export const useNav = () => {
  const n = useContext(NavCtx)
  if (!n) throw new Error('NavCtx missing')
  return n
}
