import { Crow } from '@/components/Crow'
import { Chip } from '@/components/ui'
import { SCENE_IDS } from '@/features/scenes/ids'
import { SCENES } from '@/features/scenes/registry'
import { useAlbum } from '../store'
import styles from './SceneSwitcher.module.css'

export function SceneSwitcher() {
  const scene = useAlbum((s) => s.scene)
  const setScene = useAlbum((s) => s.setScene)

  return (
    <nav className={styles.switcher} aria-label="Album view">
      <Crow size={40} plate="none" label="The crow. Press to make it caw" />
      {SCENE_IDS.map((id) => (
        <Chip key={id} selected={scene === id} onClick={() => setScene(id)}>
          {SCENES[id].label}
        </Chip>
      ))}
    </nav>
  )
}
