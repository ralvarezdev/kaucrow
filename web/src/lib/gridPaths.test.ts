import { describe, expect, it } from 'vitest'
import { gridPaths } from './gridPaths'

describe('gridPaths', () => {
  it('merges a run of pixels into one rectangle', () => {
    expect(gridPaths(['.BBB.', 'E....'])).toEqual({
      B: 'M1 0h3v1h-3z',
      E: 'M0 1h1v1h-1z',
    })
  })

  it('keeps separate runs of one colour in the same path', () => {
    expect(gridPaths(['B.B'])).toEqual({ B: 'M0 0h1v1h-1zM2 0h1v1h-1z' })
  })

  it('draws nothing for an empty grid', () => {
    expect(gridPaths(['...'])).toEqual({})
  })
})
