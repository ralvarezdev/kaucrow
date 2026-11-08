import type { ComponentType } from 'react'
import { lazy } from 'react'
import type { SceneId } from './ids'

/** Dynamic imports, so every scene is its own chunk and can also be fetched ahead of its first visit. */
const LOADERS: Record<SceneId, () => Promise<{ default: ComponentType }>> = {
  'night-sky': () => import('./night-sky/NightSky').then((m) => ({ default: m.NightSky })),
  gallery: () => import('./gallery/Gallery').then((m) => ({ default: m.Gallery })),
  table: () => import('./table/Table').then((m) => ({ default: m.Table })),
  growing: () => import('./growing/Growing').then((m) => ({ default: m.Growing })),
  dotfiles: () => import('./dotfiles/Dotfiles').then((m) => ({ default: m.Dotfiles })),
}

/** Fetches every scene's code, so switching later never waits on the network. */
export function preloadScenes(): void {
  for (const load of Object.values(LOADERS)) void load()
}

export type SceneDefinition = {
  label: string
  /** Shows the prev/next controls beside the focus frame. */
  hasTour: boolean
  /** Number of photo slots the layout can show at once. */
  slotCount: number
  /** Shows the Everyone / Friends / Family filter and asks which group a new photo is in. */
  hasGroups: boolean
  /** Interaction hint shown at the bottom of the stage. */
  hint: string
  Component: ComponentType
}

export const SCENES: Record<SceneId, SceneDefinition> = {
  'night-sky': {
    label: 'Night sky',
    hasTour: true,
    hasGroups: false,
    slotCount: 18,
    hint: 'Move the mouse to look around · Click a photo to bring it closer',
    Component: lazy(LOADERS['night-sky']),
  },
  gallery: {
    label: 'Gallery',
    hasTour: false,
    hasGroups: false,
    slotCount: 9,
    hint: 'Move the mouse to look around · Click a photo to bring it closer',
    Component: lazy(LOADERS.gallery),
  },
  table: {
    label: 'Table',
    hasTour: false,
    hasGroups: false,
    slotCount: 13,
    hint: 'Move the mouse to look around · Click a photo to bring it closer',
    Component: lazy(LOADERS.table),
  },
  growing: {
    label: 'Growing',
    hasTour: false,
    hasGroups: true,
    slotCount: 0,
    hint: 'Scroll to zoom in · Drag to look around',
    Component: lazy(LOADERS.growing),
  },
  dotfiles: {
    label: "Kaucrow's dotfiles",
    hasTour: false,
    hasGroups: false,
    slotCount: 4,
    hint: 'Click a window to focus it',
    Component: lazy(LOADERS.dotfiles),
  },
}
