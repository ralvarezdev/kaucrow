import { useCursor, useTexture } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import type { ReactNode } from 'react'
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import type { Photo } from '@/features/album/types'
import { type Paint, usePaintedTexture } from './textures'
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

/* ---- photo face with crossfade ------------------------------------------ */

type FaceProps = { w: number; h: number; opacity: number }
type Entry = { key: string; photo: Photo; initial: number }

const faceKey = (p: Photo) => p.imageUrl ?? p.tone

/**
 * When the photo changes, the new face fades in over the old one (which stays
 * opaque beneath it, so there's no mid-fade dip) and the old one is dropped.
 */
function FaceStack({ photo, w, h, opacity }: FaceProps & { photo: Photo }) {
  const key = faceKey(photo)
  const [stack, setStack] = useState<Entry[]>(() => [{ key, photo, initial: 1 }])

  const top = stack[stack.length - 1]
  if (top && top.key !== key) {
    setStack([...stack.slice(-1), { key, photo, initial: 0 }])
  }

  const settled = useCallback(
    (k: string) => setStack((s) => (s.length > 1 && s[s.length - 1]?.key === k ? s.slice(-1) : s)),
    [],
  )

  return (
    <>
      {stack.map((entry, index) => (
        <Face
          key={entry.key}
          entry={entry}
          index={index}
          w={w}
          h={h}
          opacity={opacity}
          isTop={index === stack.length - 1}
          onShown={settled}
        />
      ))}
    </>
  )
}

function Face({
  entry,
  index,
  isTop,
  onShown,
  w,
  h,
  opacity,
}: FaceProps & {
  entry: Entry
  index: number
  isTop: boolean
  onShown: (key: string) => void
}) {
  const fade = useDamped(1, entry.initial, 9)
  useEffect(() => {
    if (isTop && fade >= 1) onShown(entry.key)
  }, [isTop, fade, onShown, entry.key])

  // Only the incoming face fades; faces beneath it stay solid.
  const alpha = (isTop ? fade : 1) * opacity
  const { photo } = entry

  return (
    <group position={[0, 0, index * 0.001]}>
      <Suspense fallback={<ToneFace tone={photo.tone} w={w} h={h} opacity={alpha} />}>
        {photo.imageUrl ? (
          <ImageFace url={photo.imageUrl} w={w} h={h} opacity={alpha} />
        ) : (
          <ToneFace tone={photo.tone} w={w} h={h} opacity={alpha} />
        )}
      </Suspense>
    </group>
  )
}

function ToneFace({ tone, w, h, opacity }: FaceProps & { tone: string }) {
  return (
    <mesh>
      <planeGeometry args={[toWorld(w), toWorld(h)]} />
      <meshBasicMaterial color={tone} transparent opacity={opacity} toneMapped={false} />
    </mesh>
  )
}

/** The whole photo at its own proportions, centred; the frame's paper shows in any spare space. */
function ImageFace({ url, w, h, opacity }: FaceProps & { url: string }) {
  const texture = useTexture(url)
  const { width, height } = texture.image as { width: number; height: number }
  const scale = Math.min(w / width, h / height)
  return (
    <mesh>
      <planeGeometry args={[toWorld(width * scale), toWorld(height * scale)]} />
      <meshBasicMaterial map={texture} transparent opacity={opacity} toneMapped={false} />
    </mesh>
  )
}

/* ---- blurred card -------------------------------------------------------- */

const BLUR_RESOLUTION = 2

function BlurredCard({
  width,
  height,
  border,
  borderColor,
  paper,
  blur,
  opacity,
}: {
  width: number
  height: number
  border: number
  borderColor: string
  paper: string
  blur: number
  opacity: number
}) {
  // Padding so the blur isn't clipped at the card edge.
  const pad = Math.ceil(blur * 3)
  const cardW = width + pad * 2
  const cardH = height + pad * 2

  const paint = useMemo<Paint>(
    () => (ctx, canvasW) => {
      const s = canvasW / cardW
      ctx.scale(s, s)
      // Safari < 18 ignores ctx.filter and simply draws the card sharp.
      ctx.filter = `blur(${blur}px)`
      if (border > 0) {
        ctx.fillStyle = borderColor
        ctx.fillRect(pad, pad, width, height)
      }
      ctx.fillStyle = paper
      ctx.fillRect(pad + border, pad + border, width - border * 2, height - border * 2)
    },
    [cardW, pad, blur, border, borderColor, paper, width, height],
  )

  const texture = usePaintedTexture(paint, cardW * BLUR_RESOLUTION, cardH * BLUR_RESOLUTION)

  return (
    <mesh>
      <planeGeometry args={[toWorld(cardW), toWorld(cardH)]} />
      <meshBasicMaterial map={texture} transparent opacity={opacity} toneMapped={false} />
    </mesh>
  )
}
