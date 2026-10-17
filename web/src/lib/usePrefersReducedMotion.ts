import { useMediaQuery } from './useMediaQuery'

/** True when the visitor asked the system for less motion. */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}
