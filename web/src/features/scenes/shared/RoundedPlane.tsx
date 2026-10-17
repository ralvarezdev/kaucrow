import type { ThreeElements } from '@react-three/fiber'
import { useEffect, useMemo } from 'react'
import { roundedRectGeometry } from './roundedRect'

type RoundedPlaneProps = Omit<ThreeElements['mesh'], 'geometry' | 'args'> & {
  /** World units. */
  width: number
  height: number
  radius: number
}

/** A flat mesh with rounded corners; put a material inside it, as with any <mesh>. */
export function RoundedPlane({ width, height, radius, children, ...mesh }: RoundedPlaneProps) {
  const geometry = useMemo(
    () => roundedRectGeometry(width, height, radius),
    [width, height, radius],
  )
  useEffect(() => () => geometry.dispose(), [geometry])
  return (
    <mesh geometry={geometry} {...mesh}>
      {children}
    </mesh>
  )
}
