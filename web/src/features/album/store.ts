import { create } from 'zustand'
import type { SceneId } from '@/features/scenes/ids'
import { NEW_PHOTO_TONE } from './config'
import { SEED_PHOTOS } from './data/seed'
import type { Photo, PhotoDraft } from './types'

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
  pick: (slot: number) => void
  step: (delta: 1 | -1) => void
  setScene: (scene: SceneId) => void
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

  pick: (slot) =>
    set(({ slots, focus }) => {
      const swapped = slots[slot]
      if (swapped === undefined) return {}
      const next = slots.slice()
      next[slot] = focus
      return { slots: next, focus: swapped, tour: slot }
    }),

  step: (delta) => {
    const { slots, tour, pick } = get()
    const n = slots.length
    if (n > 0) pick((tour + delta + n) % n)
  },

  setScene: (scene) => set({ scene }),
  openAdd: () => set({ adding: true }),
  closeAdd: () => set({ adding: false }),

  addPhoto: (draft) =>
    set(({ photos, slots, focus }) => {
      const photo: Photo = {
        tone: NEW_PHOTO_TONE,
        name: draft.name.trim() || '[YOUR NAME]',
        note: draft.note.trim() || '[Your note]',
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
