import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useT } from '../app/i18n'
import { CODEX_PRIMES, useStore } from '../app/store'
import { reducedMotion } from '../engine/perf'

export default function Credits() {
  const t = useT()
  const done = useStore((s) => s.codex.length >= CODEX_PRIMES.length)
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    ScrollTrigger.refresh()
    if (reducedMotion) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.sheet-row').forEach((el) =>
        gsap.from(el, { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%' } }),
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="credits">
      <h2 className="eyebrow">{t.credits.eyebrow}</h2>
      <h3 className="ex-title">{t.credits.title}</h3>
      <dl className="sheet">
        {t.credits.sheet.map((r) => (
          <div key={r.k} className="sheet-row">
            <dt>{r.k}</dt>
            <dd>
              <b>{r.v}</b>
              <span>{r.d}</span>
            </dd>
          </div>
        ))}
      </dl>
      {done && <p className="cdx-done">◆ {t.credits.codexDone}</p>}
      <footer className="foot">
        <p>{t.credits.madeBy}</p>
        <p className="foot-sub">{t.credits.stack}</p>
        <p className="foot-sub">{t.credits.refs}</p>
        <button className="ghost" onClick={() => window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })}>
          ↑ {t.credits.top}
        </button>
      </footer>
    </section>
  )
}
