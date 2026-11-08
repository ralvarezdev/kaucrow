import { create } from 'zustand'
import { SCENE_IDS, type SceneId } from '@/features/scenes/ids'
import { SEED_PHOTOS } from './data/seed'
import { loadFavorites, photoKey, saveFavorites } from './favorites'
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
  /** Keys of the starred photos, kept in localStorage. */
  favorites: string[]
  toggleFavorite: (photo: Photo) => void
  /** True while the expanded view walks through the favourites only. */
  favoritesOnly: boolean
  /** Opens the expanded view on the first favourite; the arrows then stay among the favourites. */
  expandFavorites: () => void
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
  favorites: loadFavorites(),
  favoritesOnly: false,

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

  toggleFavorite: (photo) =>
    set(({ favorites }) => {
      const key = photoKey(photo)
      if (!key) return {}
      const next = favorites.includes(key)
        ? favorites.filter((k) => k !== key)
        : [...favorites, key]
      saveFavorites(next)
      return { favorites: next }
    }),
  expandFavorites: () =>
    set(({ photos, favorites }) => {
      const first = photos.find((p) => p.imageUrl && favorites.includes(p.imageUrl))
      return first ? { expanded: first, favoritesOnly: true } : {}
    }),

  expand: (expanded) => set({ expanded, favoritesOnly: false }),
  collapse: () => set({ expanded: null, favoritesOnly: false }),
  expandStep: (delta) =>
    set(({ expanded, photos, favorites, favoritesOnly }) => {
      if (!expanded) return {}
      const key = photoKey(expanded)
      const starred = photos.filter((p) => p.imageUrl && favorites.includes(p.imageUrl))
      // A photo un-starred while walking the favourites is no longer among them: walk the whole album.
      const list = favoritesOnly && starred.some((p) => p.imageUrl === key) ? starred : photos
      if (list.length < 2) return {}
      // A card in Growing carries a thumbnail; its full image is the album photo's own.
      const at = list.findIndex((p) => p.imageUrl === key)
      const next = list[(at + delta + list.length) % list.length]
      return at < 0 || !next ? {} : { expanded: next }
    }),
  setScene: (scene) => set({ scene, expanded: null }),
  setFilter: (filter) => set({ filter }),
}))
