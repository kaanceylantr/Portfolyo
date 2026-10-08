import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useT } from '../app/i18n'
import { reducedMotion } from '../engine/perf'
import { Piano } from './Piano'
import { Keepy } from './Keepy'
import { Poem } from './Poem'

export default function Interests() {
  const t = useT()
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    ScrollTrigger.refresh()
    if (reducedMotion) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.card-block').forEach((el) =>
        gsap.from(el, {
          y: 60, opacity: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
        }),
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="interests">
      <div className="in-head">
        <h2 className="eyebrow">{t.interests.eyebrow}</h2>
        <h3 className="ex-title">{t.interests.title}</h3>
        <p className="ex-role">{t.interests.sub}</p>
        <div className="tags big">
          {t.interests.tags.map((x) => (
            <i key={x}>{x}</i>
          ))}
        </div>
      </div>
      <div className="blocks">
        <Piano />
        <Keepy />
        <Poem />
      </div>
    </section>
  )
}
