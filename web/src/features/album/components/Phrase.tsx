import { useEffect, useMemo, useState } from 'react'
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion'
import { phraseOrder } from '../data/phrases'
import styles from './Phrase.module.css'

const SHOW_MS = 9000

/** A short line under the name that changes every few seconds; still with reduced motion. */
export function Phrase() {
  const order = useMemo(() => phraseOrder(), [])
  const [index, setIndex] = useState(0)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced) return
    const id = setInterval(() => setIndex((i) => (i + 1) % order.length), SHOW_MS)
    return () => clearInterval(id)
  }, [order, reduced])

  // Keyed by index so each phrase restarts its fade in and out.
  return (
    <p key={index} className={styles.phrase} style={{ animationDuration: `${SHOW_MS}ms` }}>
      {order[index]}
    </p>
  )
}
