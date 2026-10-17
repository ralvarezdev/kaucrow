import { shuffled } from '@/lib/shuffle'
import type { Photo } from '../types'

const TONES = [
  '#7C8FB5',
  '#8E7FA8',
  '#A6B8A0',
  '#D9B8A8',
  '#7C8FB5',
  '#A6B8A0',
  '#C9A27A',
  '#8E7FA8',
  '#D9B8A8',
  '#C9A27A',
  '#7C8FB5',
  '#A6B8A0',
  '#D9B8A8',
  '#8E7FA8',
  '#C9A27A',
  '#7C8FB5',
  '#A6B8A0',
  '#C9A27A',
] as const

/** Files in public/photos, javier-0001.webp … javier-0048.webp. The two videos (0020, 0021) are not images. */
export const PHOTO_NUMBERS = Array.from({ length: 48 }, (_, i) => i + 1).filter(
  (n) => n !== 20 && n !== 21,
)

const name = (n: number) => `javier-${String(n).padStart(4, '0')}.webp`
export const photoUrl = (n: number) => `/photos/${name(n)}`
/** 480px copy, for the many small cards. */
export const thumbUrl = (n: number) => `/photos/thumb/${name(n)}`

/** The photo that opens the page, in the large focus frame: where he looks happiest. */
export const FEATURED_PHOTO = 4

// The store focuses the last photo, so the featured one goes last. The tone
// paints first, so each frame already has colour while its image loads.
export const SEED_PHOTOS: Photo[] = [
  ...shuffled(PHOTO_NUMBERS.filter((n) => n !== FEATURED_PHOTO)),
  FEATURED_PHOTO,
].map((n, i) => ({
  tone: TONES[i % TONES.length] as string,
  imageUrl: photoUrl(n),
  name: 'Javier',
  note: '',
  group: 'friends',
}))
