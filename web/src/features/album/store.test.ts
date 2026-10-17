import { beforeEach, describe, expect, it } from 'vitest'
import { FEATURED_PHOTO, photoUrl, SEED_PHOTOS } from './data/seed'
import { useAlbum } from './store'

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

  it('adds a photo, focuses it and closes the dialog', () => {
    useAlbum.getState().openAdd()
    const previousFocus = useAlbum.getState().focus
    useAlbum.getState().addPhoto({ name: '  Ana ', note: '', group: 'family' })
    const s = useAlbum.getState()
    expect(s.photos).toHaveLength(SEED_PHOTOS.length + 1)
    expect(s.photos[s.focus]).toMatchObject({
      name: 'Ana',
      note: '[Your note]',
      group: 'family',
      mine: true,
    })
    expect(s.slots.at(-1)).toBe(previousFocus)
    expect(s.adding).toBe(false)
  })

  it('defaults a new photo to the friends group', () => {
    useAlbum.getState().addPhoto({ name: '', note: '' })
    const s = useAlbum.getState()
    expect(s.photos[s.focus]?.group).toBe('friends')
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
