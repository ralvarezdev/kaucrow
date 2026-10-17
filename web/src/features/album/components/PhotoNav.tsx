import { Button } from '@/components/ui'
import { SCENES } from '@/features/scenes/registry'
import { useAlbum } from '../store'
import styles from './PhotoNav.module.css'

const ICON = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const

/** Prev/next beside the focus frame. Only meaningful for scenes that tour their slots. */
export function PhotoNav() {
  const step = useAlbum((s) => s.step)
  const count = useAlbum((s) => SCENES[s.scene].slotCount)
  return (
    <>
      <Button
        variant="translucent"
        size="icon"
        aria-label="Previous photo"
        className={styles.prev}
        onClick={() => step(-1, count)}
      >
        <svg {...ICON}>
          <path d="M15 5l-7 7 7 7" />
        </svg>
      </Button>
      <Button
        variant="translucent"
        size="icon"
        aria-label="Next photo"
        className={styles.next}
        onClick={() => step(1, count)}
      >
        <svg {...ICON}>
          <path d="M9 5l7 7-7 7" />
        </svg>
      </Button>
    </>
  )
}
