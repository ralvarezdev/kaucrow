import { type CSSProperties, useEffect, useState } from 'react'
import { Crow } from '@/components/Crow'
import { cx } from '@/lib/cx'
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion'
import styles from './Splash.module.css'

/** Small seeded generator, so the sky is the same on every visit. */
function seeded(seed: number) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const STARS = (() => {
  const next = seeded(3)
  return Array.from({ length: 56 }, (_, k) => {
    const size = next() * 2 + 1
    return {
      left: `${next() * 100}%`,
      top: `${next() * 100}%`,
      width: size,
      height: size,
      '--k': k,
      '--d': `${3 + next() * 4}s`,
    } as CSSProperties
  })
})()

/** How long the splash is removed after it starts fading, matching its CSS transition. */
const FADE_MS = 700

/**
 * The first thing a visitor sees: the night sky lights up one star at a time
 * while the first scene loads. `leaving` fades it out over the scene.
 */
export function Splash({ leaving }: { leaving: boolean }) {
  const [gone, setGone] = useState(false)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (!leaving) return
    const id = setTimeout(() => setGone(true), FADE_MS)
    return () => clearTimeout(id)
  }, [leaving])

  if (gone) return null
  return (
    <div className={cx(styles.splash, leaving && styles.leaving)} role="status">
      <div aria-hidden="true" inert>
        {STARS.map((style, k) => (
          // The stars never change, so the index is a stable key.
          <i key={k} className={styles.star} style={style} />
        ))}
        <div className={styles.crow}>
          <Crow size={96} plate="none" animate={!reduced} />
        </div>
      </div>
      <p className={styles.text}>Hanging the photos…</p>
    </div>
  )
}
