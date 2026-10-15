import type { ComponentType } from 'react'
import { lazy } from 'react'
import type { SceneId } from './ids'

export type SceneDefinition = {
  label: string
  /** Shows the prev/next controls beside the focus frame. */
  hasTour: boolean
  /** Number of photo slots the layout can show at once. */
  slotCount: number
  Component: ComponentType
}

export const SCENES: Record<SceneId, SceneDefinition> = {
  'night-sky': {
    label: 'Night sky',
    hasTour: true,
    slotCount: 18,
    Component: lazy(() => import('./night-sky/NightSky').then((m) => ({ default: m.NightSky }))),
  },
  gallery: {
    label: 'Gallery',
    hasTour: false,
    slotCount: 9,
    Component: lazy(() => import('./gallery/Gallery').then((m) => ({ default: m.Gallery }))),
  },
  table: {
    label: 'Table',
    hasTour: false,
    slotCount: 13,
    Component: lazy(() => import('./table/Table').then((m) => ({ default: m.Table }))),
  },
}
