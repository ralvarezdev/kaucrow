import { useCursor } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import type { ReactNode } from 'react'
import { useState } from 'react'
import type { Photo } from '@/features/album/types'
import { BlurredCard } from './BlurredCard'
import { FaceStack } from './FaceStack'
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
  opacity = 1,
  blur = 0,
  shadow,
  onSelect,
  children,
}: PhotoFrameProps) {
  const [hovered, setHovered] = useState(false)
  useCursor(hovered && onSelect !== undefined)
  // Filters and layer changes fade instead of snapping.
  const shown = useDamped(opacity)

  const select = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    onSelect?.()
  }

  const [cx, cy] = rectCentre(rect, area)
  const w = toWorld(rect.width)
  const h = toWorld(rect.height)

  const innerW = rect.width - border * 2
  const innerH = rect.height - border * 2
  const i = { left: 0, top: 0, right: 0, bottom: 0, ...inset }
  const photoW = innerW - i.left - i.right
  const photoH = innerH - i.top - i.bottom
  // Photo centre relative to the frame centre (y-up).
  const photoX = toWorld(i.left - i.right) / 2
  const photoY = toWorld(i.bottom - i.top) / 2

  return (
    <group
      position={[cx, cy, z]}
      rotation={[0, 0, -rad(rotation)]}
      {...(onSelect ? { onClick: select } : {})}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
      }}
      onPointerOut={() => setHovered(false)}
    >
      {shadow && (
        <mesh position={[0, -toWorld(shadow.offsetY), -LAYER]}>
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial color="#000" transparent opacity={shadow.opacity * shown} />
        </mesh>
      )}

      {blur > 0 ? (
        <BlurredCard
          width={rect.width}
          height={rect.height}
          border={border}
          borderColor={borderColor}
          paper={paper}
          blur={blur}
          opacity={shown}
        />
      ) : (
        <>
          {border > 0 && (
            <mesh>
              <planeGeometry args={[w, h]} />
              <meshBasicMaterial
                color={borderColor}
                transparent
                opacity={shown}
                toneMapped={false}
              />
            </mesh>
          )}
          <mesh position={[0, 0, LAYER]}>
            <planeGeometry args={[toWorld(innerW), toWorld(innerH)]} />
            <meshBasicMaterial color={paper} transparent opacity={shown} toneMapped={false} />
          </mesh>
          <group position={[photoX, photoY, LAYER * 2]}>
            <FaceStack photo={photo} w={photoW} h={photoH} opacity={shown} />
          </group>
        </>
      )}
      {children}
    </group>
  )
}
