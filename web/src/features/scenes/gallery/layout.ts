import type { Area, PxRect } from '../shared/units'

export type Wall = 'back' | 'left' | 'right'

/** Wall sizes in px: back is 1320×840, side walls 450 deep × 840. */
export const WALL_AREA: Record<Wall, Area> = {
  back: { width: 1320, height: 840 },
  left: { width: 450, height: 840 },
  right: { width: 450, height: 840 },
}

export const ROOM = { halfWidth: 660, halfHeight: 420, depth: 450 } as const

export type GallerySlot = {
  wall: Wall
  rect: PxRect
  border: number
  inset: number
}

/** [wall, left, top, w, h, border, mat inset] — from the "Gallery room" mockup. */
const RAW = [
  ['back', 130, 280, 200, 260, 6, 14],
  ['back', 990, 300, 190, 250, 6, 14],
  ['left', 30, 290, 130, 180, 5, 11],
  ['left', 190, 320, 110, 140, 5, 11],
  ['left', 330, 350, 90, 110, 4, 9],
  ['right', 30, 350, 90, 110, 4, 9],
  ['right', 150, 310, 120, 150, 5, 11],
  ['right', 300, 280, 135, 100, 5, 11],
  ['back', 990, 580, 150, 110, 5, 11],
] as const

export const GALLERY_SLOTS: readonly GallerySlot[] = RAW.map(
  ([wall, x, y, width, height, border, inset]) => ({
    wall,
    rect: { x, y, width, height },
    border,
    inset,
  }),
)

export const GALLERY_FOCUS: PxRect = { x: 380, y: 200, width: 560, height: 420 }
