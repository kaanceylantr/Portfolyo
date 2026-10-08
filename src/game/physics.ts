/** Tiny 2D ball-vs-segment physics for the drawing demo (no dependencies). */

export type Pt = [number, number]
export interface Seg {
  a: Pt
  b: Pt
}
export interface Ball {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  angle: number
}

export const GRAVITY = 820
const HALF_THICK = 2.5

function closest(seg: Seg, x: number, y: number): Pt {
  const [ax, ay] = seg.a
  const dx = seg.b[0] - ax
  const dy = seg.b[1] - ay
  const len2 = dx * dx + dy * dy || 1
  const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / len2))
  return [ax + dx * t, ay + dy * t]
}

function substep(ball: Ball, segs: Seg[], dt: number) {
  ball.vy += GRAVITY * dt
  ball.x += ball.vx * dt
  ball.y += ball.vy * dt
  for (const s of segs) {
    const [cx, cy] = closest(s, ball.x, ball.y)
    let nx = ball.x - cx
    let ny = ball.y - cy
    const d = Math.hypot(nx, ny)
    const min = ball.r + HALF_THICK
    if (d >= min) continue
    if (d < 1e-6) {
      // centre exactly on the line: push up from the segment normal
      nx = 0
      ny = -1
    } else {
      nx /= d
      ny /= d
    }
    ball.x += nx * (min - d)
    ball.y += ny * (min - d)
    const vn = ball.vx * nx + ball.vy * ny
    if (vn < 0) {
      const e = vn < -140 ? 0.25 : 0 // only real impacts bounce
      ball.vx -= (1 + e) * vn * nx
      ball.vy -= (1 + e) * vn * ny
    }
    // light rolling friction along the surface
    const tx = -ny
    const ty = nx
    const vt = ball.vx * tx + ball.vy * ty
    ball.vx -= vt * 0.0012 * tx
    ball.vy -= vt * 0.0012 * ty
    ball.angle += (vt * dt) / ball.r
  }
}

/** Advance the ball by `dt` seconds using fixed 1/240 s substeps. */
export function step(ball: Ball, segs: Seg[], dt: number) {
  const n = Math.max(1, Math.ceil(Math.min(dt, 1 / 30) * 240))
  const h = Math.min(dt, 1 / 30) / n
  for (let i = 0; i < n; i++) substep(ball, segs, h)
}

export interface DrawLevel {
  spawn: Pt
  vx: number
  statics: Seg[]
  /** goal box: x0, y0, x1, y1 */
  goal: [number, number, number, number]
  ink: number
}

export const W = 560
export const H = 340

export const DRAW_LEVELS: DrawLevel[] = [
  {
    spawn: [70, 50],
    vx: 90,
    statics: [
      { a: [20, 110], b: [150, 110] },
      { a: [420, 270], b: [545, 270] },
    ],
    goal: [445, 225, 545, 270],
    ink: 480,
  },
  {
    spawn: [70, 50],
    vx: 90,
    statics: [
      { a: [20, 110], b: [150, 110] },
      { a: [300, 175], b: [300, 340] },
      { a: [420, 270], b: [545, 270] },
    ],
    goal: [445, 225, 545, 270],
    ink: 480,
  },
]

export const pathLength = (pts: Pt[]) => {
  let n = 0
  for (let i = 1; i < pts.length; i++) n += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])
  return n
}

export const toSegs = (strokes: Pt[][]): Seg[] =>
  strokes.flatMap((s) => s.slice(1).map((p, i) => ({ a: s[i], b: p })))

export function simulate(lv: DrawLevel, strokes: Pt[][], seconds = 8): 'win' | 'lose' | 'running' {
  const segs = [...lv.statics, ...toSegs(strokes)]
  const ball: Ball = { x: lv.spawn[0], y: lv.spawn[1], vx: lv.vx, vy: 0, r: 10, angle: 0 }
  for (let t = 0; t < seconds; t += 1 / 60) {
    step(ball, segs, 1 / 60)
    const g = lv.goal
    if (ball.x > g[0] && ball.x < g[2] && ball.y > g[1] && ball.y < g[3] + 10) return 'win'
    if (ball.y > H + 40 || ball.x > W + 40 || ball.x < -40) return 'lose'
  }
  return 'running'
}
