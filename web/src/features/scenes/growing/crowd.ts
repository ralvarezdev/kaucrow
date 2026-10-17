import { SHOW_FAMILY } from '@/features/album/config'
import { PHOTO_NUMBERS, photoUrl, thumbUrl } from '@/features/album/data/seed'
import type { Photo, PhotoGroup } from '@/features/album/types'
import type { PxRect } from '../shared/units'

export type CrowdCard = {
  group: PhotoGroup
  rect: PxRect
  rotation: number
  photo: Photo
  /** 0 = far/faint, 1 = near/bright; drives opacity and blur. */
  depth: number
}

/** Where each group clusters, in stage px (centre) and spread (radii). */
export const CLUSTERS: Record<PhotoGroup, { cx: number; cy: number; rx: number; ry: number }> = {
  friends: { cx: 400, cy: 440, rx: 340, ry: 240 },
  family: { cx: 930, cy: 430, rx: 240, ry: 210 },
}

const COOL = ['#7C8FB5', '#8E7FA8', '#A6B8A0', '#D9B8A8', '#C9A27A']
const WARM = ['#E3B77C', '#D9A28A', '#EBCB8B', '#C98B7B', '#D4A373']

/** Small deterministic PRNG so the crowd looks the same on every load. */
export function mulberry32(seed: number): () => number {
  let s = seed
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Every card gets one of the album's photos, in a fixed order so the crowd is the same on every load. */
const cardPhoto = (tone: string, group: PhotoGroup, index: number): Photo => {
  const n = PHOTO_NUMBERS[index % PHOTO_NUMBERS.length] as number
  return {
    tone,
    imageUrl: thumbUrl(n),
    fullUrl: photoUrl(n),
    name: 'Javier',
    note: '',
    group,
  }
}

/** A card of random size and tilt centred on (x, y); depth follows size, so bigger cards read as nearer. */
function makeCard(
  rnd: () => number,
  group: PhotoGroup,
  x: number,
  y: number,
  tones: readonly string[],
  photoIndex: number,
): CrowdCard {
  const width = 20 + rnd() * 30
  const height = width * (0.75 + rnd() * 0.5)
  const rotation = (rnd() - 0.5) * 16
  const tone = tones[Math.floor(rnd() * tones.length)] as string
  return {
    group,
    rect: {
      x: Math.round(x - width / 2),
      y: Math.round(y),
      width: Math.round(width),
      height: Math.round(height),
    },
    rotation: Math.round(rotation),
    photo: cardPhoto(tone, group, photoIndex),
    depth: (width - 20) / 30,
  }
}

function scatter(
  rnd: () => number,
  group: PhotoGroup,
  count: number,
  tones: readonly string[],
  firstPhoto: number,
  cluster = CLUSTERS[group],
): CrowdCard[] {
  const { cx, cy, rx, ry } = cluster
  const cards: CrowdCard[] = []
  let guard = 0

  while (cards.length < count && guard++ < 4000) {
    const angle = rnd() * Math.PI * 2
    const radius = Math.sqrt(rnd())
    const x = cx + Math.cos(angle) * radius * rx
    const y = cy + Math.sin(angle) * radius * ry
    // Keep clear of the header and the top-right controls.
    if (y < 120 || y > 690) continue
    if (x < 560 && y < 230) continue
    if (x > 1080 && y < 120) continue

    cards.push(makeCard(rnd, group, x, y, tones, firstPhoto + cards.length))
  }
  return cards
}

/** The infinity symbol the friends form: a lemniscate of Bernoulli, stretched a little taller. */
export const INFINITY = { cx: 640, cy: 430, a: 480, yStretch: 1.1 } as const

/** Point on the infinity curve for t in [0, 2π), with the unit-speed-ish tangent for spreading cards across it. */
export function infinityPoint(t: number): { x: number; y: number; nx: number; ny: number } {
  const { cx, cy, a, yStretch } = INFINITY
  const d = 1 + Math.sin(t) ** 2
  const x = (a * Math.cos(t)) / d
  const y = (yStretch * a * Math.sin(t) * Math.cos(t)) / d
  // Numerical tangent, rotated 90° into a normal.
  const e = 0.001
  const d2 = 1 + Math.sin(t + e) ** 2
  const dx = (a * Math.cos(t + e)) / d2 - x
  const dy = (yStretch * a * Math.sin(t + e) * Math.cos(t + e)) / d2 - y
  const len = Math.hypot(dx, dy) || 1
  return { x: cx + x, y: cy + y, nx: -dy / len, ny: dx / len }
}

/** Cards laid along the infinity curve in a loose ribbon, so the symbol reads from far and the crowd up close. */
function infinityRibbon(
  rnd: () => number,
  group: PhotoGroup,
  count: number,
  tones: readonly string[],
  firstPhoto: number,
): CrowdCard[] {
  const spread = 26
  return Array.from({ length: count }, (_, i) => {
    const t = ((i + rnd() * 0.8) / count) * Math.PI * 2
    const p = infinityPoint(t)
    const offset = (rnd() + rnd() - 1) * spread
    return makeCard(rnd, group, p.x + p.nx * offset, p.y + p.ny * offset, tones, firstPhoto + i)
  })
}

/** The faint crowd of 72 friends and 30 family from the mockup; with family hidden, 102 friends forming an infinity symbol. */
export function generateCrowd(seed = 20241015, showFamily = SHOW_FAMILY): CrowdCard[] {
  const rnd = mulberry32(seed)
  if (!showFamily) return infinityRibbon(rnd, 'friends', 102, COOL, 0)
  return [...scatter(rnd, 'friends', 72, COOL, 0), ...scatter(rnd, 'family', 30, WARM, 72)]
}

/** Card opacity: nearer is brighter; non-matching groups almost disappear. */
export function cardOpacity(card: CrowdCard, matches: boolean): number {
  if (!matches) return 0.08
  return 0.4 + 0.5 * card.depth
}

/** Only the farthest cards are blurred. */
export const isBlurred = (card: CrowdCard) => card.depth < 0.25
