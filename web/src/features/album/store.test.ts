import { beforeEach, describe, expect, it } from 'vitest'
import { FEATURED_PHOTO, photoUrl } from './data/seed'
import { sceneFromQuery, useAlbum } from './store'
import type { Photo } from './types'

const initial = useAlbum.getState()
beforeEach(() => useAlbum.setState(initial, true))

describe('album store', () => {
  it('opens on the featured photo', () => {
    const { photos, focus } = useAlbum.getState()
    expect(photos[focus]?.imageUrl).toBe(photoUrl(FEATURED_PHOTO))
  })

  it('swaps the picked slot with the focused photo', () => {
    const { focus, slots, pick } = useAlbum.getState()
    const hung = slots[3]
    pick(3)
    const next = useAlbum.getState()
    expect(next.slots[3]).toBe(focus)
    expect(next.focus).toBe(hung)
    expect(next.tour).toBe(3)
  })

  it('ignores slots that do not exist', () => {
    const before = useAlbum.getState()
    before.pick(999)
    expect(useAlbum.getState().slots).toEqual(before.slots)
  })

  it('wraps the tour in both directions', () => {
    const n = useAlbum.getState().slots.length
    useAlbum.getState().step(-1, n)
    expect(useAlbum.getState().tour).toBe(n - 1)
    useAlbum.getState().step(1, n)
    expect(useAlbum.getState().tour).toBe(0)
  })
})

describe('step and cycle', () => {
  it('tours only the shown slots', () => {
    useAlbum.setState({ tour: 2 })
    useAlbum.getState().step(1, 3)
    expect(useAlbum.getState().tour).toBe(0)
    useAlbum.getState().step(-1, 3)
    expect(useAlbum.getState().tour).toBe(2)
  })

  it('swaps a shown slot with a hidden one and keeps every photo once', () => {
    const before = useAlbum.getState().slots
    useAlbum.getState().cycle(4)
    const after = useAlbum.getState().slots
    expect([...after].sort((a, b) => a - b)).toEqual([...before].sort((a, b) => a - b))
    expect(after.slice(0, 4)).not.toEqual(before.slice(0, 4))
  })
})

describe('sceneFromQuery', () => {
  it('opens the scene named in the query', () => {
    expect(sceneFromQuery('?scene=growing')).toBe('growing')
    expect(sceneFromQuery('?x=1&scene=dotfiles')).toBe('dotfiles')
  })

  it('falls back to the first scene for anything unknown', () => {
    expect(sceneFromQuery('')).toBe('night-sky')
    expect(sceneFromQuery('?scene=nope')).toBe('night-sky')
  })
})

describe('expandStep', () => {
  it('walks through the album and wraps around', () => {
    const { photos, expand } = useAlbum.getState()
    expand(photos[0] as Photo)
    useAlbum.getState().expandStep(1)
    expect(useAlbum.getState().expanded).toBe(photos[1])
    useAlbum.getState().expandStep(-1)
    useAlbum.getState().expandStep(-1)
    expect(useAlbum.getState().expanded).toBe(photos.at(-1))
  })

  it('finds a Growing card by its full image, not its thumbnail', () => {
    const { photos } = useAlbum.getState()
    const card: Photo = {
      ...(photos[3] as Photo),
      imageUrl: '/photos/thumb/x.webp',
      fullUrl: photos[3]?.imageUrl as string,
    }
    useAlbum.getState().expand(card)
    useAlbum.getState().expandStep(1)
    expect(useAlbum.getState().expanded).toBe(photos[4])
  })

  it('does nothing when no photo is expanded', () => {
    useAlbum.getState().expandStep(1)
    expect(useAlbum.getState().expanded).toBeNull()
  })
})
