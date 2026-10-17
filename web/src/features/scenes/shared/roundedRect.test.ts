import { PlaneGeometry } from 'three'
import { describe, expect, it } from 'vitest'
import { roundedRectGeometry } from './roundedRect'

const uvRange = (g: ReturnType<typeof roundedRectGeometry>) => {
  const uv = g.getAttribute('uv')
  const us = Array.from({ length: uv.count }, (_, i) => uv.getX(i))
  const vs = Array.from({ length: uv.count }, (_, i) => uv.getY(i))
  return { u: [Math.min(...us), Math.max(...us)], v: [Math.min(...vs), Math.max(...vs)] }
}

describe('roundedRectGeometry', () => {
  it('is a plain plane with no radius', () => {
    expect(roundedRectGeometry(2, 1, 0)).toBeInstanceOf(PlaneGeometry)
  })

  it('stays inside its box and maps its UVs onto 0..1', () => {
    const g = roundedRectGeometry(4, 2, 0.5)
    g.computeBoundingBox()
    expect(g.boundingBox?.min.x).toBeCloseTo(-2)
    expect(g.boundingBox?.max.y).toBeCloseTo(1)
    const { u, v } = uvRange(g)
    expect(u[0]).toBeCloseTo(0)
    expect(u[1]).toBeCloseTo(1)
    expect(v[0]).toBeCloseTo(0)
    expect(v[1]).toBeCloseTo(1)
  })

  it('cuts the corners: no vertex sits on the box corner', () => {
    const g = roundedRectGeometry(4, 2, 0.5)
    const p = g.getAttribute('position')
    const corners = Array.from({ length: p.count }, (_, i) => [p.getX(i), p.getY(i)]).filter(
      ([x, y]) =>
        Math.abs(Math.abs(x as number) - 2) < 1e-6 && Math.abs(Math.abs(y as number) - 1) < 1e-6,
    )
    expect(corners).toHaveLength(0)
  })

  it('caps the radius at half the shorter side', () => {
    const g = roundedRectGeometry(4, 2, 99)
    g.computeBoundingBox()
    expect(g.boundingBox?.max.x).toBeCloseTo(2)
    expect(g.boundingBox?.max.y).toBeCloseTo(1)
  })
})
