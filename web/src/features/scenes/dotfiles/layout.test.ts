import { describe, expect, it } from 'vitest'
import type { PxRect } from '../shared/units'
import { DOTFILES_FOCUS, DOTFILES_SLOTS } from './layout'

const all: PxRect[] = [DOTFILES_FOCUS, ...DOTFILES_SLOTS]
const overlaps = (a: PxRect, b: PxRect) =>
  a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height

describe('dotfiles layout', () => {
  it('keeps every window on the stage', () => {
    for (const r of all) {
      expect(r.x).toBeGreaterThanOrEqual(0)
      expect(r.y).toBeGreaterThanOrEqual(0)
      expect(r.x + r.width).toBeLessThanOrEqual(1280)
      expect(r.y + r.height).toBeLessThanOrEqual(800)
    }
  })

  it('never overlaps two windows', () => {
    for (const [i, a] of all.entries()) {
      for (const b of all.slice(i + 1)) expect(overlaps(a, b)).toBe(false)
    }
  })
})
