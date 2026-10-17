import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Select } from './Select'

const OPTIONS = [
  { value: 'sky', label: 'Night sky' },
  { value: 'gallery', label: 'Gallery' },
  { value: 'table', label: 'Table' },
] as const

type Id = (typeof OPTIONS)[number]['value']

function Harness({ onChange = () => {} }: { onChange?: (v: Id) => void }) {
  const [value, setValue] = useState<Id>('sky')
  return (
    <Select<Id>
      label="View"
      options={OPTIONS}
      value={value}
      onChange={(v) => {
        setValue(v)
        onChange(v)
      }}
    />
  )
}

const trigger = () => screen.getByRole('combobox', { name: 'View' })

describe('Select', () => {
  it('shows the chosen option and keeps the list closed', () => {
    render(<Harness />)
    expect(trigger()).toHaveTextContent('Night sky')
    expect(trigger()).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  it('opens on click and picks an option with the mouse', async () => {
    const onChange = vi.fn()
    render(<Harness onChange={onChange} />)
    await userEvent.click(trigger())
    expect(screen.getAllByRole('option')).toHaveLength(3)
    expect(screen.getByRole('option', { name: 'Night sky' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    await userEvent.click(screen.getByRole('option', { name: 'Gallery' }))
    expect(onChange).toHaveBeenCalledWith('gallery')
    expect(trigger()).toHaveTextContent('Gallery')
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  it('works from the keyboard: arrows move, Enter picks, Esc closes', async () => {
    const onChange = vi.fn()
    render(<Harness onChange={onChange} />)
    trigger().focus()
    await userEvent.keyboard('{ArrowDown}')
    expect(trigger()).toHaveAttribute('aria-expanded', 'true')
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}')
    // Clamped at the last option.
    await userEvent.keyboard('{Enter}')
    expect(onChange).toHaveBeenCalledWith('table')

    await userEvent.keyboard('{ArrowDown}')
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('listbox')).toBeNull()
    expect(onChange).toHaveBeenCalledOnce()
  })

  it('jumps to an option by its first letter', async () => {
    const onChange = vi.fn()
    render(<Harness onChange={onChange} />)
    trigger().focus()
    await userEvent.keyboard('{Enter}t{Enter}')
    expect(onChange).toHaveBeenCalledWith('table')
  })

  it('closes when the pointer goes down outside', async () => {
    render(
      <>
        <Harness />
        <button type="button">elsewhere</button>
      </>,
    )
    await userEvent.click(trigger())
    await userEvent.click(screen.getByRole('button', { name: 'elsewhere' }))
    expect(screen.queryByRole('listbox')).toBeNull()
  })
})
