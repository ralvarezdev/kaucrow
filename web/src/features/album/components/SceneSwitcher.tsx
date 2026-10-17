import { Select } from '@/components/ui'
import { SCENE_IDS, type SceneId } from '@/features/scenes/ids'
import { SCENES } from '@/features/scenes/registry'
import { PROFILE_URL } from '../config'
import { useAlbum } from '../store'
import styles from './SceneSwitcher.module.css'

const OPTIONS = SCENE_IDS.map((id) => ({ value: id, label: SCENES[id].label }))

export function SceneSwitcher() {
  const scene = useAlbum((s) => s.scene)
  const setScene = useAlbum((s) => s.setScene)

  return (
    <div className={styles.switcher}>
      <Select<SceneId> label="Album view" options={OPTIONS} value={scene} onChange={setScene} />
      <a className={styles.source} href={PROFILE_URL} target="_blank" rel="noopener noreferrer">
        @kaucrow on GitHub
      </a>
    </div>
  )
}
