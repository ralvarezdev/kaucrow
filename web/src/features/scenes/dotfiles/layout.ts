import type { PxRect } from '../shared/units'

/** Hyprland's `gaps_in`. Tiles are laid out like a dwindle layout: one master, then a halving stack. */
const GAP = 10

const TOP = 150
const BOTTOM = 630
const LEFT = 40
const RIGHT = 1240
const MID = (LEFT + RIGHT) / 2

const stackX = MID + GAP / 2
const stackW = RIGHT - stackX
const rowH = (BOTTOM - TOP - GAP) / 2
const lowerY = TOP + rowH + GAP
const colW = (stackW - GAP) / 2
const smallH = (rowH - GAP) / 2

/** The active window: the photo currently in focus. */
export const DOTFILES_FOCUS: PxRect = {
  x: LEFT,
  y: TOP,
  width: MID - GAP / 2 - LEFT,
  height: BOTTOM - TOP,
}

/** The four inactive windows, in slot order. */
export const DOTFILES_SLOTS: readonly PxRect[] = [
  { x: stackX, y: TOP, width: stackW, height: rowH },
  { x: stackX, y: lowerY, width: colW, height: rowH },
  { x: stackX + colW + GAP, y: lowerY, width: colW, height: smallH },
  { x: stackX + colW + GAP, y: lowerY + smallH + GAP, width: colW, height: smallH },
]

/** Palette from kaucrow/dotfiles (matugen output used by kitty and waybar). */
export const DOTFILES_COLORS = {
  background: '#111415',
  active: '#92d0e3',
  inactive: '#373a3b',
} as const
