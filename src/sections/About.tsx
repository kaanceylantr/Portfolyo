import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useT } from '../app/i18n'
import { useStore } from '../app/store'
import { reducedMotion } from '../engine/perf'

/** "Reveal early, require late": cards open one by one, with no penalty. */
export function About() {
  const t = useT()
  const unlock = useStore((s) => s.unlock)
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.step')
      if (!reducedMotion) {
        cards.forEach((el) =>
          gsap.from(el, {
            y: 60,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
          }),
        )
      }
      ScrollTrigger.create({
        trigger: cards[cards.length - 1],
        start: 'center 70%',
        once: true,
        onEnter: () => unlock('student'),
      })
    }, root)
    return () => ctx.revert()
  }, [unlock])

  return (
    <section ref={root} className="about" data-chapter="about">
      <h2 className="eyebrow">{t.about.title}</h2>
      <ol className="steps">
        {t.about.steps.map((s, i) => (
          <li className="step" key={s.k}>
            <span className="step-n">
              {t.about.stepLabel} {String(i + 1).padStart(2, '0')} · {s.k}
            </span>
            <h3>{s.t}</h3>
            <p>{s.d}</p>
          </li>
        ))}
      </ol>
      <div className="soon">
        <b>{t.soon.title}</b>
        <span>{t.soon.text}</span>
      </div>
    </section>
  )
}
