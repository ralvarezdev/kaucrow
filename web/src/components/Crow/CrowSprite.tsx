import { cx } from '@/lib/cx'
import styles from './CrowSprite.module.css'
import {
  BODY_ROWS,
  buildFrame,
  type CrowFrame,
  OUTLINE_ROWS,
  rectsToPath,
  rowsToRects,
} from './pixels'

export type CrowPlate = 'square' | 'none'

export type CrowSpriteProps = {
  /** Width and height in px. Use a multiple of 48 to keep every pixel crisp. */
  size?: number
  /** `square` sits the crow on the cream tile of the logo. */
  plate?: CrowPlate
  /** One animation frame, as built by `buildFrame`. Defaults to the crow standing still. */
  frame?: CrowFrame
  className?: string | undefined
}

const BODY_PATH = rectsToPath(rowsToRects(BODY_ROWS))
const OUTLINE_PATH = rectsToPath(rowsToRects(OUTLINE_ROWS))
const STILL = buildFrame({ tick: 0, caw: -1, animate: false, look: { x: 0, y: 0 } })

/**
 * The crow as pixel art, and nothing else: no state, no events, no layout. `Crow` wraps it in a button and
 * animates it; use this directly wherever a plain picture of him will do. Decorative: hidden from assistive tech.
 */
export function CrowSprite({
  size = 240,
  plate = 'square',
  frame = STILL,
  className,
}: CrowSpriteProps) {
  return (
    <svg
      className={cx(styles.sprite, className)}
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 48 48"
      shapeRendering="crispEdges"
    >
      {plate === 'square' && <rect width="48" height="48" className={styles.cream} />}
      <g transform={`translate(0 ${frame.hop})`}>
        <path d={BODY_PATH} className={styles.cream} />
        <path d={OUTLINE_PATH} className={styles.ink} />
        <path d={rectsToPath(frame.cream)} className={styles.cream} />
        <path d={rectsToPath(frame.ink)} className={styles.ink} />
      </g>
    </svg>
  )
}
