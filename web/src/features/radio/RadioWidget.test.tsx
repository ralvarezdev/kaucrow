import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { RadioWidget } from './RadioWidget'
import { RADIO_OPEN_KEY } from './usePanelOpen'

function viewport(wide: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: wide,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }))
}

describe('RadioWidget', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('starts open on wide screens', () => {
    viewport(true)
    render(<RadioWidget />)
    expect(screen.getByRole('button', { name: 'Radio' })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByTitle(/radio/i)).toBeInTheDocument()
  })

  it('starts closed on narrow screens and loads nothing', () => {
    viewport(false)
    render(<RadioWidget />)
    expect(screen.getByRole('button', { name: 'Radio' })).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByTitle(/radio/i)).toBeNull()
  })

  it('remembers the visitor choice over the screen default', async () => {
    viewport(true)
    const { unmount } = render(<RadioWidget />)
    await userEvent.click(screen.getByRole('button', { name: 'Radio' }))
    expect(localStorage.getItem(RADIO_OPEN_KEY)).toBe('0')
    unmount()

    render(<RadioWidget />)
    expect(screen.getByRole('button', { name: 'Radio' })).toHaveAttribute('aria-expanded', 'false')
  })
})
