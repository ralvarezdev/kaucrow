import { Suspense } from 'react'
import { Patrol } from '@/components/Ferris'
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
import { SCENES } from '@/features/scenes/registry'
import styles from './App.module.css'

export function App() {
  const sceneId = useAlbum((s) => s.scene)
  const scene = SCENES[sceneId]
  useRotation(scene.slotCount)

  return (
    <div className={styles.app} data-scene={sceneId}>
      <main className={styles.stage}>
        <Suspense fallback={<p className={styles.loading}>Hanging the photos…</p>}>
          <scene.Component />
        </Suspense>
      </main>

      <div className={styles.overlay}>
        <AlbumHeader />
        {scene.hasTour && <PhotoNav />}
        {scene.hasGroups && <GroupFilter />}
        <p className={styles.hint}>{scene.hint}</p>
        <SceneSwitcher />
      </div>

      {/* After the overlay so the crab walks in front of the crow and the chips. */}
      <Patrol />

      <Lightbox />
      {scene.slotCount > 0 && <PhotoList count={scene.slotCount} />}
    </div>
  )
}
