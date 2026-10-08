import { lazy, Suspense, useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initScroll } from './engine/scroll'
import { useStore } from './app/store'
import { Sky } from './ui/Sky'
import { Board } from './ui/Board'
import { Hud } from './ui/Hud'
import { Hero } from './sections/Hero'
import { About } from './sections/About'
import { CHAPTERS } from './content/chapters'

const PrimePath = lazy(() => import('./sections/PrimePath'))

export default function App() {
  const setChapter = useStore((s) => s.setChapter)
  const unlock = useStore((s) => s.unlock)

  useEffect(() => {
    const kill = initScroll()
    const triggers = CHAPTERS.map((id, i) =>
      ScrollTrigger.create({
        trigger: `[data-chapter="${id}"]`,
        start: 'top 55%',
        end: 'bottom 55%',
        onToggle: (self) => {
          if (!self.isActive) return
          setChapter(i)
          document.documentElement.dataset.chapter = id
          if (i > 0) unlock('explorer')
        },
      }),
    )
    return () => {
      triggers.forEach((t) => t.kill())
      kill()
    }
  }, [setChapter, unlock])

  return (
    <>
      <div className="bg" aria-hidden>
        <i className="cloud c1" />
        <i className="cloud c2" />
        <i className="cloud c3" />
        <i className="cloud c4" />
      </div>
      <Sky />
      <div className="board-wrap">
        <Board />
      </div>
      <Hud />
      <main>
        <Hero />
        <About />
        <div className="chapter-slot" data-chapter="prime">
          <Suspense fallback={<div style={{ minHeight: '100svh' }} />}>
            <PrimePath />
          </Suspense>
        </div>
      </main>
    </>
  )
}
