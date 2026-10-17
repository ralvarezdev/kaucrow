import { describe, expect, it } from 'vitest'
import { OPENING_PHRASE, PHRASES, phraseOrder } from './phrases'

describe('phrases', () => {
  it('has no blank or repeated phrase', () => {
    expect(PHRASES.every((p) => p.trim().length > 0)).toBe(true)
    expect(new Set(PHRASES).size).toBe(PHRASES.length)
  })

  it('starts with the opening phrase and keeps every phrase once', () => {
    const order = phraseOrder()
    expect(order[0]).toBe(OPENING_PHRASE)
    expect([...order].sort()).toEqual([...PHRASES].sort())
  })
})
