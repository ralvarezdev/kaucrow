/** Crow sprite on a 48×48 grid, traced from the logo. Rows are [y, xStart, xEnd]. */
export type Row = readonly [y: number, x1: number, x2: number]
export type Rect = { x: number; y: number; w: number; h: number }

export const BODY_ROWS: readonly Row[] = [
  [15, 19, 24],
  [16, 18, 26],
  [17, 17, 27],
  [18, 16, 28],
  [19, 16, 29],
  [20, 16, 30],
  [21, 13, 15],
  [21, 17, 31],
  [22, 12, 31],
  [23, 11, 32],
  [24, 21, 30],
  [24, 33, 33],
  [25, 22, 29],
  [25, 31, 34],
  [26, 22, 34],
  [27, 22, 27],
  [27, 29, 35],
  [28, 22, 26],
  [28, 28, 36],
  [29, 22, 26],
  [29, 28, 36],
  [30, 22, 26],
  [30, 28, 37],
  [31, 22, 26],
  [31, 28, 37],
  [32, 22, 26],
  [32, 28, 28],
  [32, 30, 38],
  [33, 21, 26],
  [33, 28, 28],
  [33, 30, 38],
  [34, 21, 26],
  [34, 28, 29],
  [34, 31, 39],
  [35, 21, 27],
  [35, 29, 39],
  [35, 41, 41],
  [36, 21, 28],
  [36, 30, 31],
  [36, 33, 40],
  [37, 21, 29],
  [37, 31, 32],
  [37, 34, 39],
  [38, 21, 30],
  [38, 32, 38],
  [39, 21, 31],
  [39, 33, 37],
  [40, 21, 32],
  [40, 34, 36],
  [41, 21, 33],
  [41, 35, 35],
  [42, 21, 33],
  [43, 21, 31],
  [44, 21, 28],
]

export const OUTLINE_ROWS: readonly Row[] = [
  [3, 20, 27],
  [4, 17, 30],
  [5, 15, 32],
  [6, 13, 34],
  [7, 12, 35],
  [8, 10, 37],
  [9, 9, 38],
  [10, 8, 39],
  [11, 8, 39],
  [12, 7, 40],
  [13, 6, 41],
  [14, 6, 41],
  [15, 5, 18],
  [15, 25, 42],
  [16, 5, 17],
  [16, 27, 42],
  [17, 4, 16],
  [17, 28, 43],
  [18, 4, 15],
  [18, 29, 43],
  [19, 4, 15],
  [19, 30, 43],
  [20, 3, 15],
  [20, 31, 44],
  [21, 3, 12],
  [21, 16, 16],
  [21, 32, 44],
  [22, 3, 11],
  [22, 32, 44],
  [23, 3, 10],
  [23, 33, 44],
  [24, 3, 20],
  [24, 31, 32],
  [24, 34, 44],
  [25, 3, 21],
  [25, 30, 30],
  [25, 35, 44],
  [26, 3, 21],
  [26, 35, 44],
  [27, 3, 21],
  [27, 28, 28],
  [27, 36, 44],
  [28, 4, 21],
  [28, 27, 27],
  [28, 37, 43],
  [29, 4, 21],
  [29, 27, 27],
  [29, 37, 43],
  [30, 4, 21],
  [30, 27, 27],
  [30, 38, 43],
  [31, 5, 21],
  [31, 27, 27],
  [31, 38, 42],
  [32, 5, 21],
  [32, 27, 27],
  [32, 29, 29],
  [32, 39, 42],
  [33, 6, 20],
  [33, 27, 27],
  [33, 29, 29],
  [33, 39, 41],
  [34, 6, 20],
  [34, 27, 27],
  [34, 30, 30],
  [34, 40, 41],
  [35, 7, 20],
  [35, 28, 28],
  [35, 40, 40],
  [36, 8, 20],
  [36, 29, 29],
  [36, 32, 32],
  [37, 8, 20],
  [37, 30, 30],
  [37, 33, 33],
  [38, 9, 20],
  [38, 31, 31],
  [39, 10, 20],
  [39, 32, 32],
  [40, 12, 20],
  [40, 33, 33],
  [41, 13, 20],
  [41, 34, 34],
  [42, 15, 20],
  [42, 35, 35],
  [43, 17, 20],
  [44, 20, 20],
]

/** Sheet music the crow carries, and the copy that flies off when he caws. */
const NOTE: readonly (readonly [number, number])[] = [
  [31, 11],
  [31, 15],
  [31, 16],
  [32, 11],
  [32, 15],
  [32, 16],
  [33, 11],
  [33, 12],
  [33, 13],
  [33, 14],
  [33, 15],
  [33, 16],
]
const STARS: readonly (readonly [number, number])[] = [
  [6, 18],
  [11, 17],
  [12, 11],
  [17, 10],
  [21, 7],
  [23, 12],
  [28, 7],
  [28, 13],
  [36, 11],
  [36, 16],
  [39, 15],
  [39, 18],
]
const HOP = [0, -2, -3, -3, -2, 0, -1, 0, 0] as const

const FRAME_MS = 150
export const CAW_LAST_FRAME = 8
export { FRAME_MS }

const clamp = (v: number) => Math.max(-1, Math.min(1, v))
const cell = (y: number, x: number): Rect => ({ x, y, w: 1, h: 1 })

export const rowsToRects = (rows: readonly Row[]): Rect[] =>
  rows.map(([y, x1, x2]) => ({ x: x1, y, w: x2 - x1 + 1, h: 1 }))

export const rectsToPath = (rects: readonly Rect[]): string =>
  rects.map((r) => `M${r.x} ${r.y}h${r.w}v${r.h}h${-r.w}z`).join('')

export type CrowFrameInput = {
  tick: number
  caw: number
  animate: boolean
  look: { x: number; y: number }
}

export type CrowFrame = { cream: Rect[]; ink: Rect[]; hop: number }

/** The parts of the sprite that change per animation frame. */
export function buildFrame({ tick, caw, animate, look }: CrowFrameInput): CrowFrame {
  const cawing = animate && caw >= 0
  const hop = cawing ? (HOP[caw] ?? 0) : 0
  const mouthOpen = animate && caw >= 1 && caw <= 5
  const blink = animate && tick % 34 >= 32

  const eyeX = 19 + clamp(Math.round(look.x * 1.4))
  const eyeY = 18 + clamp(Math.round(look.y * 1.4))

  const ink: Rect[] = []
  const cream: Rect[] = []

  if (mouthOpen) ink.push({ x: 13, y: 22, w: 5, h: 1 })
  ink.push(blink ? { x: eyeX, y: eyeY + 1, w: 2, h: 1 } : { x: eyeX, y: eyeY, w: 2, h: 2 })

  STARS.forEach(([y, x], i) => {
    if (!animate || (tick + i * 5) % 17 < 12) cream.push(cell(y, x))
  })

  const bob = animate && Math.floor(tick / 8) % 2 === 1 ? -1 : 0
  for (const [y, x] of NOTE) cream.push(cell(y, x + bob))

  if (animate && caw >= 1) {
    const fy = 25 - Math.round(caw * 1.3)
    for (const [y, x] of NOTE) cream.push(cell(y - 11 + fy, x - 26))
  }

  return { cream, ink, hop }
}
