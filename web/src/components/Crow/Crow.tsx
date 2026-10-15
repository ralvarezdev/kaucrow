import type { PointerEvent } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { cx } from '@/lib/cx'
import styles from './Crow.module.css'
import {
  BODY_ROWS,
  buildFrame,
  CAW_LAST_FRAME,
  FRAME_MS,
  OUTLINE_ROWS,
  rectsToPath,
  rowsToRects,
} from './pixels'

export type CrowPlate = 'square' | 'none'

export type CrowProps = {
  size?: number
  plate?: CrowPlate
  animate?: boolean
  /** Fixed gaze, -1..1, used until the pointer hovers the crow. */
  lookX?: number
  lookY?: number
  /** Accessible name; the crow is a button that makes him caw. */
  label?: string
  className?: string
}

const BODY_PATH = rectsToPath(rowsToRects(BODY_ROWS))
const OUTLINE_PATH = rectsToPath(rowsToRects(OUTLINE_ROWS))

export function Crow({
  size = 240,
  plate = 'square',
  animate = true,
  lookX = 0,
  lookY = 0,
  label = 'The crow. Press to make it caw',
  className,
}: CrowProps) {
  const [tick, setTick] = useState(0)
  const [caw, setCaw] = useState(-1)
  const [hover, setHover] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    if (!animate) return
    const id = setInterval(() => {
      setTick((t) => t + 1)
      setCaw((c) => (c < 0 ? -1 : c >= CAW_LAST_FRAME ? -1 : c + 1))
    }, FRAME_MS)
    return () => clearInterval(id)
  }, [animate])

  // Idle glance: drift left and right until the pointer takes over.
  const idle = useMemo(() => {
    const glance = [0, 0, 0, 1, 1, 0, 0, -1] as const
    return {
      x: (glance[Math.floor(tick / 16) % glance.length] ?? 0) * 0.9,
      y: 0,
    }
  }, [tick])

  const fixed = lookX !== 0 || lookY !== 0
  const look = hover ?? (animate && !fixed ? idle : { x: lookX, y: lookY })
  const frame = buildFrame({ tick, caw, animate, look })

  const onLook = (e: PointerEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    setHover({
      x: ((e.clientX - r.left) / r.width - 0.5) * 2,
      y: ((e.clientY - r.top) / r.height - 0.5) * 2,
    })
  }

  return (
    <button
      type="button"
      aria-label={label}
      className={cx(styles.crow, className)}
      style={{ width: size, height: size }}
      onClick={() => setCaw(0)}
      onPointerMove={onLook}
      onPointerLeave={() => setHover(null)}
    >
      <svg
        aria-hidden="true"
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
    </button>
  )
}
