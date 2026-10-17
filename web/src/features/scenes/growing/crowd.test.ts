import { describe, expect, it } from 'vitest'
import {
  type CrowdCard,
  cardOpacity,
  generateCrowd,
  INFINITY,
  infinityPoint,
  isBlurred,
} from './crowd'

describe('generateCrowd', () => {
  it('is deterministic for a given seed', () => {
    expect(generateCrowd(1)).toEqual(generateCrowd(1))
  })

  it('produces 72 friends and 30 family when family is shown', () => {
    const crowd = generateCrowd(undefined, true)
    expect(crowd.filter((c) => c.group === 'friends')).toHaveLength(72)
    expect(crowd.filter((c) => c.group === 'family')).toHaveLength(30)
  })

  it('produces only friends when family is hidden', () => {
    const crowd = generateCrowd(undefined, false)
    expect(crowd).toHaveLength(102)
    expect(crowd.every((c) => c.group === 'friends')).toBe(true)
  })

  it('forms an infinity symbol when family is hidden', () => {
    const xs = generateCrowd(undefined, false).map((c) => c.rect.x)
    // Both loops are filled and the middle is crossed.
    expect(xs.filter((x) => x < INFINITY.cx - 200).length).toBeGreaterThan(20)
    expect(xs.filter((x) => x > INFINITY.cx + 200).length).toBeGreaterThan(20)
    expect(xs.filter((x) => Math.abs(x - INFINITY.cx) < 100).length).toBeGreaterThan(5)
  })

  it('keeps cards out of the header and controls', () => {
    for (const { rect } of generateCrowd()) {
      expect(rect.y).toBeGreaterThanOrEqual(120)
      expect(rect.y).toBeLessThanOrEqual(690)
    }
  })
})

describe('card styling', () => {
  const [near, far] = [
    { ...generateCrowd()[0], depth: 1 },
    { ...generateCrowd()[0], depth: 0 },
  ] as [CrowdCard, CrowdCard]

  it('fades non-matching groups almost out', () => {
    expect(cardOpacity(far, false)).toBe(0.08)
  })

  it('makes nearer cards brighter', () => {
    expect(cardOpacity(near, true)).toBeGreaterThan(cardOpacity(far, true))
  })

  it('blurs only the far cards', () => {
    expect(isBlurred(far)).toBe(true)
    expect(isBlurred(near)).toBe(false)
  })
})

describe('infinityPoint', () => {
  it('passes through the centre and reaches both ends', () => {
    expect(infinityPoint(Math.PI / 2).x).toBeCloseTo(INFINITY.cx, 0)
    expect(infinityPoint(0).x).toBeCloseTo(INFINITY.cx + INFINITY.a / 1, 0)
    expect(infinityPoint(Math.PI).x).toBeCloseTo(INFINITY.cx - INFINITY.a, 0)
  })

  it('returns a unit normal', () => {
    const { nx, ny } = infinityPoint(1)
    expect(Math.hypot(nx, ny)).toBeCloseTo(1, 3)
  })
})
