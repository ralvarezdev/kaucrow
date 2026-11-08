import { Suspense, useCallback, useDeferredValue, useEffect, useState } from 'react'
import { Patrol } from '@/components/Ferris'
import { Splash } from '@/components/Splash'
import {
  AlbumHeader,
  GroupFilter,
  Lightbox,
  PhotoList,
  PhotoNav,
  SceneSwitcher,
  useAlbum,
  useRotation,
} from '@/features/album'
import { RadioWidget } from '@/features/radio/RadioWidget'
import { preloadScenes, SCENES } from '@/features/scenes/registry'
import { SceneStage } from '@/features/scenes/SceneStage'
import { BootContext } from '@/features/scenes/shared/MotionContext'
import { cx } from '@/lib/cx'
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion'
import styles from './App.module.css'

/** The sky takes about this long to light up, so the splash is never a flash. */
const SPLASH_MS = 1800

const FIRST_TOUCH = ['pointerdown', 'wheel', 'keydown'] as const

export function App() {
  const sceneId = useAlbum((s) => s.scene)
  // The previous scene stays up until the next one's code has arrived.
  const shownId = useDeferredValue(sceneId)
  const scene = SCENES[shownId]
  useRotation(scene.slotCount)

  const reduced = usePrefersReducedMotion()
  const [loaded, setLoaded] = useState(false)
  const [waited, setWaited] = useState(false)
  const booted = loaded && waited
  const onLoaded = useCallback(() => setLoaded(true), [])

  useEffect(() => {
    const id = setTimeout(() => setWaited(true), reduced ? 400 : SPLASH_MS)
    return () => clearTimeout(id)
  }, [reduced])

  // Once the first scene is up, fetch the others while the browser is idle.
  useEffect(() => {
    if (!booted) return
    const id = setTimeout(preloadScenes, 600)
    return () => clearTimeout(id)
  }, [booted])

  // The hint fades after the visitor's first move in each scene.
  const [hintGone, setHintGone] = useState(false)
  // biome-ignore lint/correctness/useExhaustiveDependencies: a new scene brings a new hint
  useEffect(() => {
    if (!booted) return
    setHintGone(false)
    const hide = () => setHintGone(true)
    for (const type of FIRST_TOUCH)
      window.addEventListener(type, hide, { once: true, passive: true })
    return () => {
      for (const type of FIRST_TOUCH) window.removeEventListener(type, hide)
    }
  }, [booted, shownId])

  return (
    <div className={styles.app} data-scene={shownId} data-booted={booted}>
      <main className={styles.stage}>
        <BootContext.Provider value={booted}>
          <Suspense fallback={null}>
            <SceneStage sceneId={shownId} onLoaded={onLoaded} />
          </Suspense>
        </BootContext.Provider>
      </main>

      <div className={styles.overlay}>
        <AlbumHeader />
        {scene.hasTour && <PhotoNav />}
        {scene.hasGroups && <GroupFilter />}
        <p className={cx(styles.hint, hintGone && styles.hintGone)}>{scene.hint}</p>
        <SceneSwitcher />
      </div>

      {/* After the overlay so the crab walks in front of the crow and the chips. */}
      <Patrol />

      <RadioWidget />

      <Lightbox />
      {scene.slotCount > 0 && <PhotoList count={scene.slotCount} />}

      <Splash leaving={booted} />
    </div>
  )
}
