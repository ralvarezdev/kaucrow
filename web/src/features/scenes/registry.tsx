import type { ComponentType } from 'react'
import { lazy } from 'react'
import type { SceneId } from './ids'

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
    Component: lazy(() => import('./night-sky/NightSky').then((m) => ({ default: m.NightSky }))),
  },
  gallery: {
    label: 'Gallery',
    hasTour: false,
    hasGroups: false,
    slotCount: 9,
    hint: 'Move the mouse to look around · Click a photo to bring it closer',
    Component: lazy(() => import('./gallery/Gallery').then((m) => ({ default: m.Gallery }))),
  },
  table: {
    label: 'Table',
    hasTour: false,
    hasGroups: false,
    slotCount: 13,
    hint: 'Move the mouse to look around · Click a photo to bring it closer',
    Component: lazy(() => import('./table/Table').then((m) => ({ default: m.Table }))),
  },
  growing: {
    label: 'Growing',
    hasTour: false,
    hasGroups: true,
    slotCount: 0,
    hint: 'Scroll to zoom in · Drag to look around',
    Component: lazy(() => import('./growing/Growing').then((m) => ({ default: m.Growing }))),
  },
  dotfiles: {
    label: "Kaucrow's dotfiles",
    hasTour: false,
    hasGroups: false,
    slotCount: 4,
    hint: 'Click a window to focus it',
    Component: lazy(() => import('./dotfiles/Dotfiles').then((m) => ({ default: m.Dotfiles }))),
  },
}
