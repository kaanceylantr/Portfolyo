import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useT } from '../app/i18n'
import { reducedMotion } from '../engine/perf'

export function Hero() {
  const t = useT()
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    if (reducedMotion) return
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from('.hero-name span', { yPercent: 110, opacity: 0, duration: 1.1, stagger: 0.12 })
        .from('.hero-role', { y: 18, opacity: 0, duration: 0.8 }, '-=0.6')
        .from('.hero-tag', { y: 18, opacity: 0, duration: 0.8 }, '-=0.6')
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
      </div>
      <div className="hero-cue" aria-hidden>
        <i />
        {t.hero.scroll}
      </div>
    </section>
  )
}
