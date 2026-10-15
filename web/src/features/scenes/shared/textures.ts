import { useEffect, useMemo } from 'react'
import { CanvasTexture, SRGBColorSpace } from 'three'

export type Paint = (ctx: CanvasRenderingContext2D, width: number, height: number) => void

/** Linear gradient painter. `along: 'x'` runs left→right, `'y'` top→bottom. */
export const linear =
  (along: 'x' | 'y', stops: ReadonlyArray<readonly [number, string]>): Paint =>
  (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, along === 'x' ? w : 0, along === 'y' ? h : 0)
    for (const [at, color] of stops) g.addColorStop(at, color)
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)
  }

/** Radial gradient painter centred at (cx, cy) as fractions of the canvas. */
export const radial =
  (cx: number, cy: number, stops: ReadonlyArray<readonly [number, string]>): Paint =>
  (ctx, w, h) => {
    const g = ctx.createRadialGradient(w * cx, h * cy, 0, w * cx, h * cy, Math.max(w, h) / 2)
    for (const [at, color] of stops) g.addColorStop(at, color)
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)
  }

/** Compose painters back to front. */
export const layers =
  (...painters: Paint[]): Paint =>
  (ctx, w, h) => {
    for (const paint of painters) paint(ctx, w, h)
  }

/** Build a canvas texture once per `paint` (keep it module-level) and dispose on unmount. */
export function usePaintedTexture(paint: Paint, width = 256, height = 256): CanvasTexture {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('2D canvas is not available')
    paint(ctx, width, height)
    const t = new CanvasTexture(canvas)
    t.colorSpace = SRGBColorSpace
    return t
  }, [paint, width, height])

  useEffect(() => () => texture.dispose(), [texture])
  return texture
}
