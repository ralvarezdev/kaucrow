import { useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { MathUtils } from 'three'

/**
 * Eases toward `target` every frame (frame-rate independent) and only
 * re-renders while a transition is in flight. Starts at `from`, or at
 * `target` so first paint never animates.
 */
export function useDamped(target: number, from: number = target, rate = 10): number {
  const [value, setValue] = useState(from)
  const current = useRef(from)

  useFrame((_, dt) => {
    if (current.current === target) return
    const next = MathUtils.damp(current.current, target, rate, dt)
    current.current = Math.abs(next - target) < 0.003 ? target : next
    setValue(current.current)
  })

  return value
}
