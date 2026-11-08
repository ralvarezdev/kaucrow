import { describe, expect, it } from 'vitest'
import { GRID, ROWS } from './pixels'

describe('laptop pixels', () => {
  it('fits the grid with known characters', () => {
    expect(ROWS).toHaveLength(GRID.height)
    for (const row of ROWS) {
      expect(row).toHaveLength(GRID.width)
      expect(row).toMatch(/^[.GKSBCAWRYT]+$/)
    }
  })

  it('draws the Arch logo, the red dot of the i and the TrackPoint', () => {
    const all = ROWS.join('')
    expect(all.match(/A/g)).toHaveLength(33)
    expect(all.match(/R/g)).toHaveLength(3)
  })
})
