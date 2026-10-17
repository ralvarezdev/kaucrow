import { useAlbum } from '@/features/album/store'

/**
 * What every photo scene needs from the album: the photos, which one hangs in
 * each slot, the focused photo, and the two ways to act on a click.
 */
export function useSceneAlbum() {
  const photos = useAlbum((s) => s.photos)
  const slots = useAlbum((s) => s.slots)
  const focused = useAlbum((s) => s.photos[s.focus])
  const pick = useAlbum((s) => s.pick)
  const expand = useAlbum((s) => s.expand)
  return { photos, slots, focused, pick, expand }
}
