import { useMemo } from 'react'
import { useCanvas } from '../engine/useCanvas'
import { scroll } from '../engine/scroll'
import { lite, reducedMotion } from '../engine/perf'

const COLORS = ['255,255,255', '214,200,255', '190,230,255', '255,214,236', '216,255,240']

/** Drifting four-point crystal sparkles with scroll parallax. */
export function Sky() {
  const stars = useMemo(() => {
    const n = lite ? 36 : 84
    return Array.from({ length: n }, (_, i) => {
      const a = Math.sin(i * 12.9898) * 43758.5453
      const b = Math.sin(i * 78.233) * 12345.6789
      const f = (v: number) => v - Math.floor(v)
      return {
        x: f(a),
        y: f(b),
        z: 0.15 + f(a * b) * 0.85,
        s: 1.2 + f(b * 3.1) * 3.4,
        c: COLORS[i % COLORS.length],
        p: f(a * 7.7) * 6.28,
      }
    })
  }, [])

  const ref = useCanvas((ctx, w, h, t) => {
    for (const s of stars) {
      const y = (((s.y * h - scroll.y * 0.08 * s.z) % h) + h) % h
      const x = s.x * w + Math.sin(t * 0.2 * s.z + s.p) * 6 * s.z
      const tw = reducedMotion ? 0.7 : 0.5 + 0.5 * Math.sin(t * 1.3 * s.z + s.p)
      const r = s.s * (0.6 + tw * 0.6)
      ctx.fillStyle = `rgba(${s.c},${0.25 + tw * 0.6 * s.z})`
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
