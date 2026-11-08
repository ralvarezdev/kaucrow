// @ts-nocheck — a throwaway prototype, outside the app's typecheck.
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import * as THREE from 'three'
import { GRID as ARCH_GRID, ROWS as ARCH_ROWS } from '@/components/Arch/pixels'
import { Arch as ArchLogo, Crow, ThinkPad } from '@/components/sprites'

/* ------------------------------------------------------------------ data */
const NUMS = Array.from({ length: 52 }, (_, i) => i + 1).filter((n) => n !== 20 && n !== 21)
const thumb = (n: number) => `/photos/thumb/javier-${String(n).padStart(4, '0')}.webp`
const fullUrl = (n: number) => `/photos/javier-${String(n).padStart(4, '0')}.webp`

const rng =
  (a = 1) =>
  () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
const damp = (a: number, b: number, rate: number, dt: number) => a + (b - a) * (1 - Math.exp(-rate * dt))
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)
const outExpo = (t: number) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t))

const FOV = 50
const TAN = Math.tan((FOV / 2) * (Math.PI / 180))
const CELL = { w: 8.4, h: 10.5 } // overview tile, in world units; 10 × 5 of them

/** Where up to five zones sit in the sky. */
const SLOTS = [
  [-31, 13, -4],
  [2, 14, 6],
  [31, 12, -8],
  [-16, -14, 4],
  [16, -13, -6],
]
/** Fewer zones sit more centrally, so the sky never looks lopsided. */
const slotsFor = (n) =>
  ({
    2: [[-19, 4, 0], [19, 4, 2]],
    3: [[-29, 4, -2], [0, 6, 4], [29, 4, -6]],
    4: [[-19, 12, 0], [19, 12, -4], [-19, -12, 3], [19, -12, -2]],
  })[n] ?? SLOTS
const PALETTE = ['#7C8FB5', '#D9B8A8', '#A6B8A0', '#C9A27A', '#8E7FA8']

/* ---------------------------------------------------------------- renderer */
const canvas = document.getElementById('gl') as HTMLCanvasElement
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
const scene = new THREE.Scene()
scene.background = new THREE.Color('#0b0d1c')
const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 600)

const rm = document.getElementById('rm') as HTMLInputElement
rm.checked = matchMedia('(prefers-reduced-motion: reduce)').matches
const rate = (r: number) => (rm.checked ? 1000 : r)

function resize() {
  renderer.setSize(innerWidth, innerHeight, false)
  camera.aspect = innerWidth / innerHeight
  camera.updateProjectionMatrix()
}
addEventListener('resize', resize)
resize()

/* ------------------------------------------------------------------- stars */
function starField(count: number, inner: number, outer: number, size: number) {
  const r = rng(inner)
  const pos = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const rad = inner + r() * (outer - inner)
    const th = r() * Math.PI * 2
    const ph = Math.acos(2 * r() - 1)
    pos[i * 3] = rad * Math.sin(ph) * Math.cos(th)
    pos[i * 3 + 1] = rad * Math.sin(ph) * Math.sin(th) * 0.6
    pos[i * 3 + 2] = rad * Math.cos(ph) - 40
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  return new THREE.Points(
    g,
    new THREE.PointsMaterial({ color: '#ffffff', size, sizeAttenuation: true, transparent: true, opacity: 0.85, depthWrite: false }),
  )
}
const farStars = starField(3200, 120, 280, 0.9)
const nearStars = starField(500, 20, 90, 0.45)
scene.add(farStars, nearStars)

const shoot = new THREE.Mesh(
  new THREE.PlaneGeometry(14, 0.12),
  new THREE.MeshBasicMaterial({ color: '#fff4d6', transparent: true, opacity: 0, depthWrite: false }),
)
scene.add(shoot)
let shootAt = 4
let shootT = -1

/* --------------------------------------------------------------- textures */
/** A white radial glow; sprites tint it. */
function glowTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const g = c.getContext('2d')
  const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128)
  gr.addColorStop(0, 'rgba(255,255,255,1)')
  gr.addColorStop(0.45, 'rgba(255,255,255,0.33)')
  gr.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = gr
  g.fillRect(0, 0, 256, 256)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}
const GLOW = glowTexture()

/* the Arch logo, as pixel art, hangs in the middle of the sky: a landmark that is always there, and a way home */
const archTex = (() => {
  const c = document.createElement('canvas')
  c.width = ARCH_GRID.width
  c.height = ARCH_GRID.height
  const g = c.getContext('2d')
  g.fillStyle = '#1793d1'
  ARCH_ROWS.forEach((row, y) => [...row].forEach((ch, x) => ch === 'A' && g.fillRect(x, y, 1, 1)))
  const t = new THREE.CanvasTexture(c)
  t.magFilter = THREE.NearestFilter
  t.minFilter = THREE.NearestFilter
  t.colorSpace = THREE.SRGBColorSpace
  return t
})()
const archHalo = new THREE.Sprite(
  new THREE.SpriteMaterial({ map: GLOW, color: '#1793d1', transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.AdditiveBlending }),
)
archHalo.position.set(0, -1, 0)
archHalo.scale.setScalar(26)
const archStar = new THREE.Sprite(new THREE.SpriteMaterial({ map: archTex, transparent: true, depthWrite: false }))
archStar.position.set(0, -1, 2)
archStar.scale.setScalar(6.2)
scene.add(archHalo, archStar)

/* -------------------------------------------------------------------- zones */
/** The zones in play: { name, color, c (target centre), cc (centre now), count, step, spread, R }. */
let ZONES = []
const zoneState = SLOTS.map(() => {
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: GLOW, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }),
  )
  scene.add(sprite)
  const el = document.createElement('button')
  el.className = 'label'
  el.type = 'button'
  el.innerHTML = '<span></span><small></small>'
  document.getElementById('labels').appendChild(el)
  return { sprite, el, focus: 0 }
})

/* ------------------------------------------------------------------ photos */
const loader = new THREE.TextureLoader()
const photos = []
const frames = [] // raycast targets
const r = rng(7)
const avgCanvas = document.createElement('canvas')
avgCanvas.width = avgCanvas.height = 12
const avgCtx = avgCanvas.getContext('2d', { willReadFrequently: true })

function toHsl(R, G, B) {
  const c = new THREE.Color(R / 255, G / 255, B / 255)
  const o = { h: 0, s: 0, l: 0 }
  c.getHSL(o)
  return o
}

NUMS.forEach((n, i) => {
  const group = new THREE.Group()
  const border = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ color: '#7C8FB5', transparent: true, opacity: 0, depthWrite: false }),
  )
  const frame = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ color: '#f1ece0', transparent: true, toneMapped: false }),
  )
  const pic = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ color: '#7C8FB5', transparent: true, toneMapped: false }),
  )
  border.position.z = -0.004
  pic.position.z = 0.004
  group.add(border, frame, pic)
  scene.add(group)
  frame.userData.i = i
  frames.push(frame)
  const p = {
    i,
    n,
    zone: 0,
    group,
    border,
    frame,
    pic,
    hsl: null,
    w: 4.2,
    h: 5.2,
    base: new THREE.Vector3(), // where it hangs now (glides toward baseT)
    baseT: new THREE.Vector3(),
    cur: new THREE.Vector3(),
    zJit: (r() - 0.5) * 6,
    tilt: (r() - 0.5) * 0.24,
    yaw: (r() - 0.5) * 0.36,
    delay: 0,
    lift: 0,
    hover: 0,
    stagger: r() * 0.55,
  }
  photos.push(p)
  loader.load(thumb(n), (tex) => {
    tex.colorSpace = THREE.SRGBColorSpace
    const a = tex.image.width / tex.image.height
    p.w = a >= 1 ? 5.0 : 5.0 * a
    p.h = a >= 1 ? 5.0 / a : 5.0
    pic.material.map = tex
    pic.material.color.set('#ffffff')
    pic.material.needsUpdate = true
    avgCtx.drawImage(tex.image, 0, 0, 12, 12)
    const d = avgCtx.getImageData(0, 0, 12, 12).data
    let R = 0
    let G = 0
    let B = 0
    for (let k = 0; k < d.length; k += 4) {
      R += d[k]
      G += d[k + 1]
      B += d[k + 2]
    }
    const m = d.length / 4
    p.hsl = toHsl(R / m, G / m, B / m)
    p.rgb = [R / m / 255, G / m / 255, B / m / 255]
  })
})

/* ------------------------------------------------- ways to define the zones */
const MODES = {
  curated: {
    label: 'Curated tags',
    explain:
      'An optional `zone` field on each photo in seed.ts, set by friends in their pull requests. Meaningful, but it needs curation. These names are placeholders.',
  },
  colour: {
    label: 'By colour (automatic)',
    explain:
      "Grouped by each photo's own colours (k-means on its average colour). No curation, and the sky reads like nebulae of colour, but the groups carry no meaning.",
  },
  arrival: {
    label: 'By arrival order',
    explain: 'Photo numbers in batches of ten, roughly when each was added. Free, and a rough timeline at best.',
  },
  none: {
    label: 'No zones',
    explain: 'One big field and no zone zoom. The simplest; every photo is on the same level, and the lens works only on single photos.',
  },
}
let mode = 'curated'

const dist2 = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2

function hueName(h, s, l) {
  if (l < 0.3) return 'Dark tones'
  if (s < 0.2) return l > 0.6 ? 'Bright & neutral' : 'Greys'
  if (h < 0.05 || h >= 0.94) return 'Reds'
  if (h < 0.17) return 'Warm tones'
  if (h < 0.45) return 'Greens'
  if (h < 0.72) return 'Blues'
  return 'Purples'
}

function defineZones(m) {
  const N = photos.length
  if (m === 'none') return { defs: [{ name: '', color: '#f2d9a6' }], zoneOf: photos.map(() => 0) }
  if (m === 'arrival') {
    const defs = []
    const zoneOf = photos.map((_, i) => Math.floor(i / 10))
    const groups = Math.max(...zoneOf) + 1
    for (let g = 0; g < groups; g++) {
      const first = NUMS[g * 10]
      const last = NUMS[Math.min(N - 1, g * 10 + 9)]
      defs.push({ name: `Photos ${first}–${last}`, color: PALETTE[g % 5] })
    }
    return { defs, zoneOf }
  }
  if (m === 'colour') {
    // Lightness, warmth (red vs blue) and greenness of each photo's average colour, each scaled to the same spread.
    const raw = photos.map((p) => {
      const [r, g, b] = p.rgb
      return [0.299 * r + 0.587 * g + 0.114 * b, r - b, g - (r + b) / 2]
    })
    const mean = [0, 1, 2].map((a) => raw.reduce((s, q) => s + q[a], 0) / raw.length)
    const sd = [0, 1, 2].map((a) => Math.sqrt(raw.reduce((s, q) => s + (q[a] - mean[a]) ** 2, 0) / raw.length) || 1)
    const W = [1.25, 1, 0.8]
    const pts = raw.map((q) => q.map((v, a) => ((v - mean[a]) / sd[a]) * W[a]))
    // start from five photos spread along the lightness order, so no cluster begins as an outlier
    const order = pts.map((_, i) => i).sort((a, b) => pts[a][0] - pts[b][0])
    let cs = [0.1, 0.3, 0.5, 0.7, 0.9].map((q) => pts[order[Math.floor(q * (order.length - 1))]].slice())
    let assign = []
    const MIN = 5
    for (let it = 0; it < 18; it++) {
      assign = pts.map((q) => cs.reduce((b, c, k) => (dist2(q, c) < dist2(q, cs[b]) ? k : b), 0))
      cs = cs.map((c, k) => {
        const mem = pts.filter((_, i) => assign[i] === k)
        return mem.length ? [0, 1, 2].map((a) => mem.reduce((s, q) => s + q[a], 0) / mem.length) : c
      })
    }
    // a cluster too small to be a place of its own folds into its nearest neighbour
    for (let k = 0; k < cs.length; k++) {
      const members = assign.map((a, i) => (a === k ? i : -1)).filter((i) => i >= 0)
      if (members.length && members.length < MIN) {
        const near = cs.map((c, j) => [j, dist2(cs[k], c)]).filter(([j]) => j !== k && assign.includes(j)).sort((a, b) => a[1] - b[1])[0]
        if (near) for (const i of members) assign[i] = near[0]
      }
    }
    const used = [...new Set(assign)].sort((a, b) => cs[a][0] - cs[b][0]) // darkest first
    const remap = Object.fromEntries(used.map((k, i) => [k, i]))
    const seen = {}
    const defs = used.map((k) => {
      const mem = photos.filter((_, i) => assign[i] === k)
      const avg = (f) => mem.reduce((s, p) => s + f(p.rgb), 0) / mem.length
      const l = avg((c) => 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2])
      const warm = avg((c) => c[0] - c[2])
      const green = avg((c) => c[1] - (c[0] + c[2]) / 2)
      let name =
        l < 0.3 ? 'Dark tones' : l > 0.6 ? 'Bright tones' : warm > 0.07 ? 'Warm tones' : warm < -0.03 ? 'Cool tones' : green > 0.03 ? 'Green tones' : 'Neutral tones'
      seen[name] = (seen[name] || 0) + 1
      if (seen[name] > 1) name += ` ${seen[name]}`
      const base = new THREE.Color(avg((c) => c[0]), avg((c) => c[1]), avg((c) => c[2]))
      const o = { h: 0, s: 0, l: 0 }
      base.getHSL(o)
      const col = new THREE.Color().setHSL(o.h, clamp(o.s * 1.8 + 0.12, 0.3, 0.7), clamp(o.l * 0.6 + 0.4, 0.5, 0.72))
      return { name, color: `#${col.getHexString()}` }
    })
    return { defs, zoneOf: assign.map((k) => remap[k]) }
  }
  // curated (placeholder tags)
  return { defs: PALETTE.map((color, i) => ({ name: `Zone ${i + 1}`, color })), zoneOf: photos.map((_, i) => i % 5) }
}

function applyMode(m, instant) {
  // the colour grouping needs every thumbnail's average colour first
  if (m === 'colour' && !photos.every((p) => p.hsl)) {
    setTimeout(() => applyMode(m, instant), 250)
    return
  }
  mode = m
  const { defs, zoneOf } = defineZones(m)
  const single = defs.length === 1
  const old = ZONES
  const slots = slotsFor(defs.length)
  ZONES = defs.map((d, i) => {
    const c = single ? [0, 0, 0] : slots[i]
    return { ...d, c, cc: old[i] ? old[i].cc : [...c], count: 0, step: 3.5, spread: 1.38, R: 12 }
  })
  photos.forEach((p, i) => {
    p.zone = zoneOf[i]
    ZONES[p.zone].count++
  })
  ZONES.forEach((z) => {
    z.step = single ? 3.4 : Math.min(3.5, 11 / Math.sqrt(z.count))
    z.spread = single ? 1 : Math.max(1.38, 3.9 / z.step)
    z.R = z.step * z.spread * Math.sqrt(z.count + 0.6) * 1.15 + 3
  })
  const k = ZONES.map(() => 0)
  photos.forEach((p) => {
    const z = ZONES[p.zone]
    const j = k[p.zone]++
    const ang = j * 2.39996 + p.zone
    const rad = z.step * Math.sqrt(j + 0.6)
    p.baseT.set(z.c[0] + Math.cos(ang) * rad * 1.15, z.c[1] + Math.sin(ang) * rad * 0.85, z.c[2] + p.zJit)
    if (instant || p.base.lengthSq() === 0) p.base.copy(p.baseT)
    p.border.material.color.set(z.color)
  })
  zoneState.forEach((zs, i) => {
    const z = ZONES[i]
    if (z) {
      zs.sprite.material.color.set(z.color)
      zs.el.firstChild.textContent = z.name
      zs.el.lastChild.textContent = `${z.count} photos`
    }
  })
  tour.on = false
  state.zone = -1
  state.selected = -1
  planRoute()
  setTargets()
  rebuildChips()
  syncTour()
  document.getElementById('explain').textContent = MODES[m].explain
  for (const b of document.querySelectorAll('#modes button')) b.classList.toggle('on', b.dataset.m === m)
}

/* ------------------------------------------------------------------- state */
const state = { zone: -1, selected: -1, grid: 0, gridOn: false, gridActive: 24, intro: 0, hovered: -1 }
const rig = { T: new THREE.Vector3(0, 0, 0), D: 150, Tt: new THREE.Vector3(0, 0, 0), Dt: 66 }
const pointer = new THREE.Vector2(0, 0)
let zoomBias = 1

const viewFit = (w: number, h: number, pad: number) => {
  const dw = (w * pad) / (2 * TAN * camera.aspect)
  const dh = (h * pad) / (2 * TAN)
  return Math.max(dw, dh)
}
const overviewD = () => (ZONES.length === 1 ? viewFit(62, 46, 1.15) : viewFit(88, 60, 1.18))
const gridD = () => viewFit(CELL.w * 10, CELL.h * 5, 1.26)

function setTargets() {
  if (state.gridOn) {
    rig.Tt.set(0, -1.8, 0)
    rig.Dt = gridD()
  } else if (state.selected >= 0) {
    rig.Tt.copy(photos[state.selected].cur)
    rig.Dt = 21
  } else if (state.zone >= 0) {
    const z = ZONES[state.zone]
    rig.Tt.set(z.c[0], z.c[1] + 1.5, z.c[2])
    rig.Dt = viewFit(z.R * 2.3, z.R * 2.0, 1.0) * zoomBias
  } else {
    rig.Tt.set(0, ZONES.length === 1 ? 0 : 6, 0)
    rig.Dt = overviewD() * zoomBias
  }
}

/* trail: a dashed line that draws from the previous focus to the next */
const trailGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()])
const trail = new THREE.Line(
  trailGeo,
  new THREE.LineDashedMaterial({ color: '#f2d9a6', dashSize: 0.5, gapSize: 0.7, transparent: true, opacity: 0, depthWrite: false }),
)
scene.add(trail)
let trailAge = 99
const trailFrom = new THREE.Vector3()
const trailTo = new THREE.Vector3()
function startTrail(from: THREE.Vector3, to: THREE.Vector3) {
  trailFrom.copy(from)
  trailTo.copy(to)
  trailAge = 0
}

/* the route: a faint dashed itinerary from the Arch star through every zone, brighter while the journey runs */
const routeGeo = new THREE.BufferGeometry()
const route = new THREE.Line(
  routeGeo,
  new THREE.LineDashedMaterial({ color: '#f2d9a6', dashSize: 0.9, gapSize: 1.3, transparent: true, opacity: 0, depthWrite: false }),
)
scene.add(route)
/** Zones in the order a traveller would visit them: always the nearest one not yet seen, starting from home. */
let routeOrder = []
function planRoute() {
  const left = ZONES.map((_, i) => i)
  const at = [0, -1]
  routeOrder = []
  while (left.length) {
    left.sort((a, b) => Math.hypot(ZONES[a].c[0] - at[0], ZONES[a].c[1] - at[1]) - Math.hypot(ZONES[b].c[0] - at[0], ZONES[b].c[1] - at[1]))
    const next = left.shift()
    routeOrder.push(next)
    at[0] = ZONES[next].c[0]
    at[1] = ZONES[next].c[1]
  }
  const pts = [new THREE.Vector3(0, -1, 0), ...routeOrder.map((i) => new THREE.Vector3(ZONES[i].c[0], ZONES[i].c[1], ZONES[i].c[2] - 1))]
  routeGeo.setFromPoints(pts)
  route.computeLineDistances()
  route.visible = ZONES.length > 1
}

/* ---------------------------------------------------------------- the journey */
/** A guided flight: the camera visits each zone in turn and lingers on a few photos, until the visitor takes over. */
const tour = { on: false, k: 0, t: 0, steps: [] }
const tourBtn = document.getElementById('tour')
function buildTour() {
  const steps = []
  const order = ZONES.length > 1 ? routeOrder : [0]
  for (const zi of order) {
    if (ZONES.length > 1) steps.push({ zone: zi, hold: 2.6 })
    const mem = photos.filter((p) => p.zone === zi)
    const picks = [0, Math.floor(mem.length / 2), mem.length - 1].filter((v, i, a) => mem[v] && a.indexOf(v) === i)
    for (const j of picks) steps.push({ photo: mem[j].i, hold: 2.8 })
  }
  steps.push({ home: true, hold: 2 })
  return steps
}
function goStep(k) {
  const s = tour.steps[k]
  tour.k = k
  tour.t = 0
  if (s.home) {
    select(-1)
    focusZone(-1)
  } else if (s.zone !== undefined) focusZone(s.zone)
  else select(s.photo)
  syncTour()
}
function startTour() {
  if (state.gridOn) setGrid(false)
  lb.classList.remove('open')
  tour.steps = buildTour()
  tour.on = true
  select(-1)
  focusZone(-1)
  goStep(0)
}
function stopTour() {
  if (!tour.on) return
  tour.on = false
  syncTour()
}
function syncTour() {
  tourBtn.classList.toggle('on', tour.on)
  tourBtn.textContent = tour.on ? `❚❚ ${tour.k + 1}/${tour.steps.length}` : '▶ Journey'
}
tourBtn.onclick = () => (tour.on ? stopTour() : startTour())

/* ------------------------------------------------------------------ actions */
const chips = document.getElementById('chips')
let chipEls = []
function addChip(label, color, onClick) {
  const b = document.createElement('button')
  b.className = 'chip'
  b.type = 'button'
  b.innerHTML = color ? `<i style="--c:${color}"></i>${label}` : label
  b.onclick = () => {
    stopTour()
    onClick()
  }
  chips.appendChild(b)
  chipEls.push(b)
}
function rebuildChips() {
  chips.innerHTML = ''
  chipEls = []
  if (ZONES.length > 1) {
    addChip('Everyone', null, () => focusZone(-1))
    ZONES.forEach((z, i) => addChip(z.name, z.color, () => focusZone(i)))
  }
  syncChips()
}
function syncChips() {
  chipEls.forEach((b, i) => b.classList.toggle('on', i === state.zone + 1))
}
function focusZone(i: number) {
  if (i >= ZONES.length || (ZONES.length === 1 && i >= 0)) return
  if (state.gridOn) setGrid(false)
  state.selected = -1
  state.zone = i
  setTargets()
  syncChips()
}
function select(i: number) {
  if (i < 0) {
    state.selected = -1
    setTargets()
    return
  }
  const prev = state.selected >= 0 ? photos[state.selected].cur : new THREE.Vector3(...ZONES[photos[i].zone].c)
  startTrail(prev, photos[i].cur)
  state.selected = i
  setTargets()
}
function setGrid(on: boolean) {
  if (on) stopTour()
  state.gridOn = on
  if (on) {
    state.selected = -1
    state.gridActive = clamp(state.gridActive, 0, photos.length - 1)
  }
  document.body.classList.toggle('grid', on)
  document.getElementById('laptop').classList.toggle('on', on)
  document.getElementById('laptoplbl').textContent = on ? 'back to the sky' : 'overview'
  setTargets()
}
const lb = document.getElementById('lb')
const lbImg = lb.querySelector('img')
function openPhoto(i: number) {
  lbImg.src = fullUrl(photos[i].n)
  lb.classList.add('open')
}
lb.onclick = () => lb.classList.remove('open')
document.getElementById('laptop').onclick = () => setGrid(!state.gridOn)
document.getElementById('archbtn').onclick = () => {
  stopTour()
  if (state.gridOn) setGrid(false)
  select(-1)
  focusZone(-1)
}
zoneState.forEach((zs, i) => {
  zs.el.onclick = () => {
    stopTour()
    focusZone(state.zone === i ? -1 : i)
  }
})

const modesEl = document.getElementById('modes')
for (const [key, m] of Object.entries(MODES)) {
  const b = document.createElement('button')
  b.type = 'button'
  b.dataset.m = key
  b.textContent = m.label
  b.onclick = () => applyMode(key, false)
  modesEl.appendChild(b)
}

/* ------------------------------------------------------------------ pointer */
const ray = new THREE.Raycaster()
let down = null
let moved = 0
canvas.addEventListener('pointerdown', (e) => {
  stopTour()
  down = { x: e.clientX, y: e.clientY, tx: rig.Tt.x, ty: rig.Tt.y }
  moved = 0
})
addEventListener('pointerup', () => {
  down = null
})
addEventListener('pointermove', (e) => {
  pointer.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1)
  if (down && !state.gridOn && state.selected < 0) {
    const dx = e.clientX - down.x
    const dy = e.clientY - down.y
    moved = Math.max(moved, Math.hypot(dx, dy))
    const k = (2 * TAN * rig.D) / innerHeight
    rig.Tt.x = down.tx - dx * k
    rig.Tt.y = down.ty + dy * k
  } else if (down) moved = Math.max(moved, Math.hypot(e.clientX - down.x, e.clientY - down.y))
  const hit = pick()
  state.hovered = hit
  if (state.gridOn && hit >= 0) state.gridActive = hit
  ray.setFromCamera(pointer, camera)
  const onArch = hit < 0 && !state.gridOn && ray.intersectObject(archStar).length > 0
  canvas.style.cursor = hit >= 0 || onArch ? 'pointer' : down ? 'grabbing' : 'grab'
})
function pick(): number {
  ray.setFromCamera(pointer, camera)
  const hits = ray.intersectObjects(frames, false)
  return hits.length ? hits[0].object.userData.i : -1
}
canvas.addEventListener(
  'wheel',
  (e) => {
    e.preventDefault()
    stopTour()
    if (state.gridOn || state.selected >= 0) return
    zoomBias = clamp(zoomBias * Math.exp(e.deltaY * 0.0012), 0.35, 1.6)
    setTargets()
  },
  { passive: false },
)
canvas.addEventListener('click', () => {
  if (moved > 5) return
  const hit = pick()
  if (state.gridOn) {
    if (hit >= 0) openPhoto(hit)
    return
  }
  ray.setFromCamera(pointer, camera)
  if (hit < 0 && ray.intersectObject(archStar).length) {
    if (state.selected >= 0) select(-1)
    focusZone(-1)
    return
  }
  if (hit < 0) {
    if (state.selected >= 0) select(-1)
    else if (state.zone >= 0) focusZone(-1)
    return
  }
  const p = photos[hit]
  if (ZONES.length > 1 && state.zone !== p.zone) focusZone(p.zone)
  else if (state.selected !== hit) select(hit)
  else openPhoto(hit)
})
addEventListener('keydown', (e) => {
  if (e.key === ' ' && e.target === document.body) {
    e.preventDefault()
    tour.on ? stopTour() : startTour()
    return
  }
  if (e.key !== ' ' && e.key !== 'Shift') stopTour()
  if (lb.classList.contains('open')) {
    if (e.key === 'Escape') lb.classList.remove('open')
    return
  }
  if (e.key === 'Escape') {
    if (state.gridOn) setGrid(false)
    else if (state.selected >= 0) select(-1)
    else if (state.zone >= 0) focusZone(-1)
  } else if (e.key === 'g' || e.key === 'G') setGrid(!state.gridOn)
  else if (/^[1-5]$/.test(e.key)) focusZone(+e.key - 1)
  else if (state.gridOn) {
    const m = { ArrowRight: 1, l: 1, ArrowLeft: -1, h: -1, ArrowDown: 10, j: 10, ArrowUp: -10, k: -10 }[e.key]
    if (m) {
      e.preventDefault()
      state.gridActive = clamp(state.gridActive + m, 0, photos.length - 1)
    } else if (e.key === 'Enter') openPhoto(state.gridActive)
  }
})

/* ----------------------------------------------------------- the sprites */
createRoot(document.getElementById('crow')).render(createElement(Crow, { size: 96, plate: 'none' }))
createRoot(document.getElementById('laptopsvg')).render(createElement(ThinkPad, { size: 86 }))
createRoot(document.getElementById('archsvg')).render(createElement(ArchLogo, { size: 45 }))
document.getElementById('hud').addEventListener('pointerdown', () => document.getElementById('hint').classList.add('gone'), { once: true })

/* ------------------------------------------------------------------- frame */
const tmp = new THREE.Vector3()
const gridTarget = new THREE.Vector3()
const clock = new THREE.Clock()
const PAPER = new THREE.Color('#f1ece0')
const TILE = new THREE.Color('#191c1d')
const ACTIVE = new THREE.Color('#92d0e3')
let time = 0
let anyFocus = 0

function frame() {
  const dt = Math.min(clock.getDelta(), 0.05)
  time += dt
  state.intro = rm.checked ? 1 : clamp(state.intro + dt / 2.2, 0, 1)

  // camera rig
  const rr = rate(3.2)
  rig.T.x = damp(rig.T.x, rig.Tt.x, rr, dt)
  rig.T.y = damp(rig.T.y, rig.Tt.y, rr, dt)
  rig.T.z = damp(rig.T.z, rig.Tt.z, rr, dt)
  const introD = rm.checked ? 0 : (1 - outExpo(state.intro)) * 70
  rig.D = damp(rig.D, rig.Dt, rate(2.6), dt)
  const par = rm.checked || state.gridOn ? 0 : 1
  camera.position.set(rig.T.x + pointer.x * 2.2 * par, rig.T.y + pointer.y * 1.5 * par, rig.T.z + rig.D + introD)
  camera.lookAt(rig.T.x, rig.T.y, rig.T.z)

  // the journey
  if (tour.on) {
    tour.t += dt
    if (tour.t > tour.steps[tour.k].hold) {
      if (tour.k + 1 < tour.steps.length) goStep(tour.k + 1)
      else stopTour()
    }
  }
  route.material.opacity = rm.checked ? 0.18 : damp(route.material.opacity, (tour.on ? 0.55 : 0.2) * (1 - ease(state.grid)) * clamp(state.intro * 2, 0, 1), 3, dt)

  // grid morph (linear time, eased per photo)
  const gTarget = state.gridOn ? 1 : 0
  state.grid = rm.checked ? gTarget : clamp(state.grid + (Math.sign(gTarget - state.grid) * dt) / 1.5, 0, 1)

  const inSky = 1 - ease(state.grid)
  zoneState.forEach((zs, i) => {
    zs.focus = damp(zs.focus, ZONES[i] && state.zone === i && !state.gridOn ? 1 : 0, rate(3), dt)
  })
  anyFocus = damp(anyFocus, state.zone >= 0 && !state.gridOn ? 1 : 0, rate(3), dt)
  for (const z of ZONES) for (let a = 0; a < 3; a++) z.cc[a] = damp(z.cc[a], z.c[a], rate(2.2), dt)

  for (const p of photos) {
    const z = ZONES[p.zone]
    if (!z) continue
    const zs = zoneState[p.zone]
    const f = zs.focus
    const dim = anyFocus * (1 - f)
    p.base.x = damp(p.base.x, p.baseT.x, rate(2.2), dt)
    p.base.y = damp(p.base.y, p.baseT.y, rate(2.2), dt)
    p.base.z = damp(p.base.z, p.baseT.z, rate(2.2), dt)
    p.delay = Math.hypot(p.base.x, p.base.y) * 0.012

    const spread = 1 + (z.spread - 1) * f
    p.cur.set(
      z.cc[0] + (p.base.x - z.cc[0]) * spread,
      z.cc[1] + (p.base.y - z.cc[1]) * spread,
      z.cc[2] + (p.base.z - z.cc[2]) * (1 + 0.2 * f),
    )
    const sel = state.selected === p.i
    p.hover = damp(p.hover, state.hovered === p.i && !state.gridOn ? 1 : 0, rate(9), dt)
    p.lift = damp(p.lift, sel ? 1 : 0, rate(5), dt)
    let s = (1 + 0.5 * f) * (1 - 0.22 * dim) * (1 + 0.04 * p.hover) * (1 + 0.55 * p.lift)
    let opacity = (0.78 + clamp((p.base.z + 14) / 24, 0, 1) * 0.22) * (1 - 0.72 * dim)
    const zLift = 0.9 * p.hover + 2.2 * p.lift
    const bob = rm.checked ? 0 : Math.sin(time * 0.5 + p.i * 1.7) * 0.18 * inSky

    // entrance: drift up out of the depth, centre first
    const e = outExpo(clamp((state.intro * 2.2 - 0.25 - p.delay) / 1.0, 0, 1))
    opacity *= clamp(e * 2.2, 0, 1)
    s *= 0.78 + 0.22 * e

    // grid pose
    gridTarget.set(((p.i % 10) - 4.5) * CELL.w, (2 - Math.floor(p.i / 10)) * CELL.h, 0)
    const gi = ease(clamp((state.grid * 1.55 - p.stagger) / 1, 0, 1))
    const arc = Math.sin(gi * Math.PI) * 9

    tmp.copy(p.cur)
    tmp.y += bob - 0.9 * (1 - e)
    tmp.z += zLift
    p.group.position.lerpVectors(tmp, gridTarget, gi)
    p.group.position.z += arc
    p.group.rotation.set(0, p.yaw * (1 - gi), p.tilt * (1 - gi) * (sel ? 0 : 1))

    // size: fit the photo (and its mat) to a tile in the grid
    const sGrid = Math.min((CELL.w - 0.9) / p.w, (CELL.h - 0.9) / p.h)
    p.group.scale.setScalar(THREE.MathUtils.lerp(s, sGrid, gi))
    p.pic.scale.set(p.w, p.h, 1)
    p.frame.scale.set(
      THREE.MathUtils.lerp(p.w + 0.36, (CELL.w - 0.5) / sGrid, gi),
      THREE.MathUtils.lerp(p.h + 0.36, (CELL.h - 0.5) / sGrid, gi),
      1,
    )
    p.border.scale.set((CELL.w - 0.5 + 0.34) / sGrid, (CELL.h - 0.5 + 0.34) / sGrid, 1)

    // paper in the sky, a dark tile in the grid, a coloured border on the active tile
    const active = state.gridOn && state.gridActive === p.i
    p.frame.material.color.lerpColors(PAPER, TILE, gi)
    p.border.material.color.set(active ? ACTIVE : z.color)
    p.border.material.opacity = gi * (active ? 1 : 0.35)
    p.pic.material.opacity = opacity
    p.frame.material.opacity = opacity
    if (p.pic.material.map) p.pic.material.color.setScalar(THREE.MathUtils.lerp(1, state.gridOn ? (active ? 1 : 0.72) : 1, gi))
    else p.pic.material.color.set(z.color)
    p.group.visible = opacity > 0.01
  }

  // zone glows + labels
  zoneState.forEach((zs, i) => {
    const z = ZONES[i]
    if (!z) {
      zs.sprite.material.opacity = 0
      zs.el.style.opacity = 0
      zs.el.style.pointerEvents = 'none'
      return
    }
    const f = zs.focus
    zs.sprite.position.set(z.cc[0], z.cc[1], z.cc[2] - 3)
    zs.sprite.material.opacity =
      (0.36 + 0.34 * f) * (1 - 0.7 * anyFocus * (1 - f)) * inSky * clamp(state.intro * 2, 0, 1) * (ZONES.length === 1 ? 0.6 : 1)
    zs.sprite.scale.setScalar(z.R * 1.6 + 14 * f)
    tmp.set(z.cc[0], z.cc[1] + z.R * 0.62 + 5 * f, z.cc[2]).project(camera)
    zs.el.style.left = `${(tmp.x * 0.5 + 0.5) * innerWidth}px`
    zs.el.style.top = `${(-tmp.y * 0.5 + 0.5) * innerHeight}px`
    const hidden = state.gridOn || ZONES.length === 1
    zs.el.style.opacity = hidden ? 0 : (state.zone < 0 ? 0.9 : f > 0.5 ? 1 : 0.25) * clamp(state.intro * 2 - 0.6, 0, 1)
    zs.el.style.pointerEvents = hidden ? 'none' : 'auto'
  })

  // the Arch star
  const star = (1 - ease(state.grid)) * clamp(state.intro * 2, 0, 1)
  archStar.material.opacity = star
  archHalo.material.opacity = (0.34 + 0.14 * Math.sin(time * 1.3)) * star * (1 - 0.6 * anyFocus)
  archStar.scale.setScalar(6.2 * (1 + 0.025 * Math.sin(time * 1.3)))

  // trail
  if (trailAge < 3) {
    trailAge += dt
    const p = outExpo(clamp(trailAge / 0.8, 0, 1))
    const fade = clamp((trailAge - 1.4) / 1.4, 0, 1)
    const pos = trailGeo.attributes.position
    pos.setXYZ(0, trailFrom.x, trailFrom.y, trailFrom.z + 0.2)
    pos.setXYZ(
      1,
      trailFrom.x + (trailTo.x - trailFrom.x) * p,
      trailFrom.y + (trailTo.y - trailFrom.y) * p,
      trailFrom.z + (trailTo.z - trailFrom.z) * p + 0.2,
    )
    pos.needsUpdate = true
    trail.computeLineDistances()
    trail.material.opacity = rm.checked ? 0 : 0.7 * (1 - fade)
  } else trail.material.opacity = 0

  // track the selected photo as the lens settles
  if (state.selected >= 0 && !state.gridOn) rig.Tt.copy(photos[state.selected].cur)

  farStars.rotation.y = rm.checked ? 0 : time * 0.004
  nearStars.position.x = -rig.T.x * 0.12
  nearStars.position.y = -rig.T.y * 0.12
  document.getElementById('barpos').textContent = `${state.gridActive + 1}/${photos.length}`
  if (!rm.checked) {
    shootAt -= dt
    if (shootAt < 0 && shootT < 0) {
      shootT = 0
      shootAt = 7 + Math.random() * 8
      shoot.position.set(rig.T.x + (Math.random() - 0.5) * 60, rig.T.y + 25 + Math.random() * 15, rig.T.z - 90)
      shoot.rotation.z = -0.35
    }
    if (shootT >= 0) {
      shootT += dt
      shoot.position.x += dt * 70
      shoot.position.y -= dt * 24
      shoot.material.opacity = Math.sin(clamp(shootT / 0.9, 0, 1) * Math.PI) * 0.8
      if (shootT > 0.9) {
        shootT = -1
        shoot.material.opacity = 0
      }
    }
  }

  renderer.render(scene, camera)
  requestAnimationFrame(frame)
}

applyMode('curated', true)
rig.D = 150
requestAnimationFrame(frame)

// handles for tests and for poking at it from the console
window.cosmos = {
  focusZone,
  select,
  setGrid,
  applyMode,
  state,
  photos,
  get zones() {
    return ZONES
  },
}
