import { describe, expect, it } from 'vitest'
import { shuffled } from './shuffle'

describe('shuffled', () => {
  it('keeps every item once and leaves the input alone', () => {
    const input = [1, 2, 3, 4, 5, 6]
    const out = shuffled(input)
    expect([...out].sort()).toEqual(input)
    expect(input).toEqual([1, 2, 3, 4, 5, 6])
  })

  it('is deterministic for a fixed random source', () => {
    expect(shuffled([1, 2, 3, 4], () => 0)).toEqual(shuffled([1, 2, 3, 4], () => 0))
    expect(shuffled([1, 2, 3, 4], () => 0)).toEqual([2, 3, 4, 1])
  })
})
