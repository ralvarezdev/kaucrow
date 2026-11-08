import { useCallback, useState } from 'react'

export const RADIO_OPEN_KEY = 'kaucrow:radio-open'

/** Below this the panel would cover the scene, so it starts closed unless the visitor opened it before. */
const WIDE = '(min-width: 900px) and (min-height: 521px)'

function read(): boolean {
  try {
    const saved = localStorage.getItem(RADIO_OPEN_KEY)
    if (saved !== null) return saved === '1'
  } catch {
    // Storage can be blocked (private mode): fall back to the default.
  }
  return window.matchMedia(WIDE).matches
}

/** Whether the radio panel is open: open by default on wide screens, and remembered across visits. */
export function usePanelOpen() {
  const [open, setOpen] = useState(read)

  const toggle = useCallback(() => {
    setOpen((o) => {
      try {
        localStorage.setItem(RADIO_OPEN_KEY, o ? '0' : '1')
      } catch {
        // Not remembered, still works for this visit.
      }
      return !o
    })
  }, [])

  return { open, toggle }
}
