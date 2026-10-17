import { useMemo } from 'react'
import { type Paint, usePaintedTexture } from './textures'
import { toWorld } from './units'

const BLUR_RESOLUTION = 2

export function BlurredCard({
  width,
  height,
  border,
  borderColor,
  paper,
  blur,
  opacity,
}: {
  width: number
  height: number
  border: number
  borderColor: string
  paper: string
  blur: number
  opacity: number
}) {
  // Padding so the blur isn't clipped at the card edge.
  const pad = Math.ceil(blur * 3)
  const cardW = width + pad * 2
  const cardH = height + pad * 2

  const paint = useMemo<Paint>(
    () => (ctx, canvasW) => {
      const s = canvasW / cardW
      ctx.scale(s, s)
      // Safari < 18 ignores ctx.filter and simply draws the card sharp.
      ctx.filter = `blur(${blur}px)`
      if (border > 0) {
        ctx.fillStyle = borderColor
        ctx.fillRect(pad, pad, width, height)
      }
      ctx.fillStyle = paper
      ctx.fillRect(pad + border, pad + border, width - border * 2, height - border * 2)
    },
    [cardW, pad, blur, border, borderColor, paper, width, height],
  )

  const texture = usePaintedTexture(paint, cardW * BLUR_RESOLUTION, cardH * BLUR_RESOLUTION)

  return (
    <mesh>
      <planeGeometry args={[toWorld(cardW), toWorld(cardH)]} />
      <meshBasicMaterial map={texture} transparent opacity={opacity} toneMapped={false} />
    </mesh>
  )
}
