import { describe, expect, it } from 'vitest'
import { fitDistance, fovFor, rectCentre } from './units'

const stage = { width: 1280, height: 800 }

describe('rectCentre', () => {
  it('maps the stage centre to the world origin', () => {
    expect(rectCentre({ x: 590, y: 350, width: 100, height: 100 }, stage)).toEqual([0, 0])
  })

  it('flips y so higher on screen is higher in the world', () => {
    const [, top] = rectCentre({ x: 0, y: 0, width: 10, height: 10 }, stage)
    const [, bottom] = rectCentre({ x: 0, y: 790, width: 10, height: 10 }, stage)
    expect(top).toBeGreaterThan(bottom)
  })
})

describe('fovFor', () => {
  it('shows exactly the stage height at the given distance', () => {
    const fov = (fovFor(10) * Math.PI) / 180
    expect(2 * 10 * Math.tan(fov / 2)).toBeCloseTo(8)
  })
})

describe('fitDistance', () => {
  it('keeps the camera put at or above the stage aspect', () => {
    expect(fitDistance(10, 1.6)).toBe(10)
    expect(fitDistance(10, 2.4)).toBe(10)
  })

  it('backs off on narrow viewports so the stage width still fits', () => {
    expect(fitDistance(10, 0.8)).toBeCloseTo(20)
  })
})
