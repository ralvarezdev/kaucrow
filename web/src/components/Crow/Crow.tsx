import type { PointerEvent } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { cx } from '@/lib/cx'
import styles from './Crow.module.css'
import { type CrowPlate, CrowSprite } from './CrowSprite'
import { buildFrame, CAW_LAST_FRAME, FRAME_MS } from './pixels'

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
  /** Caws once each time this number goes up; the crow's way of reacting to what happens on the page. */
  cawSignal?: number
}

export function Crow({
  size = 240,
  plate = 'square',
  animate = true,
  lookX = 0,
  lookY = 0,
  label = 'The crow. Press to make it caw',
  className,
  cawSignal = 0,
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

  useEffect(() => {
    if (cawSignal > 0) setCaw(0)
  }, [cawSignal])

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
      <CrowSprite size={size} plate={plate} frame={frame} />
    </button>
  )
}
