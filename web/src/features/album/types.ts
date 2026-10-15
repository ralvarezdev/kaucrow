import type { SceneId } from '@/features/scenes/ids'

export type Photo = {
  /** Flat placeholder colour, always present; the image paints over it once loaded. */
  tone: string
  imageUrl?: string
  name: string
  note: string
  /** True for photos added in this session. */
  mine: boolean
}

export type PhotoDraft = {
  name: string
  note: string
  imageUrl?: string
}

export type { SceneId }
