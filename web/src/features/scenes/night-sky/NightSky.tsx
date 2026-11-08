import { Line, Stars } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import { MathUtils } from 'three'
import { useAlbum } from '@/features/album/store'
import { useMotion } from '../shared/MotionContext'
import { PhotoFrame } from '../shared/PhotoFrame'
import { SceneCanvas } from '../shared/SceneCanvas'
import { radial, usePaintedTexture } from '../shared/textures'
import { rectCentre, STAGE } from '../shared/units'
import { useSceneAlbum } from '../shared/useSceneAlbum'
import { CONSTELLATIONS, SKY_FOCUS, SKY_SLOTS, type SkyDepth, type Waypoint } from './layout'

/** Soft corners on the floating photo cards. */
const RADIUS = 6

/** Stage px kept visible across a phone in portrait: the focus photo and its neighbours. */
const FOCUS_WIDTH = 840
const CAMERA_Z = 10
const BACKGROUND = '#0b0d1c'
const ACCENT = '#f2d9a6'
/** A soft halo behind the focus photo, fading to nothing so it has no edge. */
const GLOW = radial(0.5, 0.5, [
  [0, 'rgba(242,217,166,.2)'],
  [0.75, 'rgba(242,217,166,0)'],
])

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

/** How much of the way to a picked photo the camera starts from, before it settles back. */
const JOURNEY_REACH = 0.2

function waypoint(point: Waypoint): [number, number, number] {
  const rect = point === 'focus' ? SKY_FOCUS : SKY_SLOTS[point]?.rect
  if (!rect) return [0, 0, 0]
  const [x, y] = rectCentre(rect, STAGE)
  return [x, y, 0]
}

/** True once per pick, with the slot the photo came from; null before the first one. */
function usePickedSlot(): { slot: number; count: number } | null {
  const focus = useAlbum((s) => s.focus)
  const tour = useAlbum((s) => s.tour)
  const last = useRef(focus)
  const [picked, setPicked] = useState<{ slot: number; count: number } | null>(null)

  useEffect(() => {
    if (last.current === focus) return
    last.current = focus
    setPicked((p) => ({ slot: tour, count: (p?.count ?? 0) + 1 }))
  }, [focus, tour])

  return picked
}

/**
 * Pointer parallax, plus a camera glide: when a photo is picked the camera
 * starts toward where it hung and eases back to the focus frame.
 */
function ParallaxRig({ picked }: { picked: { slot: number; count: number } | null }) {
  const { journey } = useMotion()
  const sweep = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!picked || !journey) return
    const [x, y] = waypoint(picked.slot)
    sweep.current = { x: x * JOURNEY_REACH, y: y * JOURNEY_REACH }
  }, [picked, journey])

  useFrame(({ camera, pointer }, dt) => {
    sweep.current.x = MathUtils.damp(sweep.current.x, 0, 1.6, dt)
    sweep.current.y = MathUtils.damp(sweep.current.y, 0, 1.6, dt)
    camera.position.x = MathUtils.damp(camera.position.x, pointer.x * 0.3 + sweep.current.x, 4, dt)
    camera.position.y = MathUtils.damp(camera.position.y, pointer.y * 0.22 + sweep.current.y, 4, dt)
  })
  return null
}

/** Seconds the trail takes to draw, to hold, and to fade. */
const TRAIL = { draw: 0.7, hold: 0.5, fade: 0.9 }

/** A dashed line that draws itself from the slot a photo left to the focus frame, then fades. */
function Trail({ picked }: { picked: { slot: number; count: number } | null }) {
  const { journey } = useMotion()
  const [age, setAge] = useState<number | null>(null)

  useEffect(() => {
    if (picked && journey) setAge(0)
  }, [picked, journey])

  useFrame((_, dt) => {
    if (age === null) return
    const next = age + dt
    setAge(next > TRAIL.draw + TRAIL.hold + TRAIL.fade ? null : next)
  })

  if (age === null || !picked) return null
  const from = waypoint(picked.slot)
  const to = waypoint('focus')
  const p = 1 - (1 - Math.min(1, age / TRAIL.draw)) ** 3
  const faded = Math.max(0, age - TRAIL.draw - TRAIL.hold) / TRAIL.fade
  return (
    <Line
      points={[from, [from[0] + (to[0] - from[0]) * p, from[1] + (to[1] - from[1]) * p, 0]]}
      color={ACCENT}
      transparent
      opacity={0.6 * (1 - faded)}
      lineWidth={1.5}
      dashed
      dashSize={0.04}
      gapSize={0.07}
    />
  )
}

function SkyContent() {
  const { photos, slots, focused, pick, expand } = useSceneAlbum()
  const glow = usePaintedTexture(GLOW)
  const picked = usePickedSlot()

  return (
    <>
      <ParallaxRig picked={picked} />
      <Trail picked={picked} />
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
                  radius={RADIUS}
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
            <planeGeometry args={[7.2, 6]} />
            <meshBasicMaterial map={glow} transparent depthWrite={false} />
          </mesh>
          <PhotoFrame
            photo={focused}
            onSelect={() => expand(focused)}
            area={STAGE}
            rect={SKY_FOCUS}
            radius={RADIUS}
            border={10}
            borderColor="#f4eee2"
            paper={focused.tone}
          />
        </>
      )}
    </>
  )
}

export function NightSky() {
  return (
    <SceneCanvas
      background={BACKGROUND}
      cameraZ={CAMERA_Z}
      focusWidth={FOCUS_WIDTH}
      entrance="drift"
      idle
    >
      <SkyContent />
    </SceneCanvas>
  )
}
