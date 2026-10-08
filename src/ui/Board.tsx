import { useMemo } from 'react'
import { useCanvas } from '../engine/useCanvas'
import { scroll } from '../engine/scroll'
import { lite, reducedMotion } from '../engine/perf'
import { makeBoard } from '../game/grid'

function ease(x: number) {
  return x * x * (3 - 2 * x)
}

/** Crystal board whose path is solved by the page scroll. */
export function Board() {
  const board = useMemo(() => makeBoard(), [])

  const ref = useCanvas((ctx, w, h, t) => {
    if (document.documentElement.dataset.world !== 'space') return
    const n = board.size
    const pad = 18
    const cell = (Math.min(w, h) - pad * 2) / n
    const ox = (w - cell * n) / 2
    const oy = (h - cell * n) / 2
    const gap = cell * 0.07
    const total = board.path.length - 1
    // the puzzle is solved over the first 85% of the page; the rest is a victory glow
    const prog = Math.min(scroll.progress / 0.85, 1)
    const pos = ease(prog) * total
    const reached = Math.floor(pos)
    const centre = (i: number) => ({
      x: ox + (i % n) * cell + cell / 2,
      y: oy + Math.floor(i / n) * cell + cell / 2,
    })
    const stepOf = new Map<number, number>()
    board.path.forEach((c, i) => stepOf.set(c, i))

    for (let i = 0; i < n * n; i++) {
      const x = ox + (i % n) * cell + gap
      const y = oy + Math.floor(i / n) * cell + gap
      const s = cell - gap * 2
      const step = stepOf.get(i)
      const lit = step !== undefined && step <= reached
      const blocked = board.blocked.has(i)
      const shimmer = reducedMotion || lite ? 0 : 0.5 + 0.5 * Math.sin(t * 0.8 + i * 0.9)

      // glass body
      const g = ctx.createLinearGradient(x, y, x + s, y + s)
      if (lit) {
        g.addColorStop(0, 'rgba(160,210,255,0.6)')
        g.addColorStop(1, 'rgba(80,140,225,0.5)')
      } else if (blocked) {
        g.addColorStop(0, 'rgba(70,90,130,0.5)')
        g.addColorStop(1, 'rgba(40,58,96,0.45)')
      } else {
        g.addColorStop(0, 'rgba(120,165,230,0.2)')
        g.addColorStop(1, 'rgba(70,110,180,0.12)')
      }
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.roundRect(x, y, s, s, s * 0.22)
      ctx.fill()

      // crystal facet
      ctx.fillStyle = `rgba(200,225,255,${0.05 + shimmer * 0.07 + (lit ? 0.12 : 0)})`
      ctx.beginPath()
      ctx.moveTo(x + s * 0.12, y + s * 0.12)
      ctx.lineTo(x + s * 0.88, y + s * 0.12)
      ctx.lineTo(x + s * 0.5, y + s * 0.5)
      ctx.closePath()
      ctx.fill()

      ctx.lineWidth = 1.2
      ctx.strokeStyle = lit ? 'rgba(130,205,255,0.9)' : 'rgba(140,190,255,0.28)'
      ctx.beginPath()
      ctx.roundRect(x, y, s, s, s * 0.22)
      ctx.stroke()

      if (blocked) {
        ctx.strokeStyle = 'rgba(120,150,195,0.6)'
        ctx.lineWidth = 2
        const m = s * 0.3
        ctx.beginPath()
        ctx.moveTo(x + m, y + m)
        ctx.lineTo(x + s - m, y + s - m)
        ctx.moveTo(x + s - m, y + m)
        ctx.lineTo(x + m, y + s - m)
        ctx.stroke()
      }

    }

    // glowing path trail
    if (pos > 0) {
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      const trail = (width: number, style: string) => {
        ctx.lineWidth = width
        ctx.strokeStyle = style
        ctx.beginPath()
        const p0 = centre(board.path[0])
        ctx.moveTo(p0.x, p0.y)
        for (let i = 1; i <= reached; i++) {
          const p = centre(board.path[i])
          ctx.lineTo(p.x, p.y)
        }
        if (reached < total) {
          const a = centre(board.path[reached])
          const b = centre(board.path[reached + 1])
          const f = pos - reached
          ctx.lineTo(a.x + (b.x - a.x) * f, a.y + (b.y - a.y) * f)
        }
        ctx.stroke()
      }
      trail(cell * 0.2, 'rgba(110,190,255,0.25)')
      trail(cell * 0.06, 'rgba(150,225,255,0.95)')

      // head orb
      let head = centre(board.path[Math.min(reached, total)])
      if (reached < total) {
        const b = centre(board.path[reached + 1])
        const f = pos - reached
        head = { x: head.x + (b.x - head.x) * f, y: head.y + (b.y - head.y) * f }
      }
      const orb = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, cell * 0.32)
      orb.addColorStop(0, 'rgba(255,255,255,1)')
      orb.addColorStop(0.4, 'rgba(120,205,255,0.8)')
      orb.addColorStop(1, 'rgba(120,200,240,0)')
      ctx.fillStyle = orb
      ctx.beginPath()
      ctx.arc(head.x, head.y, cell * 0.32, 0, 6.283)
      ctx.fill()
    }

    // prime labels on top of the trail, nudged off the line
    ctx.font = `700 ${cell * 0.3}px system-ui, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    for (let st = 0; st <= reached && st <= total; st++) {
      const c = centre(board.path[st])
      const label = String(board.labels[st])
      ctx.lineWidth = 4
      ctx.strokeStyle = 'rgba(8,18,40,0.85)'
      ctx.strokeText(label, c.x + cell * 0.2, c.y - cell * 0.2)
      ctx.fillStyle = 'rgba(225,242,255,0.97)'
      ctx.fillText(label, c.x + cell * 0.2, c.y - cell * 0.2)
    }
  })

  return <canvas ref={ref} className="board-canvas" aria-hidden />
}
