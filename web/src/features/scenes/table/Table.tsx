import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { type Group, MathUtils } from 'three'
import { PhotoFrame } from '../shared/PhotoFrame'
import { SceneCanvas } from '../shared/SceneCanvas'
import { layers, type Paint, radial, usePaintedTexture } from '../shared/textures'
import { rad, toWorld } from '../shared/units'
import { useSceneAlbum } from '../shared/useSceneAlbum'
import {
  PRINTS,
  TABLE_AREA,
  TABLE_FOCUS,
  TABLE_FOCUS_LIFT,
  TABLE_FOCUS_ROTATION,
  TABLE_ORIGIN,
  TABLE_TILT_DEG,
} from './layout'

/** Prints, with slightly rounded corners. */
const RADIUS = 5

/** Stage px kept visible across a phone in portrait: the focus photo and its neighbours. */
const FOCUS_WIDTH = 840
const CAMERA_Z = 14
const BACKGROUND = '#cdba9a'
const PAPER = '#fbf8f1'
const PRINT_INSET = { left: 14, top: 14, right: 14, bottom: 46 }

const TABLETOP: Paint = layers(
  (ctx, w, h) => {
    ctx.fillStyle = '#d8c6a6'
    ctx.fillRect(0, 0, w, h)
  },
  radial(0.5, 0.5, [
    [0, 'rgba(255,247,226,.65)'],
    [0.6, 'rgba(255,247,226,0)'],
  ]),
)

function Tabletop() {
  const { photos, slots, focused, pick, expand } = useSceneAlbum()

  const pan = useRef<Group>(null)
  useFrame(({ pointer }, dt) => {
    const g = pan.current
    if (!g) return
    g.position.x = MathUtils.damp(g.position.x, -pointer.x * 0.5, 4, dt)
    g.position.y = MathUtils.damp(g.position.y, pointer.y * 0.4, 4, dt)
  })

  const top = usePaintedTexture(TABLETOP, 512, 384)

  // Table centre → stage px → world offset from the camera axis.
  const originX = toWorld(TABLE_ORIGIN.x - 640)
  const originY = toWorld(400 - TABLE_ORIGIN.y)

  return (
    <group position={[originX, originY, 0]} rotation={[-rad(TABLE_TILT_DEG), 0, 0]}>
      <group ref={pan}>
        <mesh>
          <planeGeometry args={[toWorld(TABLE_AREA.width), toWorld(TABLE_AREA.height)]} />
          <meshBasicMaterial map={top} />
        </mesh>

        {slots.map((photoIndex, i) => {
          const print = PRINTS[i]
          const photo = photos[photoIndex]
          if (!print || !photo) return null
          return (
            <PhotoFrame
              key={i}
              photo={photo}
              area={TABLE_AREA}
              rect={print.rect}
              radius={RADIUS}
              rotation={print.rotation}
              z={0.02}
              paper={PAPER}
              inset={PRINT_INSET}
              shadow={{ offsetY: 8, opacity: 0.2 }}
              onSelect={() => pick(i)}
            />
          )
        })}

        {focused && (
          <PhotoFrame
            photo={focused}
            onSelect={() => expand(focused)}
            area={TABLE_AREA}
            rect={TABLE_FOCUS}
            radius={RADIUS}
            rotation={TABLE_FOCUS_ROTATION}
            z={TABLE_FOCUS_LIFT}
            paper="#fffdf8"
            inset={{ left: 16, top: 16, right: 16, bottom: 56 }}
            shadow={{ offsetY: 36, opacity: 0.3 }}
          >
            {/* Tape across the top edge */}
            <mesh
              position={[0.02, toWorld(TABLE_FOCUS.height) / 2, 0.02]}
              rotation={[0, 0, rad(3)]}
            >
              <planeGeometry args={[0.64, 0.24]} />
              <meshBasicMaterial color="#ecdeb2" transparent opacity={0.8} />
            </mesh>
          </PhotoFrame>
        )}
      </group>
    </group>
  )
}

export function Table() {
  return (
    <SceneCanvas background={BACKGROUND} cameraZ={CAMERA_Z} focusWidth={FOCUS_WIDTH}>
      <Tabletop />
    </SceneCanvas>
  )
}
