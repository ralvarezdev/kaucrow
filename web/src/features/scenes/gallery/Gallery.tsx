import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { type Group, MathUtils } from 'three'
import { PhotoFrame } from '../shared/PhotoFrame'
import { SceneCanvas } from '../shared/SceneCanvas'
import { layers, linear, type Paint, radial, usePaintedTexture } from '../shared/textures'
import { rad, toWorld } from '../shared/units'
import { useSceneAlbum } from '../shared/useSceneAlbum'
import { GALLERY_FOCUS, GALLERY_SLOTS, ROOM, WALL_AREA, type Wall } from './layout'

/** Stage px kept visible across a phone in portrait: the focus photo and its neighbours. */
const FOCUS_WIDTH = 840
const CAMERA_Z = 10
const BACKGROUND = '#120c08'
const FRAME_COLOR = '#3a281c'
const MAT_COLOR = '#f3eee4'

const BACK_WALL: Paint = layers(
  radial(0.5, 0.52, [
    [0, '#e6d8be'],
    [0.6, '#d0be9f'],
    [1, '#b5a284'],
  ]),
  radial(0.5, 0.52, [
    [0, 'rgba(255,233,184,.38)'],
    [0.7, 'rgba(255,233,184,0)'],
  ]),
)
const LEFT_WALL: Paint = linear('x', [
  [0, '#5f503e'],
  [0.7, '#a6937a'],
  [1, '#b9a688'],
])
const RIGHT_WALL: Paint = linear('x', [
  [0, '#b9a688'],
  [0.3, '#a6937a'],
  [1, '#5f503e'],
])
const FLOOR: Paint = layers(
  linear('y', [
    [0, '#8a6446'],
    [0.55, '#5a3e2b'],
    [1, '#2e1e14'],
  ]),
  radial(0.5, 0.18, [
    [0, 'rgba(255,226,170,.5)'],
    [0.7, 'rgba(255,226,170,0)'],
  ]),
)
const CEILING: Paint = linear('y', [
  [0, '#1d130d'],
  [1, '#3a2a1e'],
])

const px = toWorld

function Room() {
  const { photos, slots, focused, pick, expand } = useSceneAlbum()

  const room = useRef<Group>(null)
  useFrame(({ pointer }, dt) => {
    const g = room.current
    if (!g) return
    g.rotation.y = MathUtils.damp(g.rotation.y, -pointer.x * rad(9), 4, dt)
    g.rotation.x = MathUtils.damp(g.rotation.x, pointer.y * rad(4), 4, dt)
  })

  const back = usePaintedTexture(BACK_WALL)
  const left = usePaintedTexture(LEFT_WALL)
  const right = usePaintedTexture(RIGHT_WALL)
  const floor = usePaintedTexture(FLOOR)
  const ceiling = usePaintedTexture(CEILING)

  const depth = px(ROOM.depth)
  const halfW = px(ROOM.halfWidth)
  const halfH = px(ROOM.halfHeight)

  // Each wall is a group in its own px space: x → right, y → up, normal → into the room.
  const wallGroups: Record<Wall, { position: [number, number, number]; rotationY: number }> = {
    back: { position: [0, 0, -depth], rotationY: 0 },
    left: { position: [-halfW, 0, -depth / 2], rotationY: rad(90) },
    right: { position: [halfW, 0, -depth / 2], rotationY: rad(-90) },
  }

  return (
    <group ref={room}>
      {/* Floor and ceiling */}
      <mesh position={[0, -halfH, -depth / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[halfW * 2, depth]} />
        <meshBasicMaterial map={floor} />
      </mesh>
      <mesh position={[0, halfH, -depth / 2]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[halfW * 2, depth]} />
        <meshBasicMaterial map={ceiling} />
      </mesh>

      {(['back', 'left', 'right'] as const).map((wall) => {
        const area = WALL_AREA[wall]
        const { position, rotationY } = wallGroups[wall]
        const map = wall === 'back' ? back : wall === 'left' ? left : right
        return (
          <group key={wall} position={position} rotation={[0, rotationY, 0]}>
            <mesh>
              <planeGeometry args={[px(area.width), px(area.height)]} />
              <meshBasicMaterial map={map} />
            </mesh>

            {wall === 'back' && focused && (
              <PhotoFrame
                photo={focused}
                onSelect={() => expand(focused)}
                area={area}
                rect={GALLERY_FOCUS}
                z={0.02}
                border={8}
                borderColor={FRAME_COLOR}
                paper={MAT_COLOR}
                inset={{ left: 20, top: 20, right: 20, bottom: 20 }}
                shadow={{ offsetY: 14, opacity: 0.35 }}
              />
            )}

            {slots.map((photoIndex, i) => {
              const slot = GALLERY_SLOTS[i]
              const photo = photos[photoIndex]
              if (!slot || !photo || slot.wall !== wall) return null
              const m = slot.inset
              return (
                <PhotoFrame
                  key={i}
                  photo={photo}
                  area={area}
                  rect={slot.rect}
                  z={0.02}
                  border={slot.border}
                  borderColor={FRAME_COLOR}
                  paper={MAT_COLOR}
                  inset={{ left: m, top: m, right: m, bottom: m }}
                  shadow={{ offsetY: 8, opacity: 0.35 }}
                  onSelect={() => pick(i)}
                />
              )
            })}
          </group>
        )
      })}
    </group>
  )
}

export function Gallery() {
  return (
    <SceneCanvas background={BACKGROUND} cameraZ={CAMERA_Z} focusWidth={FOCUS_WIDTH}>
      <Room />
    </SceneCanvas>
  )
}
