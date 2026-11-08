import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui'
import { cx } from '@/lib/cx'
import { useAlbum } from '../store'
import type { Photo } from '../types'
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
  const expandStep = useAlbum((s) => s.expandStep)
  const ref = useRef<HTMLDialogElement>(null)

  // The last photo stays on screen while the dialog fades out.
  const [last, setLast] = useState(photo)
  if (photo && photo !== last) setLast(photo)
  const shown = photo ?? last

  // Which way the visitor stepped, so the next photo slides in from that side.
  const [heading, setHeading] = useState<1 | -1 | 0>(0)
  const step = (delta: 1 | -1) => {
    setHeading(delta)
    expandStep(delta)
  }
  useEffect(() => {
    if (!photo) setHeading(0)
  }, [photo])

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
      {shown && (
        <figure
          key={shown.fullUrl ?? shown.imageUrl ?? shown.tone}
          className={cx(
            styles.figure,
            heading === 1 && styles.fromRight,
            heading === -1 && styles.fromLeft,
          )}
        >
          <Picture photo={shown} />
          {shown.note && <figcaption className={styles.caption}>{shown.note}</figcaption>}
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

/**
 * The photo, at its own proportions. While the full image loads, a blurred
 * preview (the thumbnail when there is one, else the photo's colour) holds the
 * place, and the image fades in over it.
 */
function Picture({ photo }: { photo: Photo }) {
  const src = photo.fullUrl ?? photo.imageUrl
  const [loaded, setLoaded] = useState(false)
  const image = useRef<HTMLImageElement>(null)

  // A cached image can finish before React is listening for it.
  useEffect(() => {
    if (image.current?.complete) setLoaded(true)
  }, [])

  if (!src) return <div className={styles.blank} style={{ background: photo.tone }} />

  const preview = photo.fullUrl ? photo.imageUrl : undefined
  return (
    <div className={styles.picture}>
      {!loaded &&
        (preview ? (
          <img className={cx(styles.image, styles.preview)} src={preview} alt="" />
        ) : (
          <div className={styles.blank} style={{ background: photo.tone }} />
        ))}
      <img
        ref={image}
        className={cx(styles.image, loaded ? styles.loaded : styles.loading)}
        src={src}
        alt={photo.note || `Photo of ${photo.name}`}
        onLoad={() => setLoaded(true)}
      />
    </div>
  )
}
