import { describe, expect, it } from 'vitest'
import { buildFrame, rectsToPath, rowsToRects } from './pixels'

const idle = { tick: 0, caw: -1, animate: true, look: { x: 0, y: 0 } }

describe('rowsToRects', () => {
  it('turns [y, x1, x2] rows into one-pixel-high runs', () => {
    expect(rowsToRects([[5, 2, 4]])).toEqual([{ x: 2, y: 5, w: 3, h: 1 }])
  })
})

describe('rectsToPath', () => {
  it('draws each rect as a closed sub-path', () => {
    expect(rectsToPath([{ x: 1, y: 2, w: 3, h: 1 }])).toBe('M1 2h3v1h-3z')
  })
})

describe('buildFrame', () => {
  it('keeps the mouth closed and the crow on the ground when idle', () => {
    const frame = buildFrame(idle)
    expect(frame.hop).toBe(0)
    expect(frame.ink.some((r) => r.w === 5)).toBe(false)
  })

  it('opens the mouth and hops mid-caw', () => {
    const frame = buildFrame({ ...idle, caw: 3 })
    expect(frame.hop).toBeLessThan(0)
    expect(frame.ink.some((r) => r.w === 5)).toBe(true)
  })

  it('squints the eye while blinking', () => {
    const open = buildFrame(idle).ink.find((r) => r.w === 2)
    const blink = buildFrame({ ...idle, tick: 32 }).ink.find((r) => r.w === 2)
    expect(open?.h).toBe(2)
    expect(blink?.h).toBe(1)
  })

  it('moves the eye toward the gaze, clamped to one pixel', () => {
    const right = buildFrame({ ...idle, look: { x: 1, y: 0 } }).ink.find((r) => r.w === 2)
    const far = buildFrame({ ...idle, look: { x: 9, y: 0 } }).ink.find((r) => r.w === 2)
    expect(right?.x).toBe(20)
    expect(far?.x).toBe(20)
  })

  it('freezes the scene when animation is off', () => {
    const a = buildFrame({ ...idle, animate: false, tick: 3 })
    const b = buildFrame({ ...idle, animate: false, tick: 99 })
    expect(a).toEqual(b)
  })
})
