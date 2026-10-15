import { Chip } from '@/components/ui'
import { useAlbum } from '../store'
import type { GroupFilter as Filter } from '../types'
import styles from './GroupFilter.module.css'

const OPTIONS: ReadonlyArray<{ id: Filter; label: string }> = [
  { id: 'all', label: 'Everyone' },
  { id: 'friends', label: 'Friends' },
  { id: 'family', label: 'Family' },
]

export function GroupFilter() {
  const filter = useAlbum((s) => s.filter)
  const setFilter = useAlbum((s) => s.setFilter)

  return (
    <fieldset className={styles.filter}>
      <legend className="sr-only">Show photos from</legend>
      {OPTIONS.map(({ id, label }) => (
        <Chip key={id} selected={filter === id} onClick={() => setFilter(id)}>
          {label}
        </Chip>
      ))}
    </fieldset>
  )
}
