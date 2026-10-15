import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'
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

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog ref={ref} className={styles.dialog} onClose={onClose} aria-labelledby="dialog-title">
      <h2 id="dialog-title" className={styles.title}>
        {title}
      </h2>
      {children}
    </dialog>
  )
}
