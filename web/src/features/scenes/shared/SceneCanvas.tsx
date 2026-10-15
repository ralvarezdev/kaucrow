import { Canvas, useThree } from '@react-three/fiber'
import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { fitDistance, fovFor } from './units'

export type SceneCanvasProps = {
  background: string
  /** Distance of the camera from the z=0 plane at the stage's own aspect ratio. */
  cameraZ: number
  children: ReactNode
}

/** Camera distance after fitting the stage to the current canvas aspect. */
export function useFitDistance(cameraZ: number): number {
  const aspect = useThree((s) => s.size.width / s.size.height)
  return fitDistance(cameraZ, aspect)
}

function FitCamera({ cameraZ }: { cameraZ: number }) {
  const camera = useThree((s) => s.camera)
  const z = useFitDistance(cameraZ)
  useEffect(() => {
    camera.position.z = z
  }, [camera, z])
  return null
}

export function SceneCanvas({ background, cameraZ, children }: SceneCanvasProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, cameraZ], fov: fovFor(cameraZ), near: 0.1, far: 500 }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <color attach="background" args={[background]} />
      <FitCamera cameraZ={cameraZ} />
      {children}
    </Canvas>
  )
}
