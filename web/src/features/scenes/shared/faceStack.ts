import type { Photo } from '@/features/album/types'

/** One photo face in a frame. Several can overlap briefly while one replaces another. */
export type Entry = {
  key: string
  photo: Photo
  /** The first face a frame ever shows appears at once, in its tone while the image loads. */
  first: boolean
  /** The image has been fetched and decoded, so it can fade in without a blank flash. */
  loaded: boolean
}

export const faceKey = (p: Photo) => p.imageUrl ?? p.tone

export const newEntry = (photo: Photo, first: boolean): Entry => ({
  key: faceKey(photo),
  photo,
  first,
  loaded: !photo.imageUrl,
})

const showing = (e: Entry) => e.first || e.loaded

/**
 * The stack after `photo` becomes the frame's photo. The newest face that is
 * already visible stays underneath to fade out of; faces that never finished
 * loading are dropped, so a quick run of changes never leaves a blank frame.
 */
export function nextStack(stack: readonly Entry[], photo: Photo): Entry[] {
  const key = faceKey(photo)
  const top = stack[stack.length - 1]
  if (top?.key === key) return [...stack]
  const under = [...stack].reverse().find(showing) ?? top
  if (!under) return [newEntry(photo, true)]
  // Going back to the face that is still fading out: it simply becomes the top again.
  if (under.key === key) return [under]
  return [under, newEntry(photo, false)]
}

/** Per entry: whether it should be fading in (true) or out (false). */
export function visibility(stack: readonly Entry[]): boolean[] {
  const top = stack[stack.length - 1]
  const topShowing = top ? showing(top) : true
  return stack.map((e, i) => (i === stack.length - 1 ? showing(e) : !topShowing))
}
