import { HudButton } from '@/components/ui'
import { useAlbum } from '../store'

/** Opens the focused photo large; the same as clicking it on the canvas. */
export function ExpandButton() {
  const focused = useAlbum((s) => s.photos[s.focus])
  const expand = useAlbum((s) => s.expand)
  if (!focused) return null
  return (
    <HudButton row={1} onClick={() => expand(focused)}>
      Expand photo
    </HudButton>
  )
}
