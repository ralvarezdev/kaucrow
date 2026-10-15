import { Suspense } from 'react'
import { Button } from '@/components/ui'
import {
  AddPhotoDialog,
  AlbumHeader,
  GroupFilter,
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
        {scene.hasGroups && <GroupFilter />}
        <p className={styles.hint}>{scene.hint}</p>
        <SceneSwitcher />
      </div>

      {scene.slotCount > 0 && <PhotoList count={scene.slotCount} />}
      <AddPhotoDialog />
    </div>
  )
}
