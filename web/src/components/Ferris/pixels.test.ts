import { describe, expect, it } from 'vitest'
import { GRID, LAYERS } from './pixels'

describe('ferris pixels', () => {
  it('keeps every layer on the grid with known characters', () => {
    for (const layer of Object.values(LAYERS)) {
      expect(layer).toHaveLength(GRID.height)
      for (const row of layer) {
        expect(row).toHaveLength(GRID.width)
        expect(row).toMatch(/^[.OBEW]+$/)
      }
    }
  })
})
