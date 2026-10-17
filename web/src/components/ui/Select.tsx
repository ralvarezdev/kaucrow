import { useId } from 'react'
import { cx } from '@/lib/cx'
import styles from './Select.module.css'

export type SelectOption<T extends string> = { value: T; label: string }

export type SelectProps<T extends string> = {
  /** Accessible name; the control itself shows the chosen option. */
  label: string
  options: readonly SelectOption<T>[]
  value: T
  onChange: (value: T) => void
  className?: string
}

/** A native <select> in the app's pill style: the OS handles the list, keyboard and touch. */
export function Select<T extends string>({
  label,
  options,
  value,
  onChange,
  className,
}: SelectProps<T>) {
  const id = useId()
  return (
    <div className={cx(styles.select, className)}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        className={styles.control}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <svg
        className={styles.chevron}
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
    </div>
  )
}
