import type { PxRect } from '../shared/units'

export const TABLE_AREA = { width: 2400, height: 1800 } as const
/** Screen-space point (px from stage top-left) the table's centre sits on. */
export const TABLE_ORIGIN = { x: 640, y: 470 } as const
export const TABLE_TILT_DEG = 42

export type Print = { rect: PxRect; rotation: number }

/** [left, top, w, h, rotationDeg] on the 2400×1800 tabletop — from the "Table of prints" mockup. */
const RAW = [
  [600, 500, 240, 216, -8],
  [860, 420, 200, 230, 6],
  [1100, 300, 220, 198, 4],
  [1260, 440, 260, 232, -5],
  [1500, 280, 240, 216, -7],
  [1560, 560, 220, 250, 9],
  [560, 820, 260, 240, 5],
  [780, 940, 230, 210, -6],
  [1400, 860, 250, 225, 7],
  [1680, 940, 210, 240, -9],
  [1200, 1130, 240, 216, 3],
  [940, 1190, 200, 230, -4],
  [740, 690, 210, 190, -3],
] as const

export const PRINTS: readonly Print[] = RAW.map(([x, y, width, height, rotation]) => ({
  rect: { x, y, width, height },
  rotation,
}))

/** The picked-up print, lifted off the table. */
export const TABLE_FOCUS: PxRect = { x: 1016, y: 734, width: 368, height: 332 }
export const TABLE_FOCUS_LIFT = 1.1
export const TABLE_FOCUS_ROTATION = -2
