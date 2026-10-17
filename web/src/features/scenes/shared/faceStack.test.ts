import { describe, expect, it } from 'vitest'
import type { Photo } from '@/features/album/types'
import { type Entry, newEntry, nextStack, visibility } from './faceStack'

const photo = (url: string): Photo => ({
  tone: '#000',
  imageUrl: url,
  name: '',
  note: '',
  group: 'friends',
})
const A = photo('/a.webp')
const B = photo('/b.webp')
const C = photo('/c.webp')
const loaded = (e: Entry): Entry => ({ ...e, loaded: true })

describe('nextStack', () => {
  it('keeps the same stack for the same photo', () => {
    const stack = [loaded(newEntry(A, true))]
    expect(nextStack(stack, A)).toEqual(stack)
  })

  it('puts the new photo over the one that is showing', () => {
    const stack = nextStack([newEntry(A, true)], B)
    expect(stack.map((e) => e.key)).toEqual(['/a.webp', '/b.webp'])
    expect(stack[1]?.first).toBe(false)
  })

  it('drops a face that never finished loading when another change arrives', () => {
    const afterB = nextStack([newEntry(A, true)], B)
    const afterC = nextStack(afterB, C)
    expect(afterC.map((e) => e.key)).toEqual(['/a.webp', '/c.webp'])
  })

  it('keeps a face that did load as the one to fade out of', () => {
    const afterB = nextStack([newEntry(A, true)], B).map((e) =>
      e.key === '/b.webp' ? loaded(e) : e,
    )
    expect(nextStack(afterB, C).map((e) => e.key)).toEqual(['/b.webp', '/c.webp'])
  })

  it('returns to a face that is still fading out without duplicating it', () => {
    const afterB = nextStack([newEntry(A, true)], B)
    expect(nextStack(afterB, A).map((e) => e.key)).toEqual(['/a.webp'])
  })
})

describe('visibility', () => {
  it('keeps the old face up until the new one has loaded', () => {
    const stack = nextStack([newEntry(A, true)], B)
    expect(visibility(stack)).toEqual([true, false])
  })

  it('swaps over once the new face has loaded', () => {
    const stack = nextStack([newEntry(A, true)], B).map((e) =>
      e.key === '/b.webp' ? loaded(e) : e,
    )
    expect(visibility(stack)).toEqual([false, true])
  })

  it('shows a lone face', () => {
    expect(visibility([newEntry(A, true)])).toEqual([true])
  })
})
