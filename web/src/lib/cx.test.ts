import { describe, expect, it } from 'vitest'
import { cx } from './cx'

describe('cx', () => {
  it('joins truthy parts and skips falsy ones', () => {
    expect(cx('a', false, 'b', null, undefined, 'c')).toBe('a b c')
  })

  it('returns an empty string when nothing is truthy', () => {
    expect(cx(false, null)).toBe('')
  })
})
