import { ALBUM } from '../config'
import styles from './AlbumHeader.module.css'
import { Phrase } from './Phrase'

export function AlbumHeader() {
  return (
    <header className={styles.header}>
      <p className={styles.eyebrow}>Remembering</p>
      <h1 className={styles.name}>{ALBUM.name}</h1>
      <p className={styles.years}>{ALBUM.years}</p>
      <Phrase />
    </header>
  )
}
