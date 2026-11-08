import { useCursor } from '@react-three/drei'
import { type ThreeEvent, useFrame } from '@react-three/fiber'
import type { ReactNode } from 'react'
import { useMemo, useRef, useState } from 'react'
import { Color, type Group, type MeshBasicMaterial } from 'three'
import type { Photo } from '@/features/album/types'
import { BlurredCard } from './BlurredCard'
import { ENTRANCES, type EntranceKind, entranceDelay, entranceFrame, REST } from './entrance'
import { FaceStack } from './FaceStack'
import { useMotion } from './MotionContext'
import { RoundedPlane } from './RoundedPlane'
import { type Area, type PxRect, rad, rectCentre, toWorld } from './units'
import { useDamped } from './useDamped'

type Insets = { left: number; top: number; right: number; bottom: number }

export type PhotoFrameProps = {
  photo: Photo
  /** Top-left px rect inside `area`, as drawn in the mockup. */
  rect: PxRect
  area: Area
  z?: number
  /** Clockwise degrees, as in CSS. */
  rotation?: number
  border?: number
  borderColor?: string
  /** Paper / mat colour inside the border. */
  paper?: string
  /** Where the photo sits inside the bordered area. */
  inset?: Partial<Insets>
  /** Corner radius in px. The photo itself follows it only when it fills the frame. */
  radius?: number
  opacity?: number
  /**
   * Gaussian blur in px. Blurred frames are drawn as one flat, pre-blurred
   * card (border + paper only): far-away photos aren't legible anyway.
   */
  blur?: number
  shadow?: { offsetY: number; opacity: number }
  onSelect?: () => void
  /** Extra parts (tape, glow), positioned in world units from the frame centre. */
  children?: ReactNode
}

const LAYER = 0.004

/** How far a hovered photo rises (px), how much it grows, and how far it comes toward the viewer. */
const LIFT = { rise: 8, grow: 0.035, toward: 0.15 }
/** Idle drift: amplitude in px and radians, and the speed of each wave. */
const FLOAT = { rise: 3, tilt: 0.006, speed: 0.5 }

export function PhotoFrame({
  photo,
  rect,
  area,
  z = 0,
  rotation = 0,
  border = 0,
  borderColor = '#fff',
  paper = '#fff',
  inset = {},
  radius = 0,
  opacity = 1,
  blur = 0,
  shadow,
  onSelect,
  children,
}: PhotoFrameProps) {
  const [hovered, setHovered] = useState(false)
  const motion = useMotion()

  // The mat follows the photo's colour, easing to a new one instead of snapping ahead of the photo.
  const paperMaterial = useRef<MeshBasicMaterial>(null)
  const paperStart = useRef(new Color(paper)).current
  const paperTarget = useMemo(() => new Color(paper), [paper])
  useFrame((_, dt) => paperMaterial.current?.color.lerp(paperTarget, 1 - Math.exp(-9 * dt)))
  useCursor(hovered && onSelect !== undefined)
  const [cx, cy] = rectCentre(rect, area)
  const w = toWorld(rect.width)
  const h = toWorld(rect.height)

  const arrived = useEntrance(motion.entrance, cx, cy, motion.held)
  // Hovering lifts the photo toward the viewer; filters and layer changes fade instead of snapping.
  const lift = useDamped(motion.hover && hovered && onSelect !== undefined ? 1 : 0, 0, 8)
  const shown = useDamped(opacity) * arrived.alpha

  const float = useRef<Group>(null)
  const phase = useRef(Math.random() * Math.PI * 2).current
  useFrame(({ clock }) => {
    const g = float.current
    if (!g || !motion.idle) return
    const t = clock.elapsedTime * FLOAT.speed + phase
    g.position.y = Math.sin(t) * toWorld(FLOAT.rise)
    g.rotation.z = Math.sin(t * 0.74 + 1) * FLOAT.tilt
  })

  const select = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    onSelect?.()
  }

  const innerW = rect.width - border * 2
  const innerH = rect.height - border * 2
  const i = { left: 0, top: 0, right: 0, bottom: 0, ...inset }
  const photoW = innerW - i.left - i.right
  const photoH = innerH - i.top - i.bottom
  // A photo that fills the frame follows its corners; one on a mat keeps small ones.
  const matted = i.left + i.top + i.right + i.bottom > 0
  const faceRadius = matted ? Math.min(radius, 3) : Math.max(0, radius - border)
  // Photo centre relative to the frame centre (y-up).
  const photoX = toWorld(i.left - i.right) / 2
  const photoY = toWorld(i.bottom - i.top) / 2

  return (
    <group
      position={[
        cx + arrived.dx,
        cy + arrived.dy + toWorld(LIFT.rise) * lift,
        z + arrived.dz + LIFT.toward * lift,
      ]}
      rotation={[0, 0, -rad(rotation) + arrived.rot]}
      scale={arrived.scale * (1 + LIFT.grow * lift)}
      {...(onSelect ? { onClick: select } : {})}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
      }}
      onPointerOut={() => setHovered(false)}
    >
      <group ref={float}>
        {shadow && (
          <RoundedPlane
            width={w}
            height={h}
            radius={toWorld(radius)}
            position={[0, -toWorld(shadow.offsetY * (1 + 0.6 * lift)), -LAYER]}
          >
            <meshBasicMaterial
              color="#000"
              transparent
              opacity={Math.min(1, shadow.opacity * (1 + 0.4 * lift)) * shown}
            />
          </RoundedPlane>
        )}

        {blur > 0 ? (
          <BlurredCard
            width={rect.width}
            height={rect.height}
            border={border}
            borderColor={borderColor}
            paper={paper}
            radius={radius}
            blur={blur}
            opacity={shown}
          />
        ) : (
          <>
            {border > 0 && (
              <RoundedPlane width={w} height={h} radius={toWorld(radius)}>
                <meshBasicMaterial
                  color={borderColor}
                  transparent
                  opacity={shown}
                  toneMapped={false}
                />
              </RoundedPlane>
            )}
            <RoundedPlane
              width={toWorld(innerW)}
              height={toWorld(innerH)}
              radius={toWorld(Math.max(0, radius - border))}
              position={[0, 0, LAYER]}
            >
              <meshBasicMaterial
                ref={paperMaterial}
                color={paperStart}
                transparent
                opacity={shown}
                toneMapped={false}
              />
            </RoundedPlane>
            <group position={[photoX, photoY, LAYER * 2]}>
              <FaceStack photo={photo} w={photoW} h={photoH} radius={faceRadius} opacity={shown} />
            </group>
          </>
        )}
        {children}
      </group>
    </group>
  )
}

/**
 * Pose of a frame while it arrives with its scene. The photo nearest the centre
 * moves first and the others follow outward. Holds at the start pose while the
 * splash still covers the page, and re-renders only while moving.
 */
function useEntrance(
  kind: EntranceKind,
  x: number,
  y: number,
  held: boolean,
): ReturnType<typeof entranceFrame> {
  const [pose, setPose] = useState(() => entranceFrame(kind, 0, { x, y }))
  const born = useRef<number | null>(null)
  const done = useRef(false)

  useFrame(({ clock }) => {
    if (done.current || held) return
    const now = clock.elapsedTime * 1000
    born.current ??= now
    const { duration } = ENTRANCES[kind]
    const t = (now - born.current - entranceDelay(kind, x, y)) / duration
    if (t >= 1) {
      done.current = true
      setPose(REST)
    } else setPose(entranceFrame(kind, t, { x, y }))
  })

  return pose
}
