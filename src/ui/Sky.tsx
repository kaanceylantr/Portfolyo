import { useMemo } from 'react'
import { useCanvas } from '../engine/useCanvas'
import { scroll } from '../engine/scroll'
import { lite, reducedMotion } from '../engine/perf'

const SPARK: Record<string, string[]> = {
  space: ['255,255,255', '160,210,250', '170,240,225'],
  crystal: ['255,255,255', '180,196,255', '150,225,255', '255,205,238'],
}
const LEAF = ['111,196,106', '79,179,95', '245,184,42', '255,143,61']

function seeded(i: number) {
  const a = Math.sin(i * 12.9898) * 43758.5453
  const b = Math.sin(i * 78.233) * 12345.6789
  const f = (v: number) => v - Math.floor(v)
  return { a: f(a), b: f(b), c: f(a * b), d: f(a * 7.7) }
}

/** World-aware particles: sparkles (space, crystal), embers (obsidian), drifting leaves (village). */
export function Sky() {
  const items = useMemo(
    () =>
      Array.from({ length: lite ? 36 : 84 }, (_, i) => {
        const r = seeded(i)
        return { x: r.a, y: r.b, z: 0.15 + r.c * 0.85, s: 1.2 + r.b * 3.2, p: r.d * 6.28, v: 0.02 + r.c * 0.05, k: i }
      }),
    [],
  )

  const ref = useCanvas((ctx, w, h, t) => {
    const world = document.documentElement.dataset.world ?? 'space'

    if (world === 'obsidian') {
      for (const e of items) {
        const life = (t * e.v * 2 + e.p) % 1
        const x = e.x * w + Math.sin(t * 0.8 + e.p) * 22 * life
        const y = h + 20 - life * (h + 60)
        const a = Math.sin(life * Math.PI) * 0.9
        ctx.fillStyle = `rgba(255,${110 + Math.floor(e.z * 100)},50,${a})`
        ctx.beginPath()
        ctx.arc(x, y, 0.8 + e.s * 0.35 * (1 - life * 0.5), 0, 6.283)
        ctx.fill()
      }
      return
    }

    if (world === 'village') {
      const n = Math.floor(items.length * 0.55)
      for (let i = 0; i < n; i++) {
        const e = items[i]
        const life = (t * e.v * 0.9 + e.p) % 1
        const x = e.x * w + Math.sin(t * 0.6 + e.p * 3) * 40
        const y = -20 + life * (h + 40)
        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(Math.sin(t * 0.9 + e.p) * 0.9 + e.p)
        ctx.fillStyle = `rgba(${LEAF[e.k % LEAF.length]},0.85)`
        ctx.beginPath()
        ctx.ellipse(0, 0, 3 + e.s * 0.9, 1.6 + e.s * 0.45, 0, 0, 6.283)
        ctx.fill()
        ctx.restore()
      }
      return
    }

    const colors = SPARK[world] ?? SPARK.space
    const big = world === 'crystal' ? 1.35 : 1
    for (const s of items) {
      const y = (((s.y * h - scroll.y * 0.08 * s.z) % h) + h) % h
      const x = s.x * w + Math.sin(t * 0.2 * s.z + s.p) * 6 * s.z
      const tw = reducedMotion ? 0.7 : 0.5 + 0.5 * Math.sin(t * 1.3 * s.z + s.p)
      const r = s.s * big * (0.6 + tw * 0.6)
      ctx.fillStyle = `rgba(${colors[s.k % colors.length]},${0.3 + tw * 0.6 * s.z})`
      ctx.beginPath()
      ctx.moveTo(x, y - r * 2)
      ctx.quadraticCurveTo(x, y, x + r * 2, y)
      ctx.quadraticCurveTo(x, y, x, y + r * 2)
      ctx.quadraticCurveTo(x, y, x - r * 2, y)
      ctx.quadraticCurveTo(x, y, x, y - r * 2)
      ctx.fill()
    }
  })

  return <canvas ref={ref} className="sky-canvas" aria-hidden />
}
