import { useEffect, useRef } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useT } from '../app/i18n'
import { useStore } from '../app/store'
import { reducedMotion } from '../engine/perf'

/** Scroll-scrubbed typewriter: one letter per slice of scroll. */
export function Poem() {
  const t = useT()
  const unlock = useStore((s) => s.unlock)
  const box = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const chars = [...box.current!.querySelectorAll<HTMLElement>('.ch')]
    if (reducedMotion) {
      chars.forEach((c) => c.classList.add('on'))
      return
    }
    let shown = 0
    const st = ScrollTrigger.create({
      trigger: box.current,
      start: 'top 80%',
      end: 'bottom 88%',
      scrub: true,
      onUpdate: (self) => {
        const n = Math.round(self.progress * chars.length)
        if (n === shown) return
        const [a, b] = n > shown ? [shown, n] : [n, shown]
        for (let i = a; i < b; i++) chars[i].classList.toggle('on', n > shown)
        shown = n
        if (self.progress > 0.97) unlock('poet')
      },
    })
    return () => st.kill()
  }, [t, unlock])

  return (
    <div className="card-block poem" ref={box}>
      <div className="blk-top">
        <b>{t.interests.poem.title}</b>
      </div>
      <div className="poem-lines" aria-label={t.interests.poem.lines.join(' ')}>
        {t.interests.poem.lines.map((line) => (
          <p key={line} aria-hidden>
            {[...line].map((c, i) => (
              <span key={i} className="ch">
                {c}
              </span>
            ))}
          </p>
        ))}
      </div>
      <p className="blk-hint">{t.interests.poem.note}</p>
    </div>
  )
}
