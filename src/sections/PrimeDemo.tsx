import { useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { useT } from '../app/i18n'
import { CODEX_PRIMES, useStore } from '../app/store'
import { LEVELS } from '../game/levels'
import { adjacent, analyse, hasPrime, isPrime, solve, sumOf, type Path } from '../game/solver'
import { reducedMotion } from '../engine/perf'

interface Done {
  target: number
  path: Path
}

const line = (size: number, p: Path) => p.map((c) => `${(c % size) + 0.5},${Math.floor(c / size) + 0.5}`).join(' ')

export function PrimeDemo() {
  const t = useT()
  const unlock = useStore((s) => s.unlock)
  const codexDone = useStore((s) => s.codex.length >= CODEX_PRIMES.length)
  const [li, setLi] = useState(0)
  const [sel, setSel] = useState<Path>([])
  const [done, setDone] = useState<Done[]>([])
  const [msg, setMsg] = useState<string | null>(null)
  const [hint, setHint] = useState(false)
  const [won, setWon] = useState<Set<number>>(new Set())
  const gridRef = useRef<HTMLDivElement>(null)

  const selRef = useRef<Path>([])
  const dragging = useRef(false)
  const moved = useRef(false)
  const tapMode = useRef(false)

  const lv = LEVELS[li]
  const n = lv.size
  const info = useMemo(() => analyse(lv), [lv])
  const used = useMemo(() => new Set(done.flatMap((d) => d.path)), [done])
  const remaining = lv.targets.filter((x) => !done.some((d) => d.target === x))
  const finished = remaining.length === 0
  const stuck = useMemo(
    () => !finished && solve(lv, remaining, used) === null,
    [lv, remaining, used, finished],
  )

  const setSelection = (p: Path) => {
    selRef.current = p
    setSel(p)
  }

  const usable = (c: number) => !lv.locked.includes(c) && !used.has(c) && !hint && !finished

  const shake = (cells: Path) => {
    if (reducedMotion) return
    cells.forEach((c) => gsap.fromTo(`[data-cell="${c}"] .face`, { x: -5 }, { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' }))
  }

  const evaluate = (p: Path) => {
    const sum = sumOf(lv, p)
    const target = remaining.find((x) => x === sum)
    if (target === undefined) {
      setMsg(t.demo.noMatch(sum))
      shake(p)
    } else if (!hasPrime(lv, p)) {
      setMsg(t.demo.noPrime)
      shake(p)
    } else {
      const next = [...done, { target, path: p }]
      setDone(next)
      setMsg(t.demo.solved(target))
      if (next.length === lv.targets.length) {
        setWon(new Set(won).add(li))
        unlock('solver')
        if (!reducedMotion) gsap.fromTo(gridRef.current, { scale: 1 }, { scale: 1.03, yoyo: true, repeat: 1, duration: 0.25 })
      }
    }
    setSelection([])
    tapMode.current = false
  }

  const cellAt = (x: number, y: number) => {
    const el = document.elementFromPoint(x, y)?.closest<HTMLElement>('[data-cell]')
    if (!el) return -1
    // only the centre of a cell counts, so a diagonal swipe cutting a corner never grabs a neighbour
    const r = el.getBoundingClientRect()
    if (Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height / 2)) > r.width * 0.36) return -1
    return Number(el.dataset.cell)
  }

  const down = (c: number) => {
    if (!usable(c)) return
    const cur = selRef.current
    moved.current = false
    dragging.current = true
    if (tapMode.current && cur.length && !cur.includes(c) && adjacent(n, cur[cur.length - 1], c)) {
      setSelection([...cur, c])
    } else if (tapMode.current && cur[cur.length - 1] === c && cur.length > 1) {
      setSelection(cur.slice(0, -1)) // tap the last cell again to step back
    } else {
      setSelection([c])
    }
    setMsg(null)
  }

  const move = (x: number, y: number) => {
    if (!dragging.current) return
    const c = cellAt(x, y)
    const cur = selRef.current
    if (c < 0 || !cur.length || c === cur[cur.length - 1]) return
    if (cur[cur.length - 2] === c) {
      moved.current = true
      setSelection(cur.slice(0, -1))
    } else if (usable(c) && !cur.includes(c) && adjacent(n, cur[cur.length - 1], c)) {
      moved.current = true
      tapMode.current = false
      setSelection([...cur, c])
    }
  }

  const up = () => {
    if (!dragging.current) return
    dragging.current = false
    const cur = selRef.current
    if (moved.current && cur.length > 1) evaluate(cur)
    else tapMode.current = cur.length > 0
  }

  const reset = (next = li) => {
    setLi(next)
    setDone([])
    setHint(false)
    setMsg(null)
    setSelection([])
    tapMode.current = false
  }

  const undo = () => {
    if (sel.length) setSelection([])
    else setDone(done.slice(0, -1))
    tapMode.current = false
    setMsg(null)
  }

  const sum = sel.length ? sumOf(lv, sel) : 0
  const liveOk = remaining.includes(sum) && hasPrime(lv, sel)

  const colour = (c: number) => done.findIndex((d) => d.path.includes(c))

  const overlay: { path: Path; cls: string }[] = hint
    ? (info.solution?.paths ?? []).map((p, i) => ({ path: p, cls: `ln c${i}` }))
    : [...done.map((d, i) => ({ path: d.path, cls: `ln c${i}` })), { path: sel, cls: 'ln live' }]

  const message = finished ? t.demo.win : stuck ? t.demo.stuck : (msg ?? t.demo.idle)

  return (
    <div className="demo">
      <div className="demo-top">
        <b>{t.demo.title}</b>
        <div className="demo-levels" role="group" aria-label={t.demo.level}>
          {LEVELS.map((_, i) => {
            const secret = i === LEVELS.length - 1
            const locked = secret && !codexDone
            return (
              <button
                key={i}
                aria-pressed={li === i}
                disabled={locked}
                onClick={() => reset(i)}
                title={locked ? t.codex.secretLocked : t.demo.levelNames[i]}
                aria-label={locked ? t.codex.secretLocked : t.demo.levelNames[i]}
              >
                {secret ? (won.has(i) ? '✦' : locked ? '🔒' : '🗝') : won.has(i) ? '✦' : t.demo.levelNames[i].replace(/\D+/g, '') || 'T'}
              </button>
            )
          })}
        </div>
      </div>
      <p className="demo-rule">{t.demo.rule}</p>

      <div className="targets" role="group" aria-label={t.demo.targets}>
        <span>{t.demo.targets}</span>
        {lv.targets.map((x) => {
          const k = done.findIndex((d) => d.target === x)
          return (
            <i key={x} className={k >= 0 ? `tg done c${k}` : 'tg'}>
              {x}
              {k >= 0 && ' ✓'}
            </i>
          )
        })}
        <em className={`live${sel.length ? ' show' : ''}${liveOk ? ' ok' : ''}`} aria-live="polite">
          {sel.length ? `${t.demo.live(sum)}${liveOk ? ' ✓' : ''}` : ''}
        </em>
      </div>

      <div
        ref={gridRef}
        className="demo-grid"
        style={{ ['--n' as string]: n }}
        onPointerMove={(e) => move(e.clientX, e.clientY)}
        onPointerUp={up}
        onPointerCancel={up}
        onPointerLeave={up}
      >
        {lv.nums.map((v, c) => {
          const k = colour(c)
          const locked = lv.locked.includes(c)
          const cls = ['dcell', locked ? 'locked' : '', k >= 0 ? `used c${k}` : '', sel.includes(c) ? 'sel' : ''].join(' ')
          return (
            <button
              key={c}
              data-cell={c}
              className={cls}
              aria-label={`${v}${isPrime(v) ? ' prime' : ''}`}
              onPointerDown={(e) => {
                e.preventDefault()
                down(c)
              }}
              onKeyDown={(e) => {
                if (e.key !== 'Enter' && e.key !== ' ') return
                e.preventDefault()
                tapMode.current = true
                down(c)
                dragging.current = false
              }}
            >
              <span className="face">
                {v}
                {isPrime(v) && !locked && k < 0 && <i className="star">★</i>}
              </span>
            </button>
          )
        })}
        <svg className="demo-lines" viewBox={`0 0 ${n} ${n}`} aria-hidden>
          {overlay
            .filter((o) => o.path.length > 1)
            .map((o, i) => (
              <polyline key={i} className={o.cls} points={line(n, o.path)} />
            ))}
        </svg>
      </div>

      <p className={`demo-msg${finished ? ' win' : ''}`} role="status" aria-live="polite">
        {message}
      </p>

      <div className="demo-actions">
        <button onClick={undo} disabled={hint || (!sel.length && !done.length)}>
          {t.demo.undo}
        </button>
        <button onClick={() => evaluate(sel)} disabled={hint || sel.length < 2}>
          {t.demo.check}
        </button>
        <button onClick={() => reset()}>{t.demo.reset}</button>
        <button onClick={() => setHint((h) => !h)} aria-pressed={hint}>
          {t.demo.solver}
        </button>
      </div>

      {hint && <p className="demo-stats">{t.demo.stats(info.swipes, info.nodes)}</p>}
    </div>
  )
}
