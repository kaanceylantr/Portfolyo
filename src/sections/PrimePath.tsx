import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useT } from '../app/i18n'
import { reducedMotion } from '../engine/perf'
import { storeShots } from '../game/storeShots'
import { PrimeDemo } from './PrimeDemo'

const SLOTS = 3

export default function PrimePath() {
  const t = useT()
  const root = useRef<HTMLElement>(null)

  // the section mounts lazily, so scroll positions must be recomputed once it has its real height
  useEffect(() => {
    ScrollTrigger.refresh()
  }, [])

  useEffect(() => {
    if (reducedMotion) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) =>
        gsap.from(el, {
          y: 48,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
        }),
      )
    }, root)
    return () => ctx.revert()
  }, [])

  const shots = Array.from({ length: SLOTS }, (_, i) => storeShots[i])

  return (
    <section ref={root} className="prime">
      <div className="split">
        <div className="prime-main">
          <div className="prime-head reveal">
            <span className="chip">{t.prime.chip}</span>
            <h2>{t.prime.title}</h2>
            <p>{t.prime.sub}</p>
          </div>

          <div className="facts reveal">
            {t.prime.facts.map((f) => (
              <div key={f.l}>
                <b>{f.n}</b>
                <span>{f.l}</span>
              </div>
            ))}
          </div>

          <div className="reveal">
            <PrimeDemo />
          </div>

          <div className="traps reveal">
            <h3>{t.prime.trapsTitle}</h3>
            <ul>
              {t.prime.traps.map((x) => (
                <li key={x.t}>
                  <b>{x.t}</b>
                  <span>{x.d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="side prime-side">
          <h3 className="side-h">{t.prime.shotsTitle}</h3>
          <div className="fan">
            {shots.map((src, i) => (
              <figure key={i} className={`phone f${i}`}>
                {src ? <img src={src} alt="Prime Path" loading="lazy" decoding="async" /> : <figcaption>{t.prime.shotSoon}</figcaption>}
              </figure>
            ))}
          </div>
          <div className="tags side-tags">
            {t.prime.stack.split(' · ').map((x) => (
              <i key={x}>{x}</i>
            ))}
          </div>
        </aside>
      </div>
    </section>
  )
}
