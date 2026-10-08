import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useT } from '../app/i18n'
import { useStore } from '../app/store'
import { reducedMotion } from '../engine/perf'
import { audio } from '../engine/audio'
import { CodexPrime } from '../ui/CodexPrime'

const MAX = 100
const MAIL = 'kaan.ceylan.tr@gmail.com'
const LINKS = [
  { label: 'LinkedIn', href: 'https://linkedin.com/in/kaan-ceylan-67b050371/' },
  { label: 'GitHub', href: 'https://github.com/kaanceylantr' },
]
const COOLDOWN = 2.4

function Boss({ hp, hurt }: { hp: number; hurt: boolean }) {
  const low = hp < 35
  return (
    <svg className={`boss-art${hurt ? ' hurt' : ''}${hp <= 0 ? ' dead' : ''}`} viewBox="0 0 300 320" aria-hidden>
      <defs>
        <linearGradient id="bg1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a1c22" />
          <stop offset="1" stopColor="#0e080b" />
        </linearGradient>
      </defs>
      <ellipse cx="150" cy="306" rx="96" ry="10" fill="#000" opacity="0.4" />
      {/* body */}
      <polygon points="70,300 90,170 150,130 210,170 230,300" fill="url(#bg1)" stroke="#ff7a3d" strokeOpacity="0.5" strokeWidth="2" />
      {/* shoulders / shards */}
      <polygon points="40,210 70,150 100,200" fill="#150c10" stroke="#ff7a3d" strokeOpacity="0.45" strokeWidth="2" />
      <polygon points="260,210 230,150 200,200" fill="#150c10" stroke="#ff7a3d" strokeOpacity="0.45" strokeWidth="2" />
      {/* head */}
      <polygon points="105,150 125,60 150,30 175,60 195,150 150,175" fill="#1b1015" stroke="#ff7a3d" strokeOpacity="0.6" strokeWidth="2" />
      <polygon points="150,30 175,60 150,80 125,60" fill="#2c1b22" />
      {/* lava cracks */}
      <path d="M150 175 L142 215 L158 240 L146 290" stroke="#ff7a3d" strokeWidth="3" fill="none" strokeLinecap="round" opacity={low ? 1 : 0.7} />
      <path d="M118 200 L130 235 L112 270" stroke="#ffb84a" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />
      <path d="M182 205 L172 240 L190 275" stroke="#ffb84a" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />
      {/* eyes */}
      <g className="eyes" fill={low ? '#ffd27a' : '#ff7a3d'}>
        <polygon points="128,108 146,116 130,124" />
        <polygon points="172,108 154,116 170,124" />
      </g>
      {/* little crown for the open position */}
      <polygon points="132,34 138,16 150,28 162,16 168,34" fill="#ffb84a" opacity="0.95" />
    </svg>
  )
}

export default function BossSection() {
  const t = useT()
  const unlock = useStore((s) => s.unlock)
  const sound = useStore((s) => s.sound)
  const root = useRef<HTMLElement>(null)
  const arena = useRef<HTMLDivElement>(null)
  const [hp, setHp] = useState(MAX)
  const [hurt, setHurt] = useState(false)
  const [cool, setCool] = useState<boolean[]>([false, false, false, false])
  const won = hp <= 0

  useEffect(() => {
    ScrollTrigger.refresh()
    if (reducedMotion) return
    const ctx = gsap.context(() => {
      gsap.from('.boss-wrap > *', {
        y: 50, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12,
        scrollTrigger: { trigger: '.boss-wrap', start: 'top 80%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  const confetti = () => {
    if (reducedMotion || !arena.current) return
    const box = arena.current
    for (let i = 0; i < 28; i++) {
      const el = document.createElement('i')
      el.className = 'conf'
      el.style.background = ['#ffb84a', '#ff7a3d', '#ffd27a', '#5fd0c0', '#fff'][i % 5]
      box.appendChild(el)
      gsap.fromTo(
        el,
        { x: 0, y: 0, opacity: 1, rotate: 0 },
        {
          x: gsap.utils.random(-220, 220), y: gsap.utils.random(-260, 40), rotate: gsap.utils.random(-360, 360),
          opacity: 0, duration: gsap.utils.random(1, 1.7), ease: 'power2.out', onComplete: () => el.remove(),
        },
      )
    }
  }

  const damage = (amount: number, x?: number, y?: number) => {
    if (won) return
    const next = Math.max(0, hp - amount)
    setHp(next)
    setHurt(true)
    setTimeout(() => setHurt(false), 140)
    if (sound) audio.thud()
    if (!reducedMotion && arena.current) {
      gsap.fromTo('.boss-art', { x: -7 }, { x: 0, duration: 0.45, ease: 'elastic.out(1, 0.3)' })
      const n = document.createElement('b')
      n.className = 'dmg'
      n.textContent = `-${amount}`
      n.style.left = `${x ?? 50}%`
      n.style.top = `${y ?? 40}%`
      arena.current.appendChild(n)
      gsap.to(n, { y: -60, opacity: 0, duration: 0.9, ease: 'power1.out', onComplete: () => n.remove() })
    }
    if (next === 0) {
      unlock('hired')
      confetti()
    }
  }

  const skill = (i: number) => {
    if (cool[i] || won) return
    setCool((c) => c.map((v, k) => (k === i ? true : v)))
    setTimeout(() => setCool((c) => c.map((v, k) => (k === i ? false : v))), COOLDOWN * 1000)
    damage(20, 30 + i * 14, 30 + (i % 2) * 18)
  }

  const reset = () => {
    setHp(MAX)
    setCool([false, false, false, false])
  }

  const mailto = `mailto:${MAIL}?subject=${encodeURIComponent(t.boss.subject)}&body=${encodeURIComponent(t.boss.body)}`

  return (
    <section ref={root} className="boss">
      <div className="boss-head">
        <h2 className="eyebrow">{t.boss.eyebrow}</h2>
        <h3 className="ex-title">{t.boss.name}</h3>
        <p className="ex-role">{t.boss.intro}</p>
      </div>

      <div className="boss-wrap">
        <div className="hpbar" role="progressbar" aria-valuenow={hp} aria-valuemin={0} aria-valuemax={MAX} aria-label={t.boss.hp}>
          <span>
            {t.boss.hp} {hp}/{MAX} · {t.boss.level}
          </span>
          <div>
            <i style={{ transform: `scaleX(${hp / MAX})` }} />
          </div>
        </div>

        <div ref={arena} className="arena">
          <button className="boss-hit" onClick={() => damage(4)} disabled={won} aria-label={t.boss.hit}>
            <Boss hp={hp} hurt={hurt} />
          </button>
          {!won && <p className="boss-hint">{t.boss.hit}</p>}
        </div>

        {!won ? (
          <>
            <div className="skills-row">
              {t.boss.skills.map((s, i) => (
                <button key={s.name} className={`skill${cool[i] ? ' cool' : ''}`} onClick={() => skill(i)} disabled={cool[i]}>
                  <b>{s.name}</b>
                  <small>{s.note}</small>
                  <i className="cd" style={cool[i] ? { animationDuration: `${COOLDOWN}s` } : undefined} />
                </button>
              ))}
            </div>
            <a className="skip" href={mailto}>
              {t.boss.skip} →
            </a>
          </>
        ) : (
          <div className="win-card">
            <h4>{t.boss.winTitle}</h4>
            <p>{t.boss.winText}</p>
            <div className="win-actions">
              <a className="cta" href={mailto}>
                {t.boss.mail}
              </a>
              {LINKS.map((l) => (
                <a key={l.label} className="ghost" href={l.href} target="_blank" rel="noreferrer">
                  {l.label} ↗
                </a>
              ))}
              <button className="ghost" onClick={reset}>
                {t.boss.again}
              </button>
            </div>
          </div>
        )}
      </div>
      <CodexPrime prime={17} style={{ right: '4%', top: '16%' }} />
    </section>
  )
}
