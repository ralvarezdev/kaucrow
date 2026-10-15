import { Canvas } from '@react-three/fiber'
import type { ReactNode } from 'react'
import { fovFor } from './units'

export type SceneCanvasProps = {
  background: string
  /** Distance of the camera from the z=0 plane, in world units. */
  cameraZ: number
  children: ReactNode
}

export function SceneCanvas({ background, cameraZ, children }: SceneCanvasProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{
        position: [0, 0, cameraZ],
        fov: fovFor(cameraZ),
        near: 0.1,
        far: 500,
      }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <color attach="background" args={[background]} />
      {children}
    </Canvas>
  )
}
