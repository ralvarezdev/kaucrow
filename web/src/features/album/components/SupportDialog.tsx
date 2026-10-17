import { useState } from 'react'
import { Button, Dialog } from '@/components/ui'
import {
  DOMAIN_NOTE,
  HONOUR,
  SUPPORT_HEADINGS,
  SUPPORT_LINKS,
  type SupportKind,
} from '../data/support'
import styles from './SupportDialog.module.css'

const KINDS: readonly SupportKind[] = ['donate', 'donor']

export function SupportDialog() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant="ghost" className={styles.trigger} onClick={() => setOpen(true)}>
        Ways to help
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
          <p className={styles.note}>
            {DOMAIN_NOTE.en}
            <br />
            <span lang="es">{DOMAIN_NOTE.es}</span>
          </p>
          <div className={styles.actions}>
            <Button onClick={() => setOpen(false)}>Close</Button>
          </div>
        </div>
      </Dialog>
    </>
  )
}
