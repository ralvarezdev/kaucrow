import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui'
import { useAlbum } from '../store'
import styles from './Lightbox.module.css'

const ICON = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const

/**
 * The expanded view: one photo at its own proportions, as large as the screen
 * allows. A click outside the photo or Esc closes it; the arrows (or the arrow
 * keys) walk through the album.
 */
export function Lightbox() {
  const photo = useAlbum((s) => s.expanded)
  const collapse = useAlbum((s) => s.collapse)
  const step = useAlbum((s) => s.expandStep)
  const ref = useRef<HTMLDialogElement>(null)
  const src = photo?.fullUrl ?? photo?.imageUrl

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (photo && !dialog.open) {
      dialog.showModal()
      // Keep focus on the dialog, not on the first arrow, so no ring shows when it opens.
      dialog.focus()
    }
    if (!photo && dialog.open) dialog.close()
  }, [photo])

  return (
    <dialog
      ref={ref}
      className={styles.lightbox}
      aria-label="Expanded photo"
      tabIndex={-1}
      onClose={collapse}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') step(1)
        if (e.key === 'ArrowLeft') step(-1)
      }}
      // The dialog fills the screen, so a click that lands on the dialog itself is a click outside the photo.
      onClick={(e) => e.target === ref.current && collapse()}
    >
      {photo && (
        <figure className={styles.figure}>
          {src ? (
            <img className={styles.image} src={src} alt={photo.note || `Photo of ${photo.name}`} />
          ) : (
            <div className={styles.blank} style={{ background: photo.tone }} />
          )}
          {photo.note && <figcaption className={styles.caption}>{photo.note}</figcaption>}
        </figure>
      )}
      <Button
        variant="translucent"
        size="icon"
        className={styles.prev}
        aria-label="Previous photo"
        onClick={() => step(-1)}
      >
        <svg {...ICON}>
          <path d="M15 5l-7 7 7 7" />
        </svg>
      </Button>
      <Button
        variant="translucent"
        size="icon"
        className={styles.next}
        aria-label="Next photo"
        onClick={() => step(1)}
      >
        <svg {...ICON}>
          <path d="M9 5l7 7-7 7" />
        </svg>
      </Button>
    </dialog>
  )
}
