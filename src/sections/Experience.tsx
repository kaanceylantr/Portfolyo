import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useT } from '../app/i18n'
import { reducedMotion } from '../engine/perf'

/** Player tension per card (0 calm → 1 intense); this shapes the pacing curve. */
const TENSION = [0.3, 0.92, 0.15, 0.55, 0.85, 0.35, 0.7]
const PAD = 12

interface Geo {
  w: number
  h: number
  pts: { x: number; y: number }[]
  d: string
}

/** Vertical S-curve through the card centres, like a level pacing graph. */
function buildGeo(list: HTMLElement, gutter: number): Geo {
  const h = list.offsetHeight
  const items = [...list.children] as HTMLElement[]
  const pts = items.map((li, i) => ({
    x: PAD + (TENSION[i] ?? 0.5) * (gutter - PAD * 2),
    y: li.offsetTop + li.offsetHeight / 2,
  }))
  const all = [{ x: pts[0].x, y: 0 }, ...pts, { x: pts[pts.length - 1].x, y: h }]
  let d = `M${all[0].x},${all[0].y}`
  for (let i = 1; i < all.length; i++) {
    const a = all[i - 1]
    const b = all[i]
    const m = (a.y + b.y) / 2
    d += ` C${a.x},${m} ${b.x},${m} ${b.x},${b.y}`
  }
  return { w: gutter, h, pts, d }
}

export default function Experience() {
  const t = useT()
  const root = useRef<HTMLElement>(null)
  const list = useRef<HTMLOListElement>(null)
  const svg = useRef<SVGSVGElement>(null)
  const path = useRef<SVGPathElement>(null)
  const dot = useRef<SVGGElement>(null)
  const [geo, setGeo] = useState<Geo | null>(null)

  // measure the cards, and again whenever the layout or language changes
  useEffect(() => {
    const measure = () => {
      if (list.current && svg.current) setGeo(buildGeo(list.current, svg.current.clientWidth))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(list.current!)
    return () => ro.disconnect()
  }, [t])

  // reveal cards
  useEffect(() => {
    if (reducedMotion) return
    const ctx = gsap.context(() => {
      gsap.from('.ex-head > *', {
        y: 40, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1,
        scrollTrigger: { trigger: '.ex-head', start: 'top 85%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  // draw the curve with the scroll; light cards as the dot passes them
  useEffect(() => {
    if (!geo || !path.current || !dot.current || !list.current) return
    const p = path.current
    const len = p.getTotalLength()
    const cards = [...list.current.children] as HTMLElement[]

    if (reducedMotion) {
      p.style.strokeDasharray = 'none'
      cards.forEach((c) => c.classList.add('reached'))
      dot.current.style.display = 'none'
      return
    }

    p.style.strokeDasharray = String(len)
    const st = ScrollTrigger.create({
      trigger: list.current,
      start: 'top 65%',
      end: 'bottom 65%',
      scrub: true,
      onUpdate: (self) => {
        const at = p.getPointAtLength(len * self.progress)
        p.style.strokeDashoffset = String(len * (1 - self.progress))
        dot.current!.setAttribute('transform', `translate(${at.x} ${at.y})`)
        cards.forEach((c, i) => c.classList.toggle('reached', at.y >= geo.pts[i].y - 4))
      },
    })
    st.update()
    return () => st.kill()
  }, [geo])

  useEffect(() => {
    ScrollTrigger.refresh()
  }, [geo])

  return (
    <section ref={root} className="exp">
      <div className="ex-head">
        <h2 className="eyebrow">{t.exp.eyebrow}</h2>
        <h3 className="ex-title">{t.exp.title}</h3>
        <p className="ex-role">{t.exp.role}</p>
      </div>

      <div className="ex-wrap">
        <div className="ex-axis" aria-hidden>
          <span>{t.exp.axis[0]}</span>
          <span>{t.exp.axis[1]}</span>
        </div>
        <svg ref={svg} className="ex-curve" width="100%" height={geo?.h ?? 0} aria-hidden>
          {geo && (
            <>
              <path d={geo.d} className="ex-track" />
              <path ref={path} d={geo.d} className="ex-line" />
              {geo.pts.map((q, i) => (
                <circle key={i} cx={q.x} cy={q.y} r="4" className="ex-node" />
              ))}
              <g ref={dot}>
                <circle r="13" className="ex-glow" />
                <circle r="6" className="ex-head-dot" />
              </g>
            </>
          )}
        </svg>
        <ol ref={list} className="ex-list">
          {t.exp.items.map((it) => (
            <li key={it.k} className="ex-card">
              <span className="step-n">{it.k}</span>
              <h4>{it.t}</h4>
              <p>{it.d}</p>
              {it.stat && (
                <div className="ex-stat">
                  <b>{it.stat.n}</b>
                  <span>{it.stat.l}</span>
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
