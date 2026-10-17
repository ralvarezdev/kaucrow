import { Ferris } from './Ferris'
import styles from './Patrol.module.css'

/** Ferris scuttles sideways along the bottom edge, stops to wave, then carries on. */
export function Patrol() {
  return (
    <div className={styles.lane} aria-hidden="true">
      <div className={styles.walker}>
        <Ferris size={96} />
      </div>
    </div>
  )
}
