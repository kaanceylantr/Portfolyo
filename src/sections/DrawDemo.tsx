import { useEffect, useRef, useState } from 'react'
import { useT } from '../app/i18n'
import { useStore } from '../app/store'
import { useCanvas } from '../engine/useCanvas'
import { DRAW_LEVELS, H, W, pathLength, step, toSegs, type Ball, type Pt } from '../game/physics'

type Mode = 'draw' | 'run' | 'win' | 'lose' | 'stuck'

const newBall = (li: number): Ball => {
  const lv = DRAW_LEVELS[li]
  return { x: lv.spawn[0], y: lv.spawn[1], vx: lv.vx, vy: 0, r: 10, angle: 0 }
}

/** Draw lines that become physics colliders at runtime, a web echo of the Unity prototype. */
export function DrawDemo() {
  const t = useT()
  const unlock = useStore((s) => s.unlock)
  const [li, setLi] = useState(0)
  const [mode, setMode] = useState<Mode>('draw')
  const [inkLeft, setInkLeft] = useState(1)

  const modeRef = useRef<Mode>('draw')
  const liRef = useRef(0)
  const strokes = useRef<Pt[][]>([])
  const ball = useRef<Ball>(newBall(0))
  const drawing = useRef(false)
  const last = useRef(0)
  const still = useRef(0)

  const setM = (m: Mode) => {
    modeRef.current = m
    setMode(m)
  }
  const used = () => strokes.current.reduce((s, st) => s + pathLength(st), 0)
  const syncInk = () => setInkLeft(Math.max(0, 1 - used() / DRAW_LEVELS[liRef.current].ink))

  const ref = useCanvas(
    (ctx, w, h, time) => {
      const k = w / W
      const dt = last.current ? Math.min(time - last.current, 1 / 30) : 0
      last.current = time
      const lv = DRAW_LEVELS[liRef.current]
      const segs = [...lv.statics, ...toSegs(strokes.current)]
      const b = ball.current

      if (modeRef.current === 'run' && dt > 0) {
        step(b, segs, dt)
        const g = lv.goal
        if (b.x > g[0] && b.x < g[2] && b.y > g[1] && b.y < g[3] + 10) {
          setM('win')
          unlock('bridge')
        } else if (b.y > H + 40 || b.x > W + 40 || b.x < -40) setM('lose')
        else {
          still.current = Math.hypot(b.vx, b.vy) < 8 ? still.current + dt : 0
          if (still.current > 1.4) setM('stuck')
        }
      }

      ctx.save()
      ctx.scale(k, k)
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      // goal basket
      const [gx0, gy0, gx1, gy1] = lv.goal
      ctx.fillStyle = 'rgba(95,191,106,0.25)'
      ctx.beginPath()
      ctx.roundRect(gx0, gy0, gx1 - gx0, gy1 - gy0, 10)
      ctx.fill()
      ctx.strokeStyle = '#5fbf6a'
      ctx.lineWidth = 3
      ctx.setLineDash([6, 6])
      ctx.stroke()
      ctx.setLineDash([])
      ctx.fillStyle = '#5fbf6a'
      ctx.font = '700 13px system-ui, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('★', (gx0 + gx1) / 2, (gy0 + gy1) / 2 + 5)

      // static ground
      ctx.strokeStyle = '#8a5a3c'
      ctx.lineWidth = 6
      for (const s of lv.statics) {
        ctx.beginPath()
        ctx.moveTo(...s.a)
        ctx.lineTo(...s.b)
        ctx.stroke()
      }

      // player lines
      ctx.strokeStyle = '#ff8f3d'
      ctx.lineWidth = 5
      for (const st of strokes.current) {
        if (st.length < 2) continue
        ctx.beginPath()
        ctx.moveTo(...st[0])
        for (const p of st.slice(1)) ctx.lineTo(...p)
        ctx.stroke()
      }

      // the ball: a round little face
      ctx.save()
      ctx.translate(b.x, b.y)
      ctx.rotate(b.angle)
      const g = ctx.createRadialGradient(-3, -4, 1, 0, 0, b.r)
      g.addColorStop(0, '#fff3c4')
      g.addColorStop(1, '#f5a623')
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(0, 0, b.r, 0, 6.283)
      ctx.fill()
      ctx.fillStyle = '#5a3b2a'
      ctx.beginPath()
      ctx.arc(-3.5, -1, 1.7, 0, 6.283)
      ctx.arc(3.5, -1, 1.7, 0, 6.283)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(0, 2.5, 3, 0.15 * Math.PI, 0.85 * Math.PI)
      ctx.lineWidth = 1.4
      ctx.strokeStyle = '#5a3b2a'
      ctx.stroke()
      ctx.restore()

      ctx.restore()
      void h
    },
    { alwaysLive: true },
  )

  // keep the first frame of a fresh level on screen
  useEffect(() => {
    liRef.current = li
    ball.current = newBall(li)
  }, [li])

  const toLocal = (e: React.PointerEvent<HTMLCanvasElement>): Pt => {
    const r = e.currentTarget.getBoundingClientRect()
    return [((e.clientX - r.left) / r.width) * W, ((e.clientY - r.top) / r.height) * H]
  }

  const down = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (modeRef.current !== 'draw' || used() >= DRAW_LEVELS[li].ink) return
    e.currentTarget.setPointerCapture(e.pointerId)
    drawing.current = true
    strokes.current.push([toLocal(e)])
  }
  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return
    const st = strokes.current[strokes.current.length - 1]
    const p = toLocal(e)
    const prev = st[st.length - 1]
    const d = Math.hypot(p[0] - prev[0], p[1] - prev[1])
    if (d < 7) return
    if (used() + d > DRAW_LEVELS[li].ink) return // out of ink
    st.push(p)
    syncInk()
  }
  const up = () => {
    drawing.current = false
    const st = strokes.current[strokes.current.length - 1]
    if (st && st.length < 2) strokes.current.pop()
  }

  const retry = () => {
    ball.current = newBall(li)
    still.current = 0
    setM('draw')
  }
  const drop = () => {
    if (modeRef.current === 'run') return retry()
    ball.current = newBall(li)
    still.current = 0
    setM('run')
  }
  const undo = () => {
    strokes.current.pop()
    syncInk()
    retry()
  }
  const reset = (next = li) => {
    strokes.current = []
    setLi(next)
    liRef.current = next
    ball.current = newBall(next)
    setInkLeft(1)
    setM('draw')
  }

  const msg = mode === 'win' ? t.draw.win : mode === 'lose' ? t.draw.lose : mode === 'stuck' ? t.draw.stuck : t.draw.hint

  return (
    <div className="draw">
      <div className="draw-top">
        <b>{t.draw.title}</b>
        <div className="demo-levels" role="group" aria-label={t.draw.level}>
          {DRAW_LEVELS.map((_, i) => (
            <button key={i} aria-pressed={li === i} onClick={() => reset(i)}>
              {i + 1}
            </button>
          ))}
        </div>
      </div>
      <canvas
        ref={ref}
        className="draw-canvas"
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        aria-label={t.draw.title}
      />
      <div className="ink" role="group" aria-label={t.draw.ink}>
        <span>{t.draw.ink}</span>
        <div>
          <i style={{ transform: `scaleX(${inkLeft})` }} />
        </div>
      </div>
      <p className={`demo-msg${mode === 'win' ? ' win' : ''}`} role="status" aria-live="polite">
        {msg}
      </p>
      <div className="demo-actions">
        <button onClick={drop} aria-pressed={mode === 'run'}>
          {mode === 'run' ? t.draw.stop : t.draw.drop}
        </button>
        <button onClick={undo} disabled={!strokes.current.length && mode === 'draw'}>
          {t.draw.undo}
        </button>
        <button onClick={() => reset()}>{t.draw.reset}</button>
      </div>
      <p className="draw-note">{t.draw.note}</p>
    </div>
  )
}
