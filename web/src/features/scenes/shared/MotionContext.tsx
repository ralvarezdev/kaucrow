import { createContext, useContext } from 'react'
import type { EntranceKind } from './entrance'

/** What a scene's photos may do beyond sitting still. Reduced motion turns all of it off but the fade. */
export type Motion = {
  entrance: EntranceKind
  /** Photos drift a little, as if they hung in the air. */
  idle: boolean
  /** A hovered photo lifts toward the viewer. */
  hover: boolean
  /** The camera travels to a newly picked photo. */
  journey: boolean
  /** The page is still loading, so nothing has arrived yet. */
  held: boolean
}

export const MotionContext = createContext<Motion>({
  entrance: 'fade',
  idle: false,
  hover: false,
  journey: false,
  held: false,
})

export const useMotion = () => useContext(MotionContext)

/** False while the splash covers the page; the first scene waits for it before its photos arrive. */
export const BootContext = createContext(true)
