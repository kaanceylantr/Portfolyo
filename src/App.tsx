import { lazy, Suspense, useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initScroll } from './engine/scroll'
import { useStore } from './app/store'
import { World } from './ui/World'
import { Sky } from './ui/Sky'
import { Board } from './ui/Board'
import { Hud } from './ui/Hud'
import { Hero } from './sections/Hero'
import { About } from './sections/About'
import { CHAPTERS } from './content/chapters'

const PrimePath = lazy(() => import('./sections/PrimePath'))
const Experience = lazy(() => import('./sections/Experience'))
const Skills = lazy(() => import('./sections/Skills'))
const Projects = lazy(() => import('./sections/Projects'))

export default function App() {
  const setChapter = useStore((s) => s.setChapter)
  const unlock = useStore((s) => s.unlock)

  useEffect(() => {
    const kill = initScroll()
    const triggers = CHAPTERS.map((id, i) =>
      !document.querySelector(`[data-chapter="${id}"]`)
        ? null
        : ScrollTrigger.create({
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
      triggers.forEach((t) => t?.kill())
      kill()
    }
  }, [setChapter, unlock])

  return (
    <>
      <World />
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
        <div className="chapter-slot" data-chapter="experience">
          <Suspense fallback={<div style={{ minHeight: '100svh' }} />}>
            <Experience />
          </Suspense>
        </div>
        <div className="chapter-slot" data-chapter="skills">
          <Suspense fallback={<div style={{ minHeight: '100svh' }} />}>
            <Skills />
          </Suspense>
        </div>
        <div className="chapter-slot" data-chapter="projects">
          <Suspense fallback={<div style={{ minHeight: '100svh' }} />}>
            <Projects />
          </Suspense>
        </div>
      </main>
    </>
  )
}
