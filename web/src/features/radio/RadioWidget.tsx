import { useState } from 'react'
import { Button } from '@/components/ui'
import styles from './RadioWidget.module.css'

export const RADIO_URL = 'https://radio.kaucrow.dev'

/**
 * Javier's songs, played by the radio at radio.kaucrow.dev in an iframe.
 * Nothing loads until the visitor opens it, so it never plays on its own. After
 * the first open the frame stays mounted (just hidden), so closing the panel
 * does not cut the music.
 */
export function RadioWidget() {
  const [open, setOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)

  function toggle() {
    setOpen((o) => !o)
    setLoaded(true)
  }

  return (
    <aside className={styles.radio} aria-label="Radio">
      <div className={styles.panel} hidden={!open}>
        {loaded && (
          <iframe
            className={styles.frame}
            src={RADIO_URL}
            title="Radio: Javier's songs"
            allow="autoplay"
            sandbox="allow-scripts allow-same-origin"
            referrerPolicy="no-referrer"
          />
        )}
      </div>
      <Button
        variant="translucent"
        aria-expanded={open}
        onClick={toggle}
        className={styles.toggle as string}
      >
        Radio
      </Button>
    </aside>
  )
}
