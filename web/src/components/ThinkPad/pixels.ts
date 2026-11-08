/**
 * An open ThinkPad on a 43×47 grid, one character per pixel: G edge, K black plastic, S screen, B bar,
 * C bar accent, A Arch blue, W wordmark, R ThinkPad red, Y key, T trackpad. '.' is empty.
 */
import { ROWS as ARCH } from '../Arch/pixels'

export const GRID = { width: 43, height: 47 } as const

export type Pixel = 'G' | 'K' | 'S' | 'B' | 'C' | 'A' | 'W' | 'R' | 'Y' | 'T'

/** "ThinkPad" in a 3×5 face; the dot of the i is the red one. */
const WORDMARK: readonly (readonly string[])[] = [
  ['WWW', '.W.', '.W.', '.W.', '.W.'],
  ['W..', 'W..', 'WW.', 'W.W', 'W.W'],
  ['R', '.', 'W', 'W', 'W'],
  ['...', '...', 'WW.', 'W.W', 'W.W'],
  ['W..', 'W..', 'W.W', 'WW.', 'W.W'],
  ['WW.', 'W.W', 'WW.', 'W..', 'W..'],
  ['...', '...', 'WWW', '..W', 'WWW'],
  ['..W', '..W', 'WWW', 'W.W', 'WWW'],
]

type Canvas = string[][]

function fill(canvas: Canvas, x: number, y: number, width: number, height: number, c: Pixel) {
  for (let j = y; j < y + height; j++)
    for (let i = x; i < x + width; i++) (canvas[j] as string[])[i] = c
}

function stamp(canvas: Canvas, x: number, y: number, art: readonly string[]) {
  art.forEach((row, j) => {
    for (let i = 0; i < row.length; i++) {
      const c = row[i] as string
      if (c !== '.') (canvas[y + j] as string[])[x + i] = c
    }
  })
}

function draw(): string[] {
  const canvas: Canvas = Array.from({ length: GRID.height }, () => Array(GRID.width).fill('.'))

  // Lid: edge, bezel, screen and the chin that carries the wordmark.
  fill(canvas, 2, 0, 39, 29, 'G')
  fill(canvas, 3, 1, 37, 27, 'K')
  fill(canvas, 5, 3, 33, 18, 'S')
  fill(canvas, 5, 3, 33, 1, 'B')
  for (const x of [6, 8, 10]) fill(canvas, x, 3, 1, 1, 'C')
  stamp(
    canvas,
    17,
    8,
    ARCH.map((row) => row.replaceAll('.', 'S')),
  )
  let x = 7
  for (const glyph of WORDMARK) {
    stamp(canvas, x, 22, glyph)
    x += (glyph[0] as string).length + 1
  }

  // Base: deck, keyboard, TrackPoint, the three buttons and the trackpad.
  fill(canvas, 0, 29, 43, 18, 'G')
  fill(canvas, 1, 30, 41, 16, 'K')
  const KEYS = `${'YY.'.repeat(11)}YY`
  const SPACE = `${'YY.'.repeat(4)}${'Y'.repeat(11)}.${'YY.'.repeat(3)}YY`
  for (const [i, y] of [31, 33, 35, 37, 39].entries()) {
    const row = (i === 4 ? SPACE : KEYS).replaceAll('.', 'K')
    stamp(canvas, 4, y, [row])
  }
  fill(canvas, 21, 34, 1, 2, 'R')
  stamp(canvas, 14, 41, ['YYYYYKYYYKYYYYY'])
  fill(canvas, 14, 42, 15, 3, 'T')

  return canvas.map((row) => row.join(''))
}

export const ROWS: readonly string[] = draw()
