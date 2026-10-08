import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useT } from '../app/i18n'
import { reducedMotion } from '../engine/perf'
import { DrawDemo } from './DrawDemo'

export default function Projects() {
  const t = useT()
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    ScrollTrigger.refresh()
    if (reducedMotion) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.quest').forEach((el) =>
        gsap.from(el, {
          y: 70, opacity: 0, rotate: -1.5, duration: 0.9, ease: 'back.out(1.4)',
          scrollTrigger: { trigger: el, start: 'top 90%' },
        }),
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="projects">
      <div className="pj-head">
        <h2 className="eyebrow">{t.projects.eyebrow}</h2>
        <h3 className="ex-title">{t.projects.title}</h3>
        <p className="ex-role">{t.projects.sub}</p>
      </div>
      <div className="quests">
        {t.projects.items.map((q) => (
          <article key={q.id} className={`quest${q.id === 'draw' ? ' wide' : ''}`}>
            <header>
              <span className="quest-type">{q.type}</span>
              {q.reward && (
                <span className="reward">
                  <b>🥇</b> {q.reward}
                </span>
              )}
            </header>
            <h4>{q.title}</h4>
            <p className="quest-meta">{q.meta}</p>
            <ul>
              {q.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <div className="tags">
              {q.stack.map((s) => (
                <i key={s}>{s}</i>
              ))}
            </div>
            {q.link && (
              <a className="quest-link" href={q.link.href} target="_blank" rel="noreferrer">
                {q.link.label} ↗
              </a>
            )}
            {q.id === 'draw' && <DrawDemo />}
          </article>
        ))}
      </div>
    </section>
  )
}
