import { describe, expect, it } from 'vitest'
import { ENTRANCES, type EntranceKind, entranceDelay, entranceFrame, REST } from './entrance'

const KINDS = Object.keys(ENTRANCES) as EntranceKind[]
const AT = { x: 3, y: -2 }

describe('entranceFrame', () => {
  it.each(KINDS)('%s starts invisible and ends at rest', (kind) => {
    expect(entranceFrame(kind, 0, AT).alpha).toBe(0)
    expect(entranceFrame(kind, 1, AT)).toEqual(REST)
    expect(entranceFrame(kind, 1.5, AT)).toEqual(REST)
  })

  it.each(KINDS)('%s never overshoots the alpha range', (kind) => {
    for (let t = -0.5; t <= 1.2; t += 0.05) {
      const { alpha } = entranceFrame(kind, t, AT)
      expect(alpha).toBeGreaterThanOrEqual(0)
      expect(alpha).toBeLessThanOrEqual(1)
    }
  })

  it('grows a frame out of the stage centre', () => {
    const start = entranceFrame('grow', 0, AT)
    expect(start.dx).toBeCloseTo(-AT.x)
    expect(start.dy).toBeCloseTo(-AT.y)
    expect(start.scale).toBeLessThan(0.2)
  })

  it('only fades under reduced motion', () => {
    const mid = entranceFrame('fade', 0.5, AT)
    expect(mid).toEqual({ ...REST, alpha: 0.5 })
  })
})

describe('entranceDelay', () => {
  it('lets the centre arrive first and the edges last', () => {
    expect(entranceDelay('drift', 0, 0)).toBeLessThan(entranceDelay('drift', 4, 3))
  })

  it('does not stagger the plain fade', () => {
    expect(entranceDelay('fade', 0, 0)).toBe(entranceDelay('fade', 6, 4))
  })
})
