import { describe, expect, it } from 'vitest'
import { GRID, ROWS } from './pixels'

describe('arch pixels', () => {
  it('fits the grid with known characters', () => {
    expect(ROWS).toHaveLength(GRID.height)
    for (const row of ROWS) {
      expect(row).toHaveLength(GRID.width)
      expect(row).toMatch(/^[.A]+$/)
    }
  })

  it('is symmetric, like the logo', () => {
    for (const row of ROWS) expect(row).toBe([...row].reverse().join(''))
  })
})
