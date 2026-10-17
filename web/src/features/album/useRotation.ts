import { useEffect } from 'react'
import { useAlbum } from './store'

const INTERVAL_MS = 5000

/**
 * Every few seconds one of the shown photos is swapped for one that is waiting
 * out of sight, so a scene doesn't settle on the same few. Paused while the tab
 * is hidden and off with reduced motion.
 */
export function useRotation(count: number) {
  const cycle = useAlbum((s) => s.cycle)

  useEffect(() => {
    if (count <= 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => {
      if (!document.hidden) cycle(count)
    }, INTERVAL_MS)
    return () => clearInterval(id)
  }, [count, cycle])
}
