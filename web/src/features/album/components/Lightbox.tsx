import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui'
import { useAlbum } from '../store'
import styles from './Lightbox.module.css'

/** The expanded view: one photo at its own proportions, as large as the screen allows. */
export function Lightbox() {
  const photo = useAlbum((s) => s.expanded)
  const collapse = useAlbum((s) => s.collapse)
  const ref = useRef<HTMLDialogElement>(null)
  const src = photo?.fullUrl ?? photo?.imageUrl

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (photo && !dialog.open) dialog.showModal()
    if (!photo && dialog.open) dialog.close()
  }, [photo])

  return (
    // Backdrop click is a mouse shortcut; Esc and the Close button cover the keyboard.
    // biome-ignore lint/a11y/useKeyWithClickEvents: see above
    <dialog
      ref={ref}
      className={styles.lightbox}
      aria-label="Expanded photo"
      onClose={collapse}
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
      <Button variant="translucent" className={styles.close} onClick={collapse}>
        Close
      </Button>
    </dialog>
  )
}
