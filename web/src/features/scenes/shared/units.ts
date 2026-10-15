/**
 * Mockups are authored in CSS pixels on a 1280×800 stage. One world unit is
 * UNIT px, so layouts port over unchanged and the camera sits UNIT*10 px away
 * (the mockups' `perspective: 1000px`).
 */
export const UNIT = 100
export const STAGE = { width: 1280, height: 800 } as const

export type Area = { width: number; height: number }
export type PxRect = { x: number; y: number; width: number; height: number }

export const toWorld = (px: number) => px / UNIT
export const rad = (degrees: number) => (degrees * Math.PI) / 180

/** CSS-style top-left px rect → centre in a y-up world centred on `area`. */
export function rectCentre(rect: PxRect, area: Area): [x: number, y: number] {
  return [
    toWorld(rect.x + rect.width / 2 - area.width / 2),
    toWorld(area.height / 2 - rect.y - rect.height / 2),
  ]
}

/** Vertical FOV that makes the z=0 plane exactly STAGE.height px tall at `cameraZ`. */
export const fovFor = (cameraZ: number) =>
  (2 * Math.atan(toWorld(STAGE.height) / 2 / cameraZ) * 180) / Math.PI
