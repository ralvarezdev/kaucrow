import { Chip } from '@/components/ui'
import { SCENE_IDS } from '@/features/scenes/ids'
import { SCENES } from '@/features/scenes/registry'
import { PROFILE_URL } from '../config'
import { useAlbum } from '../store'
import styles from './SceneSwitcher.module.css'

export function SceneSwitcher() {
  const scene = useAlbum((s) => s.scene)
  const setScene = useAlbum((s) => s.setScene)

  return (
    <nav className={styles.switcher} aria-label="Album view">
      {SCENE_IDS.map((id) => (
        <Chip key={id} selected={scene === id} onClick={() => setScene(id)}>
          {SCENES[id].label}
        </Chip>
      ))}
      <a className={styles.source} href={PROFILE_URL} target="_blank" rel="noopener noreferrer">
        @kaucrow on GitHub
      </a>
    </nav>
  )
}
