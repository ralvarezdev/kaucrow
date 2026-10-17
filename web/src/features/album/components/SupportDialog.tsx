import { useState } from 'react'
import { Button, Dialog } from '@/components/ui'
import { HONOUR, SUPPORT_HEADINGS, SUPPORT_LINKS, type SupportKind } from '../data/support'
import styles from './SupportDialog.module.css'

const KINDS: readonly SupportKind[] = ['donate', 'donor']

export function SupportDialog() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        className={styles.trigger}
        aria-label="Ways to help"
        onClick={() => setOpen(true)}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        <span className={styles.label}>Ways to help</span>
      </Button>
      <Dialog open={open} title="Ways to help" onClose={() => setOpen(false)}>
        <div className={styles.body}>
          {KINDS.map((kind) => (
            <section key={kind}>
              <h3 className={styles.heading}>{SUPPORT_HEADINGS[kind]}</h3>
              <ul className={styles.list}>
                {SUPPORT_LINKS.filter((l) => l.kind === kind).map((l) => (
                  <li key={l.url}>
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.link}
                    >
                      {l.name}
                    </a>
                    <p className={styles.description}>{l.description}</p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
          <section>
            <h3 className={styles.heading}>Honour him / Honra su memoria</h3>
            <ul className={styles.list}>
              {HONOUR.map((item) => (
                <li key={item.en}>
                  <p className={styles.text}>{item.en}</p>
                  <p className={styles.description} lang="es">
                    {item.es}
                  </p>
                </li>
              ))}
            </ul>
          </section>
          <div className={styles.actions}>
            <Button onClick={() => setOpen(false)}>Close</Button>
          </div>
        </div>
      </Dialog>
    </>
  )
}
