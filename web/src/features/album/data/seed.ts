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

const LETTERS = 'ABCDEFGHIJKLMNOPQR'

export const SEED_PHOTOS: Photo[] = TONES.map((tone, i) => ({
  tone,
  name: `[FRIEND ${LETTERS[i] ?? i}]`,
  note: '[A short note from the friend who added this photo]',
  group: 'friends',
  mine: false,
}))
