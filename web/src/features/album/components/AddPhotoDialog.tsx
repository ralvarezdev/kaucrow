import type { FormEvent } from 'react'
import { useRef, useState } from 'react'
import { Button, Dialog, Field } from '@/components/ui'
import { useAlbum } from '../store'
import styles from './AddPhotoDialog.module.css'

export function AddPhotoDialog() {
  const open = useAlbum((s) => s.adding)
  const closeAdd = useAlbum((s) => s.closeAdd)
  const addPhoto = useAlbum((s) => s.addPhoto)

  const formRef = useRef<HTMLFormElement>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined)

  const reset = () => {
    formRef.current?.reset()
    setFileName(null)
    setImageUrl(undefined)
  }

  const close = () => {
    reset()
    closeAdd()
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    addPhoto({
      name: String(data.get('name') ?? ''),
      note: String(data.get('note') ?? ''),
      ...(imageUrl ? { imageUrl } : {}),
    })
    reset()
  }

  return (
    <Dialog open={open} title="Add a photo of [NAME]" onClose={close}>
      <form ref={formRef} className={styles.form} onSubmit={onSubmit}>
        <label className={styles.drop}>
          {fileName ?? 'Choose a photo from your device'}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0]
              setFileName(file?.name ?? null)
              setImageUrl(file ? URL.createObjectURL(file) : undefined)
            }}
          />
        </label>
        <Field name="name" label="Your name" autoComplete="name" />
        <Field name="note" label="A short note" multiline />
        <div className={styles.actions}>
          <Button variant="ghost" onClick={close}>
            Cancel
          </Button>
          <Button type="submit">Add to the album</Button>
        </div>
      </form>
    </Dialog>
  )
}
