import type { CSSProperties } from 'react'
import { useEffect, useRef, useState } from 'react'
import { Crow } from '@/components/Crow'
import { useMediaQuery } from '@/lib/useMediaQuery'
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion'
import { ALBUM } from '../config'
import { useAlbum } from '../store'
import styles from './AlbumHeader.module.css'
import { Phrase } from './Phrase'

/** Position in the entrance: each line arrives a beat after the one above it. */
const step = (k: number) => ({ '--k': k }) as CSSProperties

export function AlbumHeader() {
  const compact = useMediaQuery('(max-width: 640px), (max-height: 520px)')
  const reduced = usePrefersReducedMotion()

  // The crow caws each time the visitor moves to another scene.
  const scene = useAlbum((s) => s.scene)
  const lastScene = useRef(scene)
  const [caws, setCaws] = useState(0)
  useEffect(() => {
    if (lastScene.current === scene) return
    lastScene.current = scene
    if (!reduced) setCaws((n) => n + 1)
  }, [scene, reduced])

  return (
    <header className={styles.header}>
      <Crow
        size={compact ? 52 : 104}
        plate="none"
        label="The crow. Press to make it caw"
        className={styles.crow as string}
        cawSignal={caws}
      />
      <div className={styles.text}>
        <p className={styles.eyebrow} style={step(0)}>
          Remembering
        </p>
        <h1 className={styles.name} style={step(1)}>
          {ALBUM.name}
        </h1>
        <p className={styles.years} style={step(2)}>
          {ALBUM.years}
        </p>
        <div style={step(3)}>
          <Phrase />
        </div>
      </div>
    </header>
  )
}
