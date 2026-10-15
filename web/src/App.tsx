import { Suspense } from 'react'
import { Button } from '@/components/ui'
import {
  AddPhotoDialog,
  AlbumHeader,
  PhotoList,
  PhotoNav,
  SceneSwitcher,
  useAlbum,
} from '@/features/album'
import { SCENES } from '@/features/scenes/registry'
import styles from './App.module.css'

export function App() {
  const sceneId = useAlbum((s) => s.scene)
  const openAdd = useAlbum((s) => s.openAdd)
  const scene = SCENES[sceneId]

  return (
    <div className={styles.app} data-scene={sceneId}>
      <main className={styles.stage}>
        <Suspense fallback={<p className={styles.loading}>Hanging the photos…</p>}>
          <scene.Component />
        </Suspense>
      </main>

      <div className={styles.overlay}>
        <AlbumHeader />
        <Button variant="outline" className={styles.add} onClick={openAdd}>
          Add a photo
        </Button>
        {scene.hasTour && <PhotoNav />}
        <p className={styles.hint}>
          Move the mouse to look around · Click a photo to bring it closer
        </p>
        <SceneSwitcher />
      </div>

      <PhotoList count={scene.slotCount} />
      <AddPhotoDialog />
    </div>
  )
}
