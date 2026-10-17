import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { useAlbum } from '../store'
import { Lightbox } from './Lightbox'

// jsdom has no <dialog> behaviour; give it just enough to open and close.
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute('open', '')
  }
  HTMLDialogElement.prototype.close = function close() {
    this.removeAttribute('open')
    this.dispatchEvent(new Event('close'))
  }
})

const initial = useAlbum.getState()
beforeEach(() => useAlbum.setState(initial, true))

describe('Lightbox', () => {
  it('has arrows but no close button', () => {
    useAlbum.getState().expand(useAlbum.getState().photos[0] as never)
    render(<Lightbox />)
    expect(screen.getByRole('button', { name: 'Previous photo', hidden: true })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next photo', hidden: true })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /close/i, hidden: true })).toBeNull()
  })

  it('steps with the buttons and the arrow keys', async () => {
    const { photos, expand } = useAlbum.getState()
    expand(photos[0] as never)
    render(<Lightbox />)
    await userEvent.click(screen.getByRole('button', { name: 'Next photo', hidden: true }))
    expect(useAlbum.getState().expanded).toBe(photos[1])
    await userEvent.keyboard('{ArrowLeft}')
    expect(useAlbum.getState().expanded).toBe(photos[0])
  })

  it('closes on a click outside the photo but not on the photo', async () => {
    const { photos, expand } = useAlbum.getState()
    expand(photos[0] as never)
    const { container } = render(<Lightbox />)
    await userEvent.click(screen.getByRole('img', { hidden: true }))
    expect(useAlbum.getState().expanded).not.toBeNull()
    await userEvent.click(container.querySelector('dialog') as HTMLElement)
    expect(useAlbum.getState().expanded).toBeNull()
  })
})
