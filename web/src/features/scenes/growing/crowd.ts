import type { Photo, PhotoGroup } from '@/features/album/types'
import type { PxRect } from '../shared/units'

export type CrowdCard = {
  group: PhotoGroup
  rect: PxRect
  rotation: number
  photo: Photo
  /** 0 = far/faint, 1 = near/bright; drives opacity and blur. */
  depth: number
  fresh: boolean
}

/** Where each group clusters, in stage px (centre) and spread (radii). */
export const CLUSTERS: Record<PhotoGroup, { cx: number; cy: number; rx: number; ry: number }> = {
  friends: { cx: 400, cy: 440, rx: 340, ry: 240 },
  family: { cx: 930, cy: 430, rx: 240, ry: 210 },
}

const COOL = ['#7C8FB5', '#8E7FA8', '#A6B8A0', '#D9B8A8', '#C9A27A']
const WARM = ['#E3B77C', '#D9A28A', '#EBCB8B', '#C98B7B', '#D4A373']
export const NEW_CARD_TONE = '#EBC77D'

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

const tonePhoto = (tone: string, group: PhotoGroup): Photo => ({
  tone,
  name: '',
  note: '',
  group,
  mine: false,
})

function scatter(
  rnd: () => number,
  group: PhotoGroup,
  count: number,
  tones: readonly string[],
): CrowdCard[] {
  const { cx, cy, rx, ry } = CLUSTERS[group]
  const cards: CrowdCard[] = []
  let guard = 0

  while (cards.length < count && guard++ < 4000) {
    const angle = rnd() * Math.PI * 2
    const radius = Math.sqrt(rnd())
    const x = cx + Math.cos(angle) * radius * rx
    const y = cy + Math.sin(angle) * radius * ry
    // Keep clear of the header and the top-right controls.
    if (y < 120 || y > 690) continue
    if (x < 460 && y < 200) continue
    if (x > 1080 && y < 120) continue

    const width = 20 + rnd() * 30
    const height = width * (0.75 + rnd() * 0.5)
    const rotation = (rnd() - 0.5) * 16
    const tone = tones[Math.floor(rnd() * tones.length)] ?? NEW_CARD_TONE

    cards.push({
      group,
      rect: {
        x: Math.round(x - width / 2),
        y: Math.round(y),
        width: Math.round(width),
        height: Math.round(height),
      },
      rotation: Math.round(rotation),
      photo: tonePhoto(tone, group),
      depth: (width - 20) / 30,
      fresh: false,
    })
  }
  return cards
}

/** The faint crowd of 72 friends and 30 family from the mockup. */
export function generateCrowd(seed = 20241015): CrowdCard[] {
  const rnd = mulberry32(seed)
  return [...scatter(rnd, 'friends', 72, COOL), ...scatter(rnd, 'family', 30, WARM)]
}

/** Where a photo added this session lands: near its group's cluster centre. */
export function placeNewCard(photo: Photo, index: number): CrowdCard {
  const rnd = mulberry32(7919 + index * 104729)
  const { cx, cy } = CLUSTERS[photo.group]
  return {
    group: photo.group,
    rect: {
      x: cx + Math.round((rnd() - 0.5) * 120),
      y: cy + Math.round((rnd() - 0.5) * 100),
      width: 56,
      height: 44,
    },
    rotation: -3,
    photo,
    depth: 1,
    fresh: true,
  }
}

/** Card opacity: nearer is brighter; non-matching groups almost disappear. */
export function cardOpacity(card: CrowdCard, matches: boolean): number {
  if (!matches) return 0.08
  return card.fresh ? 1 : 0.4 + 0.5 * card.depth
}

/** Only the farthest, non-fresh cards are blurred. */
export const isBlurred = (card: CrowdCard) => !card.fresh && card.depth < 0.25
