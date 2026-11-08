import type { Photo } from './types'

export const FAVORITES_KEY = 'kaucrow:favorites'

/** A photo is identified by its full-size image, so a Growing thumbnail and its album photo match. */
export function photoKey(photo: Photo): string | undefined {
  return photo.fullUrl ?? photo.imageUrl
}

/** The saved favourites, or none if storage is empty, blocked or holds something unexpected. */
export function loadFavorites(): string[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(FAVORITES_KEY) ?? '[]')
    return Array.isArray(parsed) ? parsed.filter((k): k is string => typeof k === 'string') : []
  } catch {
    return []
  }
}

export function saveFavorites(keys: readonly string[]) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(keys))
  } catch {
    // Not remembered, still works for this visit.
  }
}
