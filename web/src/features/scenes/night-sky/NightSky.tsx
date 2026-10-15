import { Line, Stars } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { MathUtils } from 'three'
import { useAlbum } from '@/features/album/store'
import { PhotoFrame } from '../shared/PhotoFrame'
import { SceneCanvas } from '../shared/SceneCanvas'
import { rectCentre, STAGE } from '../shared/units'
import { CONSTELLATIONS, SKY_FOCUS, SKY_SLOTS, type SkyDepth, type Waypoint } from './layout'

const CAMERA_Z = 10
const BACKGROUND = '#0b0d1c'
const ACCENT = '#f2d9a6'

/**
 * Layers sit at real depth; the group scale cancels perspective so the layout
 * matches the mockup at rest, and camera movement gives the parallax.
 */
const LAYERS: Record<
  SkyDepth,
  { z: number; opacity: number; blur: number; border: number; borderColor: string }
> = {
  far: { z: -20, opacity: 0.5, blur: 1, border: 3, borderColor: '#e9e4d8' },
  mid: { z: -6, opacity: 0.85, blur: 0, border: 4, borderColor: '#f1ece0' },
}
const scaleAt = (z: number) => (CAMERA_Z - z) / CAMERA_Z

function ParallaxRig() {
  useFrame(({ camera, pointer }, dt) => {
    camera.position.x = MathUtils.damp(camera.position.x, pointer.x * 0.3, 4, dt)
    camera.position.y = MathUtils.damp(camera.position.y, pointer.y * 0.22, 4, dt)
  })
  return null
}

function waypoint(point: Waypoint): [number, number, number] {
  const rect = point === 'focus' ? SKY_FOCUS : SKY_SLOTS[point]?.rect
  if (!rect) return [0, 0, 0]
  const [x, y] = rectCentre(rect, STAGE)
  return [x, y, 0]
}

function SkyContent() {
  const photos = useAlbum((s) => s.photos)
  const slots = useAlbum((s) => s.slots)
  const focus = useAlbum((s) => s.focus)
  const pick = useAlbum((s) => s.pick)

  const focused = photos[focus]

  return (
    <>
      <ParallaxRig />
      <Stars radius={120} depth={60} count={1800} factor={5} saturation={0} fade speed={0.4} />

      {(['far', 'mid'] as const).map((depth) => {
        const layer = LAYERS[depth]
        return (
          <group key={depth} position={[0, 0, layer.z]} scale={scaleAt(layer.z)}>
            {depth === 'mid' &&
              CONSTELLATIONS.map((path) => (
                <Line
                  key={path.join('-')}
                  points={path.map(waypoint)}
                  color={ACCENT}
                  transparent
                  opacity={0.22}
                  lineWidth={1}
                  dashed
                  dashSize={0.02}
                  gapSize={0.05}
                />
              ))}
            {slots.map((photoIndex, i) => {
              const slot = SKY_SLOTS[i]
              const photo = photos[photoIndex]
              if (!slot || !photo || slot.depth !== depth) return null
              return (
                <PhotoFrame
                  key={i}
                  photo={photo}
                  area={STAGE}
                  rect={slot.rect}
                  rotation={slot.rotation}
                  border={layer.border}
                  borderColor={layer.borderColor}
                  paper={photo.tone}
                  opacity={layer.opacity}
                  blur={layer.blur}
                  onSelect={() => pick(i)}
                />
              )
            })}
          </group>
        )
      })}

      {focused && (
        <>
          <mesh position={[0.3, 0.6, -0.05]}>
            <planeGeometry args={[6.4, 5]} />
            <meshBasicMaterial color={ACCENT} transparent opacity={0.07} />
          </mesh>
          <PhotoFrame
            photo={focused}
            area={STAGE}
            rect={SKY_FOCUS}
            border={10}
            borderColor="#f4eee2"
            paper={focused.tone}
            shadow={{ offsetY: 24, opacity: 0.5 }}
          />
        </>
      )}
    </>
  )
}

export function NightSky() {
  return (
    <SceneCanvas background={BACKGROUND} cameraZ={CAMERA_Z}>
      <SkyContent />
    </SceneCanvas>
  )
}
