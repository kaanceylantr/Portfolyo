import { useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { useT } from '../app/i18n'
import { useStore } from '../app/store'
import { LEVELS } from '../game/levels'
import { analyse, difficulty, stepError } from '../game/solver'
import { reducedMotion } from '../engine/perf'

export function PrimeDemo() {
  const t = useT()
  const unlock = useStore((s) => s.unlock)
  const [li, setLi] = useState(0)
  const [path, setPath] = useState<number[]>([0])
  const [msg, setMsg] = useState<string | null>(null)
  const [hint, setHint] = useState(false)
  const [solved, setSolved] = useState<Set<number>>(new Set())
  const boardRef = useRef<HTMLDivElement>(null)

  const lv = LEVELS[li]
  const info = useMemo(() => analyse(lv), [lv])
  const goal = lv.size * lv.size - 1
  const done = path[path.length - 1] === goal
  const shown = hint ? info.solutions[0] : path

  const reset = (next = li) => {
    setLi(next)
    setPath([0])
    setHint(false)
    setMsg(null)
  }

  const tap = (c: number) => {
    if (hint) return
    const last = path[path.length - 1]
    if (c === last) return
    if (path.includes(c) && path[path.length - 2] === c) {
      setPath(path.slice(0, -1)) // tap the previous cell = undo, no penalty
      return setMsg(null)
    }
    if (done) return
    const err = stepError(lv, path, c)
    if (err) {
      setMsg(t.demo.errors[err])
      if (!reducedMotion) {
        gsap.fromTo(`[data-cell="${c}"]`, { x: -5 }, { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' })
      }
      return
    }
    const next = [...path, c]
    setPath(next)
    setMsg(null)
    if (c === goal) {
      setSolved(new Set(solved).add(li))
      unlock('solver')
      if (!reducedMotion) gsap.fromTo(boardRef.current, { scale: 1 }, { scale: 1.03, yoyo: true, repeat: 1, duration: 0.25 })
    }
  }

  const last = path[path.length - 1]
  const stuck =
    !done &&
    !hint &&
    lv.nums.every((_, c) => c === last || stepError(lv, path, c) !== null)

  const stepOf = new Map(shown.map((c, i) => [c, i]))

  return (
    <div className="demo">
      <div className="demo-top">
        <b>{t.demo.title}</b>
        <div className="demo-levels" role="group" aria-label={t.demo.level}>
          {LEVELS.map((_, i) => (
            <button key={i} aria-pressed={li === i} onClick={() => reset(i)}>
              {solved.has(i) ? '✦' : i + 1}
            </button>
          ))}
        </div>
      </div>
      <p className="demo-rule">{t.demo.rule}</p>

      <div ref={boardRef} className="demo-grid" style={{ ['--n' as string]: lv.size }}>
        {lv.nums.map((n, c) => {
          const step = stepOf.get(c)
          const cls = [
            'dcell',
            step !== undefined ? 'on' : '',
            c === last && !hint ? 'head' : '',
            c === 0 ? 'start' : '',
            c === goal ? 'goal' : '',
            lv.blocked.includes(c) ? 'blocked' : '',
          ].join(' ')
          return (
            <button key={c} data-cell={c} className={cls} onClick={() => tap(c)} aria-label={`${n}`}>
              {lv.blocked.includes(c) ? '✕' : n}
              {c === 0 && <small>{t.demo.start}</small>}
              {c === goal && <small>{t.demo.goal}</small>}
            </button>
          )
        })}
      </div>

      <p className={`demo-msg${done ? ' win' : ''}`} role="status" aria-live="polite">
        {done ? t.demo.win : stuck ? t.demo.stuck : (msg ?? t.demo.idle)}
      </p>

      <div className="demo-actions">
        <button onClick={() => setPath(path.length > 1 ? path.slice(0, -1) : path)} disabled={hint || path.length < 2}>
          {t.demo.undo}
        </button>
        <button onClick={() => reset()}>{t.demo.reset}</button>
        <button onClick={() => setHint((h) => !h)} aria-pressed={hint}>
          {t.demo.solver}
        </button>
      </div>

      {hint && (
        <p className="demo-stats">
          {t.demo.stats(info.solutions.length, info.deadEnds, info.nodes, difficulty(info))}
        </p>
      )}
    </div>
  )
}
