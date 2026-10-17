import { describe, expect, it } from 'vitest'
import { GRID, LAYERS, layerPaths } from './pixels'

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

  it('merges a run of pixels into one rectangle', () => {
    expect(layerPaths(['.BBB.', 'E....'])).toEqual({
      B: 'M1 0h3v1h-3z',
      E: 'M0 1h1v1h-1z',
    })
  })
})
