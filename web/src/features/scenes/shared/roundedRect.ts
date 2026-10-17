import { BufferAttribute, type BufferGeometry, PlaneGeometry, Shape, ShapeGeometry } from 'three'

/**
 * A w×h rectangle centred on the origin with rounded corners, with UVs that span
 * the whole rectangle so a texture fits it like it would a plane. The radius is
 * capped at half the shorter side; 0 gives a plain plane.
 */
export function roundedRectGeometry(w: number, h: number, radius: number): BufferGeometry {
  const r = Math.min(Math.max(radius, 0), w / 2, h / 2)
  if (r === 0) return new PlaneGeometry(w, h)

  const x = -w / 2
  const y = -h / 2
  const shape = new Shape()
  shape.moveTo(x + r, y)
  shape.lineTo(x + w - r, y)
  shape.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false)
  shape.lineTo(x + w, y + h - r)
  shape.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false)
  shape.lineTo(x + r, y + h)
  shape.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false)
  shape.lineTo(x, y + r)
  shape.absarc(x + r, y + r, r, Math.PI, (Math.PI * 3) / 2, false)

  const geometry = new ShapeGeometry(shape, 8)
  const position = geometry.getAttribute('position')
  const uv = new Float32Array(position.count * 2)
  for (let i = 0; i < position.count; i++) {
    uv[i * 2] = (position.getX(i) - x) / w
    uv[i * 2 + 1] = (position.getY(i) - y) / h
  }
  geometry.setAttribute('uv', new BufferAttribute(uv, 2))
  return geometry
}
