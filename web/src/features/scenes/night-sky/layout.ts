import type { PxRect } from '../shared/units'

export type SkyDepth = 'far' | 'mid'
export type SkySlot = { rect: PxRect; rotation: number; depth: SkyDepth }

/** [x, y, w, h, rotationDeg, isFar] — taken from the "Night sky" mockup. */
const RAW = [
  [100, 240, 70, 52, -6, 1],
  [480, 70, 56, 74, 5, 1],
  [660, 120, 64, 48, -3, 1],
  [1000, 90, 66, 50, 4, 1],
  [1150, 200, 52, 70, -7, 1],
  [1140, 560, 70, 52, 6, 1],
  [70, 610, 60, 80, -5, 1],
  [190, 700, 66, 48, 4, 1],
  [1050, 730, 56, 40, -4, 1],
  [150, 330, 128, 96, -4, 0],
  [300, 500, 104, 138, 5, 0],
  [330, 200, 110, 82, -6, 0],
  [940, 250, 140, 105, 5, 0],
  [930, 470, 100, 134, -5, 0],
  [1070, 390, 96, 72, 3, 0],
  [60, 440, 90, 68, 6, 0],
  [940, 650, 110, 82, -3, 0],
  [190, 520, 90, 68, 5, 0],
] as const

export const SKY_SLOTS: readonly SkySlot[] = RAW.map(([x, y, width, height, rotation, far]) => ({
  rect: { x, y, width, height },
  rotation,
  depth: far === 1 ? 'far' : 'mid',
}))

export const SKY_FOCUS: PxRect = { x: 470, y: 190, width: 400, height: 300 }

/** Dotted constellation paths through slot indices; 'focus' is the centre frame. */
export type Waypoint = number | 'focus'
export const CONSTELLATIONS: readonly (readonly Waypoint[])[] = [
  [15, 9, 11, 'focus', 12, 14, 13, 16],
  [9, 10, 'focus'],
]
