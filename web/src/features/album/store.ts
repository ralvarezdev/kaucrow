import { create } from 'zustand'
import type { SceneId } from '@/features/scenes/ids'
import { NEW_PHOTO_TONE } from './config'
import { SEED_PHOTOS } from './data/seed'
import type { GroupFilter, Photo, PhotoDraft } from './types'

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
  adding: boolean
  filter: GroupFilter
  pick: (slot: number) => void
  /** The photo shown large in the expanded view, if any. */
  expanded: Photo | null
  expand: (photo: Photo) => void
  collapse: () => void
  /** Moves the tour through the first `count` slots, the ones the scene actually shows. */
  step: (delta: 1 | -1, count: number) => void
  /** Swaps a random shown slot (among the first `count`) with a hidden one, so the selection keeps changing. */
  cycle: (count: number) => void
  setScene: (scene: SceneId) => void
  setFilter: (filter: GroupFilter) => void
  openAdd: () => void
  closeAdd: () => void
  addPhoto: (draft: PhotoDraft) => void
}

const lastIndex = SEED_PHOTOS.length - 1

export const useAlbum = create<AlbumState>((set, get) => ({
  photos: SEED_PHOTOS,
  slots: Array.from({ length: lastIndex }, (_, i) => i),
  focus: lastIndex,
  tour: 0,
  scene: 'night-sky',
  adding: false,
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
  setScene: (scene) => set({ scene, expanded: null }),
  setFilter: (filter) => set({ filter }),
  openAdd: () => set({ adding: true }),
  closeAdd: () => set({ adding: false }),

  addPhoto: (draft) =>
    set(({ photos, slots, focus }) => {
      const photo: Photo = {
        tone: NEW_PHOTO_TONE,
        name: draft.name.trim() || '[YOUR NAME]',
        note: draft.note.trim() || '[Your note]',
        group: draft.group ?? 'friends',
        mine: true,
        ...(draft.imageUrl ? { imageUrl: draft.imageUrl } : {}),
      }
      return {
        photos: [...photos, photo],
        slots: [...slots, focus],
        focus: photos.length,
        adding: false,
      }
    }),
}))
