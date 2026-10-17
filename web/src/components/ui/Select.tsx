import type { KeyboardEvent } from 'react'
import { useEffect, useId, useRef, useState } from 'react'
import { cx } from '@/lib/cx'
import styles from './Select.module.css'

export type SelectOption<T extends string> = { value: T; label: string }

export type SelectProps<T extends string> = {
  /** Accessible name; the control itself shows the chosen option. */
  label: string
  options: readonly SelectOption<T>[]
  value: T
  onChange: (value: T) => void
  /** Which side of the control the list opens on. */
  placement?: 'top' | 'bottom'
  className?: string
}

/**
 * A select with a list drawn in the app's own style, following the ARIA
 * "select-only combobox" pattern: the trigger keeps focus, arrow keys move
 * through the options, Enter or Space picks, Esc closes, letters jump ahead.
 */
export function Select<T extends string>({
  label,
  options,
  value,
  onChange,
  placement = 'bottom',
  className,
}: SelectProps<T>) {
  const id = useId()
  const labelId = `${id}-label`
  const listId = `${id}-list`
  const optionId = (i: number) => `${id}-option-${i}`

  const root = useRef<HTMLDivElement>(null)
  const list = useRef<HTMLDivElement>(null)
  const selected = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  )
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(selected)

  const openList = () => {
    setActive(selected)
    setOpen(true)
  }

  const choose = (index: number) => {
    const option = options[index]
    if (option) onChange(option.value)
    setOpen(false)
  }

  // Close when the pointer goes down anywhere outside the control.
  useEffect(() => {
    if (!open) return
    const away = (e: PointerEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', away)
    return () => document.removeEventListener('pointerdown', away)
  }, [open])

  // Keep the highlighted option in view when the list scrolls.
  useEffect(() => {
    if (open) list.current?.children[active]?.scrollIntoView?.({ block: 'nearest' })
  }, [open, active])

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const last = options.length - 1
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault()
        openList()
      }
      return
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActive((a) => Math.min(last, a + 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActive((a) => Math.max(0, a - 1))
        break
      case 'Home':
        e.preventDefault()
        setActive(0)
        break
      case 'End':
        e.preventDefault()
        setActive(last)
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        choose(active)
        break
      case 'Escape':
        e.preventDefault()
        setOpen(false)
        break
      case 'Tab':
        setOpen(false)
        break
      default: {
        if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) break
        // Typeahead: the next option that starts with the typed letter.
        const key = e.key.toLowerCase()
        const from = [...options.keys()].map((i) => (active + 1 + i) % options.length)
        const hit = from.find((i) => options[i]?.label.toLowerCase().startsWith(key))
        if (hit !== undefined) setActive(hit)
      }
    }
  }

  return (
    <div ref={root} className={cx(styles.select, className)}>
      <span id={labelId} className="sr-only">
        {label}
      </span>
      <button
        type="button"
        role="combobox"
        className={styles.control}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={labelId}
        aria-activedescendant={open ? optionId(active) : undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
      >
        <span>{options[selected]?.label}</span>
        <svg
          className={cx(styles.chevron, open && styles.chevronOpen)}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        // Keyboard use stays on the trigger, so the list only needs the mouse and touch.
        <div
          ref={list}
          id={listId}
          role="listbox"
          aria-labelledby={labelId}
          className={cx(styles.list, placement === 'top' ? styles.top : styles.bottom)}
          // Keep focus on the trigger while the pointer works the list.
          onMouseDown={(e) => e.preventDefault()}
        >
          {options.map((o, i) => (
            // biome-ignore lint/a11y/useKeyWithClickEvents: options are driven from the trigger's key handler
            <div
              key={o.value}
              id={optionId(i)}
              role="option"
              tabIndex={-1}
              aria-selected={i === selected}
              className={cx(styles.option, i === active && styles.active)}
              onClick={() => choose(i)}
              onMouseMove={() => setActive(i)}
            >
              <span>{o.label}</span>
              {i === selected && (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12l5 5 9-10" />
                </svg>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
