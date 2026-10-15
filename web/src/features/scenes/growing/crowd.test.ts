import { describe, expect, it } from 'vitest'
import type { Photo } from '@/features/album/types'
import { cardOpacity, generateCrowd, isBlurred, placeNewCard } from './crowd'

describe('generateCrowd', () => {
  it('is deterministic for a given seed', () => {
    expect(generateCrowd(1)).toEqual(generateCrowd(1))
  })

  it('produces 72 friends and 30 family', () => {
    const crowd = generateCrowd()
    expect(crowd.filter((c) => c.group === 'friends')).toHaveLength(72)
    expect(crowd.filter((c) => c.group === 'family')).toHaveLength(30)
  })

  it('keeps cards out of the header and controls', () => {
    for (const { rect } of generateCrowd()) {
      expect(rect.y).toBeGreaterThanOrEqual(120)
      expect(rect.y).toBeLessThanOrEqual(690)
    }
  })
})

describe('card styling', () => {
  const photo: Photo = { tone: '#000', name: '', note: '', group: 'family', mine: true }
  const fresh = placeNewCard(photo, 0)
  const far = { ...fresh, depth: 0, fresh: false }

  it('fades non-matching groups almost out', () => {
    expect(cardOpacity(far, false)).toBe(0.08)
  })

  it('shows fresh cards at full opacity', () => {
    expect(cardOpacity(fresh, true)).toBe(1)
  })

  it('blurs only far, non-fresh cards', () => {
    expect(isBlurred(far)).toBe(true)
    expect(isBlurred(fresh)).toBe(false)
  })

  it('places new cards by their group cluster', () => {
    const family = placeNewCard(photo, 0)
    const friends = placeNewCard({ ...photo, group: 'friends' }, 0)
    expect(family.rect.x).toBeGreaterThan(friends.rect.x)
  })
})
