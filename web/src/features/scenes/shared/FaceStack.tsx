import { useTexture } from '@react-three/drei'
import { Suspense, useCallback, useEffect, useState } from 'react'
import type { Photo } from '@/features/album/types'
import { type Entry, faceKey, newEntry, nextStack, visibility } from './faceStack'
import { RoundedPlane } from './RoundedPlane'
import { toWorld } from './units'
import { useDamped } from './useDamped'

type FaceProps = { w: number; h: number; radius: number; opacity: number }

/**
 * When the photo changes, the new face waits until its image has loaded, then
 * fades in while the old one fades out. Both are translucent for that moment,
 * so an old photo of another shape never sits solid underneath the new one.
 */
export function FaceStack({ photo, w, h, radius, opacity }: FaceProps & { photo: Photo }) {
  const [stack, setStack] = useState<Entry[]>(() => [newEntry(photo, true)])

  if (stack[stack.length - 1]?.key !== faceKey(photo)) setStack(nextStack(stack, photo))

  const loaded = useCallback(
    (key: string) =>
      setStack((s) => s.map((e) => (e.key === key && !e.loaded ? { ...e, loaded: true } : e))),
    [],
  )
  // Once the newest face is fully in, the faces under it are gone for good.
  const settled = useCallback(
    (key: string) =>
      setStack((s) => (s.length > 1 && s[s.length - 1]?.key === key ? s.slice(-1) : s)),
    [],
  )

  const visible = visibility(stack)

  return (
    <>
      {stack.map((entry, index) => (
        <Face
          key={entry.key}
          entry={entry}
          index={index}
          w={w}
          h={h}
          radius={radius}
          opacity={opacity}
          visible={visible[index] ?? true}
          isTop={index === stack.length - 1}
          onLoaded={loaded}
          onShown={settled}
        />
      ))}
    </>
  )
}

function Face({
  entry,
  index,
  visible,
  isTop,
  onLoaded,
  onShown,
  w,
  h,
  radius,
  opacity,
}: FaceProps & {
  entry: Entry
  index: number
  visible: boolean
  isTop: boolean
  onLoaded: (key: string) => void
  onShown: (key: string) => void
}) {
  const fade = useDamped(visible ? 1 : 0, entry.first ? 1 : 0, 9)
  useEffect(() => {
    if (isTop && fade >= 1) onShown(entry.key)
  }, [isTop, fade, onShown, entry.key])

  const ready = useCallback(() => onLoaded(entry.key), [onLoaded, entry.key])
  const alpha = fade * opacity
  const { photo } = entry

  return (
    <group position={[0, 0, index * 0.001]}>
      {/* Only a frame's very first face shows its tone while loading; a replacement just waits. */}
      <Suspense
        fallback={
          entry.first ? (
            <ToneFace tone={photo.tone} w={w} h={h} radius={radius} opacity={alpha} />
          ) : null
        }
      >
        {photo.imageUrl ? (
          <ImageFace
            url={photo.imageUrl}
            w={w}
            h={h}
            radius={radius}
            opacity={alpha}
            onReady={ready}
          />
        ) : (
          <ToneFace tone={photo.tone} w={w} h={h} radius={radius} opacity={alpha} />
        )}
      </Suspense>
    </group>
  )
}

function ToneFace({ tone, w, h, radius, opacity }: FaceProps & { tone: string }) {
  return (
    <RoundedPlane width={toWorld(w)} height={toWorld(h)} radius={toWorld(radius)}>
      <meshBasicMaterial color={tone} transparent opacity={opacity} toneMapped={false} />
    </RoundedPlane>
  )
}

/** The whole photo at its own proportions, centred; the frame's paper shows in any spare space. */
function ImageFace({
  url,
  w,
  h,
  radius,
  opacity,
  onReady,
}: FaceProps & { url: string; onReady: () => void }) {
  const texture = useTexture(url)
  // Rendering this far means the texture has loaded.
  useEffect(() => onReady(), [onReady])
  const { width, height } = texture.image as { width: number; height: number }
  const scale = Math.min(w / width, h / height)
  return (
    <RoundedPlane
      width={toWorld(width * scale)}
      height={toWorld(height * scale)}
      radius={toWorld(radius)}
    >
      <meshBasicMaterial map={texture} transparent opacity={opacity} toneMapped={false} />
    </RoundedPlane>
  )
}
