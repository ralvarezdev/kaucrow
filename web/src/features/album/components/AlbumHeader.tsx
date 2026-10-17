import { Crow } from '@/components/Crow'
import { useMediaQuery } from '@/lib/useMediaQuery'
import { ALBUM } from '../config'
import styles from './AlbumHeader.module.css'
import { Phrase } from './Phrase'

export function AlbumHeader() {
  const small = useMediaQuery('(max-width: 640px)')

  return (
    <header className={styles.header}>
      <Crow
        size={small ? 56 : 104}
        plate="none"
        label="The crow. Press to make it caw"
        className={styles.crow as string}
      />
      <div className={styles.text}>
        <p className={styles.eyebrow}>Remembering</p>
        <h1 className={styles.name}>{ALBUM.name}</h1>
        <p className={styles.years}>{ALBUM.years}</p>
        <Phrase />
      </div>
    </header>
  )
}
