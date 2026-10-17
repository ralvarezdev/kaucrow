import type { ReactNode } from 'react'
import { useEffect, useId, useRef } from 'react'
import styles from './Dialog.module.css'

export type DialogProps = {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

/** Modal built on the native <dialog>: focus trap, Esc and backdrop come free. */
export function Dialog({ open, title, onClose, children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog ref={ref} className={styles.dialog} onClose={onClose} aria-labelledby={titleId}>
      <h2 id={titleId} className={styles.title}>
        {title}
      </h2>
      {children}
    </dialog>
  )
}
