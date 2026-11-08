import { cx } from '@/lib/cx'
import { gridPaths } from '@/lib/gridPaths'
import { GRID, type Pixel, ROWS } from './pixels'
import styles from './ThinkPad.module.css'

export type ThinkPadProps = {
  /** Width in px. Use a multiple of 43 to keep every pixel crisp. */
  size?: number
  className?: string | undefined
}

const COLOR_CLASS: Record<Pixel, string> = {
  G: styles.edge as string,
  K: styles.plastic as string,
  S: styles.screen as string,
  B: styles.bar as string,
  C: styles.accent as string,
  A: styles.arch as string,
  W: styles.wordmark as string,
  R: styles.red as string,
  Y: styles.key as string,
  T: styles.pad as string,
}

const PATHS = gridPaths<Pixel>(ROWS)

/** An open ThinkPad running Arch, as pixel art. Decorative: hidden from assistive tech. */
export function ThinkPad({ size = 86, className }: ThinkPadProps) {
  return (
    <svg
      className={cx(styles.thinkpad, className)}
      viewBox={`0 0 ${GRID.width} ${GRID.height}`}
      width={size}
      height={(size * GRID.height) / GRID.width}
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      {(Object.keys(PATHS) as Pixel[]).map((c) => (
        <path key={c} className={COLOR_CLASS[c]} d={PATHS[c]} />
      ))}
    </svg>
  )
}
