import { useCursor, useTexture } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import type { ReactNode } from 'react'
import { Suspense, useState } from 'react'
import type { Photo } from '@/features/album/types'
import { type Area, type PxRect, rad, rectCentre, toWorld } from './units'

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
  shadow?: { offsetY: number; opacity: number }
  label?: string
  onSelect?: () => void
  /** Extra parts (tape, glow) in px offsets from the frame centre, y-up. */
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
  shadow,
  onSelect,
  children,
}: PhotoFrameProps) {
  const [hovered, setHovered] = useState(false)
  useCursor(hovered && onSelect !== undefined)

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
          <meshBasicMaterial color="#000" transparent opacity={shadow.opacity * opacity} />
        </mesh>
      )}
      {border > 0 && (
        <mesh>
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial color={borderColor} transparent opacity={opacity} toneMapped={false} />
        </mesh>
      )}
      <mesh position={[0, 0, LAYER]}>
        <planeGeometry args={[toWorld(innerW), toWorld(innerH)]} />
        <meshBasicMaterial color={paper} transparent opacity={opacity} toneMapped={false} />
      </mesh>
      <group position={[photoX, photoY, LAYER * 2]}>
        <Suspense fallback={<ToneFace tone={photo.tone} w={photoW} h={photoH} opacity={opacity} />}>
          {photo.imageUrl ? (
            <ImageFace url={photo.imageUrl} w={photoW} h={photoH} opacity={opacity} />
          ) : (
            <ToneFace tone={photo.tone} w={photoW} h={photoH} opacity={opacity} />
          )}
        </Suspense>
      </group>
      {children}
    </group>
  )
}

type FaceProps = { w: number; h: number; opacity: number }

function ToneFace({ tone, w, h, opacity }: FaceProps & { tone: string }) {
  return (
    <mesh>
      <planeGeometry args={[toWorld(w), toWorld(h)]} />
      <meshBasicMaterial color={tone} transparent opacity={opacity} toneMapped={false} />
    </mesh>
  )
}

function ImageFace({ url, w, h, opacity }: FaceProps & { url: string }) {
  const texture = useTexture(url)
  return (
    <mesh>
      <planeGeometry args={[toWorld(w), toWorld(h)]} />
      <meshBasicMaterial map={texture} transparent opacity={opacity} toneMapped={false} />
    </mesh>
  )
}
