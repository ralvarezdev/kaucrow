import type { SceneId } from '@/features/scenes/ids'

export const PHOTO_GROUPS = ['friends', 'family'] as const
export type PhotoGroup = (typeof PHOTO_GROUPS)[number]
export type GroupFilter = 'all' | PhotoGroup

export type Photo = {
  /** Flat placeholder colour, always present; the image paints over it once loaded. */
  tone: string
  imageUrl?: string
  name: string
  note: string
  group: PhotoGroup
  /** True for photos added in this session. */
  mine: boolean
}

export type PhotoDraft = {
  name: string
  note: string
  group?: PhotoGroup
  imageUrl?: string
}

export type { SceneId }
