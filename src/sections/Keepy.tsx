import { useRef, useState } from 'react'
import { useT } from '../app/i18n'
import { useStore } from '../app/store'
import { audio } from '../engine/audio'
import { useCanvas } from '../engine/useCanvas'

const W = 560
const H = 300
const R = 24
const BEST = 'kc-keepy-best'

const readBest = () => {
  try {
    return Number(localStorage.getItem(BEST) ?? 0) || 0
  } catch {
    return 0
  }
}

/** Keepy-uppy: tap the ball, hit it off-centre to steer. */
export function Keepy() {
  const t = useT()
  const unlock = useStore((s) => s.unlock)
  const [streak, setStreak] = useState(0)
  const [best, setBest] = useState(readBest)
  const [dropped, setDropped] = useState(false)

  const ball = useRef({ x: W / 2, y: 80, vx: 0, vy: 0, a: 0, av: 0 })
  const streakRef = useRef(0)
  const bestRef = useRef(best)
  const last = useRef(0)
  const live = useRef(false)

  const ref = useCanvas(
    (ctx, w, _h, time) => {
      const k = w / W
      const dt = last.current ? Math.min(time - last.current, 1 / 30) : 0
      last.current = time
      const b = ball.current

      if (live.current && dt > 0) {
        b.vy += 1250 * dt
        b.x += b.vx * dt
        b.y += b.vy * dt
        b.a += b.av * dt
        if (b.x < R) {
          b.x = R
          b.vx = Math.abs(b.vx) * 0.8
        }
        if (b.x > W - R) {
          b.x = W - R
          b.vx = -Math.abs(b.vx) * 0.8
        }
        if (b.y < R) {
          b.y = R
          b.vy = Math.abs(b.vy) * 0.5
        }
        if (b.y > H - R - 14) {
          b.y = H - R - 14
          if (Math.abs(b.vy) > 60) b.vy = -b.vy * 0.45
          else b.vy = 0
          b.vx *= 0.94
          b.av = b.vx / R
          if (streakRef.current > 0) {
            streakRef.current = 0
            setStreak(0)
            setDropped(true)
          }
        }
      }

      ctx.save()
      ctx.scale(k, k)
      // pitch strip
      ctx.fillStyle = '#5fbf6a'
      ctx.fillRect(0, H - 14, W, 14)
      ctx.fillStyle = 'rgba(255,255,255,0.35)'
      ctx.fillRect(0, H - 14, W, 3)
      // shadow
      const sh = Math.max(0.2, 1 - (H - 14 - b.y) / 260)
      ctx.fillStyle = `rgba(60,90,40,${0.28 * sh})`
      ctx.beginPath()
      ctx.ellipse(b.x, H - 8, R * sh, 5 * sh, 0, 0, 6.283)
      ctx.fill()
      // ball
      ctx.translate(b.x, b.y)
      ctx.rotate(b.a)
      ctx.fillStyle = '#fff'
      ctx.beginPath()
      ctx.arc(0, 0, R, 0, 6.283)
      ctx.fill()
      ctx.strokeStyle = 'rgba(70,50,40,0.5)'
      ctx.lineWidth = 1.5
      ctx.stroke()
      ctx.fillStyle = '#4a3a34'
      const pent = (cx: number, cy: number, r: number, rot: number) => {
        ctx.beginPath()
        for (let i = 0; i < 5; i++) {
          const ang = rot + (i * 2 * Math.PI) / 5 - Math.PI / 2
          ctx[i ? 'lineTo' : 'moveTo'](cx + Math.cos(ang) * r, cy + Math.sin(ang) * r)
        }
        ctx.closePath()
        ctx.fill()
      }
      pent(0, 0, 8, 0)
      for (let i = 0; i < 5; i++) {
        const ang = (i * 2 * Math.PI) / 5 - Math.PI / 2
        pent(Math.cos(ang) * 19, Math.sin(ang) * 19, 5, ang + Math.PI / 2)
      }
      ctx.restore()
    },
    { alwaysLive: true },
  )

  const tap = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const px = ((e.clientX - r.left) / r.width) * W
    const py = ((e.clientY - r.top) / r.height) * H
    const b = ball.current
    live.current = true
    if (Math.hypot(px - b.x, py - b.y) > R * 2.1) return
    b.vy = -640 - Math.random() * 60
    b.vx = (b.x - px) * 7 + b.vx * 0.2
    b.av = b.vx / R
    if (useStore.getState().sound) audio.thud()
    setDropped(false)
    streakRef.current += 1
    setStreak(streakRef.current)
    if (streakRef.current > bestRef.current) {
      bestRef.current = streakRef.current
      setBest(bestRef.current)
      try {
        localStorage.setItem(BEST, String(bestRef.current))
      } catch {
        /* storage unavailable */
      }
    }
    if (streakRef.current >= 10) unlock('striker')
  }

  return (
    <div className="card-block keepy">
      <div className="blk-top">
        <b>{t.interests.keepy.title}</b>
        <span className="blk-state">
          {t.interests.keepy.streak(streak)} · {t.interests.keepy.best(best)}
        </span>
      </div>
      <canvas ref={ref} className="keepy-canvas" onPointerDown={tap} aria-label={t.interests.keepy.title} />
      <p className="blk-hint">{dropped ? t.interests.keepy.drop : t.interests.keepy.hint}</p>
    </div>
  )
}
