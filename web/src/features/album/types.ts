import type { SceneId } from '@/features/scenes/ids'

export const PHOTO_GROUPS = ['friends', 'family'] as const
export type PhotoGroup = (typeof PHOTO_GROUPS)[number]
export type GroupFilter = 'all' | PhotoGroup

export type Photo = {
  /** Flat placeholder colour, always present; the image paints over it once loaded. */
  tone: string
  imageUrl?: string
  /** Original-size image for the expanded view, when imageUrl is a thumbnail. */
  fullUrl?: string
  name: string
  note: string
  group: PhotoGroup
}

export type { SceneId }
