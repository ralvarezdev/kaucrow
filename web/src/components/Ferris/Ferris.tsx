import { cx } from '@/lib/cx'
import styles from './Ferris.module.css'
import { GRID, LAYERS, layerPaths, type Pixel } from './pixels'

export type FerrisProps = {
  /** Width in px. Use a multiple of 48 to keep every pixel crisp. */
  size?: number
  className?: string
}

const COLOR_CLASS: Record<Pixel, string> = {
  O: styles.edge as string,
  B: styles.shell as string,
  E: styles.eye as string,
  W: styles.white as string,
}

const PATHS = {
  body: layerPaths(LAYERS.BODY),
  legsA: layerPaths(LAYERS.LEGS_A),
  legsB: layerPaths(LAYERS.LEGS_B),
  rest: layerPaths(LAYERS.CLAWS_REST),
  up: layerPaths(LAYERS.CLAWS_UP),
}

function Layer({
  paths,
  className,
}: {
  paths: Partial<Record<Pixel, string>>
  className?: string | undefined
}) {
  return (
    <g className={className}>
      {(Object.keys(paths) as Pixel[]).map((c) => (
        <path key={c} className={COLOR_CLASS[c]} d={paths[c]} />
      ))}
    </g>
  )
}

/**
 * Rust's crab as pixel art, after the official artwork. Decorative: hidden from assistive tech, no pointer
 * events. The artwork is public domain (CC0).
 */
export function Ferris({ size = 96, className }: FerrisProps) {
  return (
    <svg
      className={cx(styles.ferris, className)}
      viewBox={`0 0 ${GRID.width} ${GRID.height}`}
      width={size}
      height={(size * GRID.height) / GRID.width}
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      <g className={styles.legsMoving}>
        <Layer paths={PATHS.legsA} className={styles.legsA} />
        <Layer paths={PATHS.legsB} className={styles.legsB} />
      </g>
      <Layer paths={PATHS.legsB} className={styles.legsStill} />
      <Layer paths={PATHS.body} />
      <Layer paths={PATHS.rest} className={styles.clawsRest} />
      <Layer paths={PATHS.up} className={styles.clawsUp} />
    </svg>
  )
}
