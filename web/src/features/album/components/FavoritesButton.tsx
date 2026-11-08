import { Button } from '@/components/ui'
import { useAlbum } from '../store'

/** Opens the expanded view on the starred photos. Hidden until there is at least one. */
export function FavoritesButton() {
  const count = useAlbum((s) => s.favorites.length)
  const open = useAlbum((s) => s.expandFavorites)
  if (count === 0) return null

  return (
    <Button variant="outline" aria-label={`Favorite photos (${count})`} onClick={open}>
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 3l2.7 5.8 6.3.8-4.6 4.4 1.2 6.3L12 17.2 6.4 20.3l1.2-6.3L3 9.6l6.3-.8z" />
      </svg>
      {count}
    </Button>
  )
}
