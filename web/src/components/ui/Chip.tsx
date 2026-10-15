import type { ComponentPropsWithoutRef } from 'react'
import { cx } from '@/lib/cx'
import styles from './Chip.module.css'

export type ChipProps = ComponentPropsWithoutRef<'button'> & {
  selected?: boolean
}

export function Chip({ selected = false, type = 'button', className, ...rest }: ChipProps) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      className={cx(styles.chip, selected && styles.selected, className)}
      {...rest}
    />
  )
}
