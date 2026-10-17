import { useAlbum } from '../store'

/**
 * Canvas objects aren't focusable, so mirror the visible slots as real buttons
 * for keyboard and screen-reader users.
 */
export function PhotoList({ count }: { count: number }) {
  const slots = useAlbum((s) => s.slots)
  const photos = useAlbum((s) => s.photos)
  const pick = useAlbum((s) => s.pick)
  const expand = useAlbum((s) => s.expand)
  const focused = useAlbum((s) => s.photos[s.focus])

  return (
    <ul className="sr-only">
      {focused && (
        <li>
          <button type="button" onClick={() => expand(focused)}>
            Expand the focused photo
          </button>
        </li>
      )}
      {slots.slice(0, count).map((photoIndex, i) => (
        <li key={i}>
          <button type="button" onClick={() => pick(i)}>
            View photo {i + 1}
            {photos[photoIndex] ? ` by ${photos[photoIndex].name}` : ''}
          </button>
        </li>
      ))}
    </ul>
  )
}
