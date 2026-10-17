import type { CSSProperties } from 'react'
import { cx } from '@/lib/cx'
import { Button, type ButtonProps } from './Button'
import styles from './HudButton.module.css'

export type HudButtonProps = ButtonProps & {
  /** Which slot in the top-right stack, counted from 0 at the top. */
  row?: number
}

/**
 * A button that floats in the top-right corner of the stage. The overlay it sits in
 * ignores the mouse so clicks reach the canvas; this puts the mouse back on for the button.
 */
export function HudButton({ row = 0, className, style, ...rest }: HudButtonProps) {
  return (
    <Button
      variant="ghost"
      className={cx(styles.hud, className)}
      style={{ '--hud-row': row, ...style } as CSSProperties}
      {...rest}
    />
  )
}
