import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useT } from '../app/i18n'
import { useStore } from '../app/store'
import { reducedMotion } from '../engine/perf'

const ICON = ['◆', '✦', '⬢', '◎']

export default function Skills() {
  const t = useT()
  const unlock = useStore((s) => s.unlock)
  const root = useRef<HTMLElement>(null)
  const [on, setOn] = useState<Set<number>>(new Set())
  const total = t.skills.cards.length

  useEffect(() => {
    ScrollTrigger.refresh()
    if (reducedMotion) return
    const ctx = gsap.context(() => {
      gsap.from('.perk', {
        y: 90, opacity: 0, rotate: 2, duration: 0.9, ease: 'power3.out', stagger: 0.12,
        scrollTrigger: { trigger: '.perks', start: 'top 80%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  const toggle = (i: number) => {
    const next = new Set(on)
    if (!next.delete(i)) next.add(i)
    setOn(next)
    if (next.size === total) unlock('fullbuild')
  }

  // light tilt toward the pointer (transform only)
  const tilt = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (reducedMotion || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    e.currentTarget.style.transform = `perspective(700px) rotateX(${-y * 7}deg) rotateY(${x * 9}deg)`
  }
  const untilt = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = ''
  }

  return (
    <section ref={root} className="skills">
      <div className="sk-head">
        <h2 className="eyebrow">{t.skills.eyebrow}</h2>
        <h3 className="ex-title">{t.skills.title}</h3>
        <p className="ex-role">{t.skills.sub}</p>
        <p className="sk-count" aria-live="polite">
          {t.skills.count(on.size, total)}
        </p>
      </div>
      <div className="perks">
        {t.skills.cards.map((c, i) => (
          <button
            key={c.name}
            className={`perk ${c.rarity}${on.has(i) ? ' on' : ''}`}
            aria-pressed={on.has(i)}
            onClick={() => toggle(i)}
            onPointerMove={tilt}
            onPointerLeave={untilt}
          >
            <span className="perk-top">
              <i className="perk-ico">{ICON[i]}</i>
              <em>{c.rarity}</em>
            </span>
            <b className="perk-name">{c.name}</b>
            <small className="perk-tag">{c.tag}</small>
            <ul>
              {c.items.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <span className="perk-btn">{on.has(i) ? `✓ ${t.skills.equipped}` : t.skills.equip}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
