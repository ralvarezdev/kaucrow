import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button, Chip, Field } from '.'

describe('Button', () => {
  it('defaults to a solid, non-submitting button', () => {
    render(<Button>Save</Button>)
    const button = screen.getByRole('button', { name: 'Save' })
    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveClass('button', 'solid', 'md')
  })

  it('applies variant and size classes', () => {
    render(
      <Button variant="outline" size="icon" aria-label="Next">
        &gt;
      </Button>,
    )
    expect(screen.getByRole('button', { name: 'Next' })).toHaveClass('outline', 'icon')
  })

  it('fires onClick', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Go</Button>)
    await userEvent.click(screen.getByRole('button', { name: 'Go' }))
    expect(onClick).toHaveBeenCalledOnce()
  })
})

describe('Chip', () => {
  it('exposes its selected state to assistive tech', () => {
    render(<Chip selected>Friends</Chip>)
    expect(screen.getByRole('button', { name: 'Friends' })).toHaveAttribute('aria-pressed', 'true')
  })
})

describe('Field', () => {
  it('labels an input', () => {
    render(<Field label="Your name" />)
    expect(screen.getByLabelText('Your name').tagName).toBe('INPUT')
  })

  it('renders a textarea when multiline', () => {
    render(<Field label="Note" multiline />)
    expect(screen.getByLabelText('Note').tagName).toBe('TEXTAREA')
  })
})
