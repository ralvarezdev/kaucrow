import { rad, toWorld } from './units'

/** How a scene's photos arrive when it appears. `fade` is the reduced-motion version of all of them. */
export type EntranceKind = 'drift' | 'drop' | 'deal' | 'grow' | 'pop' | 'fade'

/** The pose of a frame, as offsets from where it comes to rest. */
export type EntranceFrame = {
  dx: number
  dy: number
  dz: number
  scale: number
  /** Extra clockwise-negative rotation in radians, added to the frame's own. */
  rot: number
  alpha: number
}

export const REST: EntranceFrame = { dx: 0, dy: 0, dz: 0, scale: 1, rot: 0, alpha: 1 }

/** `duration` per photo, and `perUnit` ms of extra delay per world unit from the stage centre. */
export const ENTRANCES: Record<EntranceKind, { duration: number; perUnit: number }> = {
  drift: { duration: 1400, perUnit: 55 },
  drop: { duration: 1500, perUnit: 70 },
  deal: { duration: 1000, perUnit: 45 },
  grow: { duration: 1100, perUnit: 60 },
  pop: { duration: 550, perUnit: 90 },
  fade: { duration: 600, perUnit: 0 },
}

/** Lets the scene crossfade start before its first photo moves. */
const BASE_DELAY = 150

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3
const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t))

/** The photo nearest the centre arrives first and the rest follow outward. */
export function entranceDelay(kind: EntranceKind, x: number, y: number): number {
  return BASE_DELAY + Math.hypot(x, y) * ENTRANCES[kind].perUnit
}

/** Pose at progress `t` (0 → 1) for a frame whose centre is `at`, in world units from the stage centre. */
export function entranceFrame(
  kind: EntranceKind,
  t: number,
  at: { x: number; y: number },
): EntranceFrame {
  if (t >= 1) return REST
  const p = clamp01(t)
  switch (kind) {
    case 'drift': {
      // Rises out of the depth of the sky.
      const e = easeOutExpo(p)
      return {
        dx: 0,
        dy: -toWorld(26) * (1 - e),
        dz: -1.2 * (1 - e),
        scale: 0.8 + 0.2 * e,
        rot: 0,
        alpha: clamp01(p * 2.2),
      }
    }
    case 'drop': {
      // Lowered onto the wall, then a small settling sway.
      const e = easeOutCubic(p)
      return {
        dx: 0,
        dy: toWorld(260) * (1 - e),
        dz: 0,
        scale: 1,
        rot: Math.sin(p * 13) * (1 - p) ** 2 * 0.07,
        alpha: clamp01(p * 4),
      }
    }
    case 'deal': {
      // Dealt in from the corner of the table, turning as it lands.
      const e = easeOutCubic(p)
      return {
        dx: -toWorld(520) * (1 - e),
        dy: toWorld(420) * (1 - e),
        dz: 0,
        scale: 1 + 0.25 * (1 - e),
        rot: -rad(55) * (1 - e),
        alpha: clamp01(p * 5),
      }
    }
    case 'grow': {
      // Grows outward from the middle of the crowd.
      const e = easeOutCubic(p)
      return {
        dx: -at.x * (1 - e),
        dy: -at.y * (1 - e),
        dz: 0,
        scale: 0.15 + 0.85 * e,
        rot: 0,
        alpha: clamp01(p * 3),
      }
    }
    case 'pop':
      // A window opening, as in Hyprland's popin.
      return { ...REST, scale: 0.82 + 0.18 * easeOutExpo(p), alpha: clamp01(p * 5) }
    case 'fade':
      return { ...REST, alpha: p }
  }
}
