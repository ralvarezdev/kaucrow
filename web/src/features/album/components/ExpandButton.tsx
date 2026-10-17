import { Button } from '@/components/ui'
import { useAlbum } from '../store'
import styles from './ExpandButton.module.css'

/** Opens the focused photo large; the same as clicking it on the canvas. */
export function ExpandButton() {
  const focused = useAlbum((s) => s.photos[s.focus])
  const expand = useAlbum((s) => s.expand)
  if (!focused) return null
  return (
    <Button variant="ghost" className={styles.expand} onClick={() => expand(focused)}>
      Expand photo
    </Button>
  )
}
