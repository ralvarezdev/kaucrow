import { useTexture } from '@react-three/drei'
import { Suspense, useCallback, useEffect, useState } from 'react'
import type { Photo } from '@/features/album/types'
import { toWorld } from './units'
import { useDamped } from './useDamped'

type FaceProps = { w: number; h: number; opacity: number }
type Entry = { key: string; photo: Photo; initial: number }

const faceKey = (p: Photo) => p.imageUrl ?? p.tone

/**
 * When the photo changes, the new face fades in over the old one (which stays
 * opaque beneath it, so there's no mid-fade dip) and the old one is dropped.
 */
export function FaceStack({ photo, w, h, opacity }: FaceProps & { photo: Photo }) {
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
