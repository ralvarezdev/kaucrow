import { create } from 'zustand'
import { SCENE_IDS, type SceneId } from '@/features/scenes/ids'
import { SEED_PHOTOS } from './data/seed'
import type { GroupFilter, Photo } from './types'

/**
 * `slots[i]` is the index into `photos` currently hung at layout slot `i`.
 * `focus` is the photo shown large in the middle; picking a slot swaps the two.
 */
type AlbumState = {
  photos: Photo[]
  slots: number[]
  focus: number
  tour: number
  scene: SceneId
  filter: GroupFilter
  pick: (slot: number) => void
  /** The photo shown large in the expanded view, if any. */
  expanded: Photo | null
  expand: (photo: Photo) => void
  collapse: () => void
  /** Shows the next or previous album photo in the expanded view, wrapping around. */
  expandStep: (delta: 1 | -1) => void
  /** Moves the tour through the first `count` slots, the ones the scene actually shows. */
  step: (delta: 1 | -1, count: number) => void
  /** Swaps a random shown slot (among the first `count`) with a hidden one, so the selection keeps changing. */
  cycle: (count: number) => void
  setScene: (scene: SceneId) => void
  setFilter: (filter: GroupFilter) => void
}

const lastIndex = SEED_PHOTOS.length - 1

/** `?scene=growing` opens that view, so a link can point at one. Anything else opens the first. */
export function sceneFromQuery(search: string): SceneId {
  const wanted = new URLSearchParams(search).get('scene')
  return SCENE_IDS.find((id) => id === wanted) ?? 'night-sky'
}

export const useAlbum = create<AlbumState>((set, get) => ({
  photos: SEED_PHOTOS,
  slots: Array.from({ length: lastIndex }, (_, i) => i),
  focus: lastIndex,
  tour: 0,
  scene: sceneFromQuery(typeof location === 'undefined' ? '' : location.search),
  expanded: null,
  filter: 'all',

  pick: (slot) =>
    set(({ slots, focus }) => {
      const swapped = slots[slot]
      if (swapped === undefined) return {}
      const next = slots.slice()
      next[slot] = focus
      return { slots: next, focus: swapped, tour: slot }
    }),

  step: (delta, count) => {
    const { slots, tour, pick } = get()
    const n = Math.min(count, slots.length)
    if (n > 0) pick((((tour + delta) % n) + n) % n)
  },

  cycle: (count) =>
    set(({ slots }) => {
      if (count <= 0 || slots.length <= count) return {}
      const shown = Math.floor(Math.random() * count)
      const hidden = count + Math.floor(Math.random() * (slots.length - count))
      const next = slots.slice()
      next[shown] = slots[hidden] as number
      next[hidden] = slots[shown] as number
      return { slots: next }
    }),

  expand: (expanded) => set({ expanded }),
  collapse: () => set({ expanded: null }),
  expandStep: (delta) =>
    set(({ expanded, photos }) => {
      if (!expanded || photos.length < 2) return {}
      // A card in Growing carries a thumbnail; its full image is the album photo's own.
      const key = expanded.fullUrl ?? expanded.imageUrl
      const at = photos.findIndex((p) => p.imageUrl === key)
      const next = photos[(at + delta + photos.length) % photos.length]
      return at < 0 || !next ? {} : { expanded: next }
    }),
  setScene: (scene) => set({ scene, expanded: null }),
  setFilter: (filter) => set({ filter }),
}))
