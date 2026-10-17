import { useEffect, useMemo, useState } from 'react'
import { phraseOrder } from '../data/phrases'
import styles from './Phrase.module.css'

const SHOW_MS = 9000

/** A short line under the name that changes every few seconds; still with reduced motion. */
export function Phrase() {
  const order = useMemo(() => phraseOrder(), [])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setIndex((i) => (i + 1) % order.length), SHOW_MS)
    return () => clearInterval(id)
  }, [order])

  // Keyed by index so each phrase restarts its fade in and out.
  return (
    <p key={index} className={styles.phrase} style={{ animationDuration: `${SHOW_MS}ms` }}>
      {order[index]}
    </p>
  )
}
