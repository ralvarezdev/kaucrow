import { cx } from '@/lib/cx'
import { gridPaths } from '@/lib/gridPaths'
import styles from './Arch.module.css'
import { GRID, ROWS } from './pixels'

export type ArchProps = {
  /** Width and height in px. Use a multiple of 9 to keep every pixel crisp. */
  size?: number
  className?: string | undefined
}

const PATH = gridPaths<'A'>(ROWS).A

/** The Arch Linux logo as pixel art. Decorative: hidden from assistive tech. */
export function Arch({ size = 36, className }: ArchProps) {
  return (
    <svg
      className={cx(styles.arch, className)}
      viewBox={`0 0 ${GRID.width} ${GRID.height}`}
      width={size}
      height={size}
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      <path className={styles.logo} d={PATH} />
    </svg>
  )
}
