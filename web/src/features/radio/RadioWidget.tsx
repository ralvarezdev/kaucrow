import { useState } from 'react'
import { Button } from '@/components/ui'
import styles from './RadioWidget.module.css'
import { usePanelOpen } from './usePanelOpen'

export const RADIO_URL = 'https://radio.kaucrow.dev'

/**
 * Javier's songs, played by the radio at radio.kaucrow.dev in an iframe.
 * The panel starts open on wide screens (and remembers if the visitor closed or
 * opened it), but the radio itself never plays on its own: browsers block it and
 * the visitor presses play. After the first open the frame stays mounted (just
 * hidden), so closing the panel does not cut the music.
 */
export function RadioWidget() {
  const { open, toggle } = usePanelOpen()
  // Mounted once opened and kept, so closing the panel does not cut the music.
  const [loaded, setLoaded] = useState(open)
  if (open && !loaded) setLoaded(true)

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
