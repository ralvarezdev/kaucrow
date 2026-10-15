import { MapControls, Stars } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { type ElementRef, useEffect, useMemo, useRef, useState } from 'react'
import { MathUtils } from 'three'
import { useAlbum } from '@/features/album/store'
import type { PhotoGroup } from '@/features/album/types'
import { PhotoFrame } from '../shared/PhotoFrame'
import { SceneCanvas, useFitDistance } from '../shared/SceneCanvas'
import { type Paint, radial, usePaintedTexture } from '../shared/textures'
import { rectCentre, STAGE } from '../shared/units'
import { useDamped } from '../shared/useDamped'
import { type CrowdCard, cardOpacity, generateCrowd, isBlurred, placeNewCard } from './crowd'

const CAMERA_Z = 10
const MIN_DISTANCE = 3
const PAN_LIMIT = { x: 6.4, y: 4 }
const BACKGROUND = '#0b0d1c'
const ACCENT = '#f2d9a6'

const HALOS: Record<
  PhotoGroup,
  { rect: { x: number; y: number; width: number; height: number }; paint: Paint }
> = {
  friends: {
    rect: { x: 40, y: 190, width: 720, height: 520 },
    paint: radial(0.5, 0.5, [
      [0, 'rgba(124,143,181,.30)'],
      [0.68, 'rgba(124,143,181,0)'],
    ]),
  },
  family: {
    rect: { x: 670, y: 210, width: 520, height: 460 },
    paint: radial(0.5, 0.5, [
      [0, 'rgba(235,200,130,.30)'],
      [0.68, 'rgba(235,200,130,0)'],
    ]),
  },
}

const LABELS: Record<PhotoGroup, { text: string; x: number; y: number }> = {
  friends: { text: 'Friends', x: 400, y: 706 },
  family: { text: 'Family', x: 930, y: 686 },
}

const CROWD = generateCrowd()

function Halo({ group, dim }: { group: PhotoGroup; dim: boolean }) {
  const { rect, paint } = HALOS[group]
  const texture = usePaintedTexture(paint)
  const opacity = useDamped(dim ? 0.15 : 1)
  const [x, y] = rectCentre(rect, STAGE)
  return (
    <mesh position={[x, y, -0.2]}>
      <planeGeometry args={[rect.width / 100, rect.height / 100]} />
      <meshBasicMaterial map={texture} transparent opacity={opacity} depthWrite={false} />
    </mesh>
  )
}

function useFontReady(font: string): boolean {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let live = true
    document.fonts.load(font).then(() => live && setReady(true))
    return () => {
      live = false
    }
  }, [font])
  return ready
}

const LABEL_FONT = 'italic 30px "Instrument Serif"'

/** Group name painted with the page font (three has no CSS font access). */
function Label({ group }: { group: PhotoGroup }) {
  const { text, x, y } = LABELS[group]
  const ready = useFontReady(LABEL_FONT)
  const paint = useMemo<Paint>(
    () => (ctx, w, h) => {
      const s = h / 40
      ctx.fillStyle = '#f6efe2'
      // Until the webfont arrives, paint with the fallback; `ready` triggers the repaint.
      ctx.font = `italic ${30 * s}px ${ready ? '"Instrument Serif", ' : ''}Georgia, serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(text, w / 2, h / 2)
    },
    [text, ready],
  )
  const texture = usePaintedTexture(paint, 400, 80)
  const [cx, cy] = rectCentre({ x: x - 100, y, width: 200, height: 40 }, STAGE)
  return (
    <mesh position={[cx, cy, 0.05]}>
      <planeGeometry args={[2, 0.4]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} />
    </mesh>
  )
}

function Card({ card, matches }: { card: CrowdCard; matches: boolean }) {
  return (
    <PhotoFrame
      photo={card.photo}
      area={STAGE}
      rect={card.rect}
      rotation={card.rotation}
      border={2}
      borderColor="#e9e4d8"
      paper={card.photo.tone}
      opacity={cardOpacity(card, matches)}
      blur={isBlurred(card) ? 1 : 0}
      z={card.fresh ? 0.02 : 0}
    >
      {card.fresh && (
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[card.rect.width / 100 + 0.5, card.rect.height / 100 + 0.5]} />
          <meshBasicMaterial
            color={ACCENT}
            transparent
            opacity={0.22 * (matches ? 1 : 0)}
            depthWrite={false}
          />
        </mesh>
      )}
    </PhotoFrame>
  )
}

/** Wheel / pinch to zoom, drag to pan, never further out than the fitted stage. */
function Controls() {
  const fit = useFitDistance(CAMERA_Z)
  const ref = useRef<ElementRef<typeof MapControls>>(null)

  useFrame(({ camera }) => {
    const controls = ref.current
    if (!controls) return
    const x = MathUtils.clamp(controls.target.x, -PAN_LIMIT.x, PAN_LIMIT.x)
    const y = MathUtils.clamp(controls.target.y, -PAN_LIMIT.y, PAN_LIMIT.y)
    camera.position.x += x - controls.target.x
    camera.position.y += y - controls.target.y
    controls.target.x = x
    controls.target.y = y
  })

  return (
    <MapControls
      ref={ref}
      makeDefault
      enableRotate={false}
      screenSpacePanning
      minDistance={MIN_DISTANCE}
      maxDistance={fit}
      dampingFactor={0.12}
    />
  )
}

function Crowd() {
  const photos = useAlbum((s) => s.photos)
  const filter = useAlbum((s) => s.filter)

  const cards = useMemo(() => {
    const added = photos.filter((p) => p.mine).map((p, i) => placeNewCard(p, i))
    return [...CROWD, ...added]
  }, [photos])

  const showing = (g: PhotoGroup) => filter === 'all' || filter === g

  return (
    <>
      <Controls />
      <Stars radius={120} depth={60} count={1500} factor={5} saturation={0} fade speed={0.3} />
      <Halo group="friends" dim={!showing('friends')} />
      <Halo group="family" dim={!showing('family')} />
      {cards.map((card, i) => (
        <Card key={i} card={card} matches={showing(card.group)} />
      ))}
      <Label group="friends" />
      <Label group="family" />
    </>
  )
}

export function Growing() {
  return (
    <SceneCanvas background={BACKGROUND} cameraZ={CAMERA_Z}>
      <Crowd />
    </SceneCanvas>
  )
}
