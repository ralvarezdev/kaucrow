import { PhotoFrame } from '../shared/PhotoFrame'
import { SceneCanvas } from '../shared/SceneCanvas'
import { STAGE } from '../shared/units'
import { useSceneAlbum } from '../shared/useSceneAlbum'
import { DOTFILES_COLORS, DOTFILES_FOCUS, DOTFILES_SLOTS } from './layout'

const CAMERA_Z = 10
const INACTIVE_OPACITY = 0.8

function Windows() {
  const { photos, slots, focused, pick, expand } = useSceneAlbum()

  return (
    <>
      {DOTFILES_SLOTS.map((rect, i) => {
        const photo = photos[slots[i] ?? -1]
        if (!photo) return null
        return (
          <PhotoFrame
            key={i}
            photo={photo}
            area={STAGE}
            rect={rect}
            border={2}
            borderColor={DOTFILES_COLORS.inactive}
            paper={DOTFILES_COLORS.background}
            opacity={INACTIVE_OPACITY}
            onSelect={() => pick(i)}
          />
        )
      })}
      {focused && (
        <PhotoFrame
          photo={focused}
          onSelect={() => expand(focused)}
          area={STAGE}
          rect={DOTFILES_FOCUS}
          border={2}
          borderColor={DOTFILES_COLORS.active}
          paper={DOTFILES_COLORS.background}
          shadow={{ offsetY: 12, opacity: 0.4 }}
        />
      )}
    </>
  )
}

export function Dotfiles() {
  return (
    <SceneCanvas background={DOTFILES_COLORS.background} cameraZ={CAMERA_Z}>
      <Windows />
    </SceneCanvas>
  )
}
