import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useT } from '../app/i18n'
import { reducedMotion } from '../engine/perf'
import { LINKS } from '../content/links'
import { useStore } from '../app/store'

export function Hero() {
  const t = useT()
  const openContact = useStore((s) => s.openContact)
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    if (reducedMotion) return
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from('.hero-copy', { opacity: 0, duration: 0.9 }, 0)
        .from('.hero-name span', { yPercent: 110, opacity: 0, duration: 1.1, stagger: 0.12 }, 0)
        .from('.hero-role', { y: 18, opacity: 0, duration: 0.8 }, '-=0.6')
        .from('.hero-tag', { y: 18, opacity: 0, duration: 0.8 }, '-=0.6')
        .from('.hero-links', { y: 18, opacity: 0, duration: 0.8 }, '-=0.5')
        .from('.hero-cue', { opacity: 0, duration: 0.8 }, '-=0.3')
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="hero" data-chapter="hero">
      <div className="hero-copy">
        <h1 className="hero-name">
          <span>Kaan</span>
          <span>Ceylan</span>
        </h1>
        <p className="hero-role">{t.hero.role}</p>
        <p className="hero-tag">{t.hero.tagline}</p>
        <div className="hero-links">
          <button
            className="cta"
            onClick={() => openContact()}
          >
            {t.nav.contact}
          </button>
          {LINKS.map((l) => (
            <a key={l.label} className="ghost" href={l.href} target="_blank" rel="noreferrer">
              {l.label} ↗
            </a>
          ))}
        </div>
      </div>
      <div className="hero-cue" aria-hidden>
        <i />
        {t.hero.scroll}
      </div>
    </section>
  )
}
