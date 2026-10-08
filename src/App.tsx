import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initScroll } from './engine/scroll'
import { useT } from './app/i18n'
import { useStore } from './app/store'
import { World } from './ui/World'
import { CodexPrime } from './ui/CodexPrime'
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
const Interests = lazy(() => import('./sections/Interests'))
const Boss = lazy(() => import('./sections/Boss'))
const Credits = lazy(() => import('./sections/Credits'))

/**
 * Mounts a heavy section only when it is within ~2 viewports, so the first load stays light.
 * The wrapper (and its data-chapter) always exists so scroll triggers can find it.
 */
function LazySlot({ id, children }: { id: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(typeof IntersectionObserver === 'undefined')
  useEffect(() => {
    if (ready) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setReady(true)
          io.disconnect()
        }
      },
      { rootMargin: '200% 0px' },
    )
    io.observe(ref.current!)
    return () => io.disconnect()
  }, [ready])
  return (
    <div ref={ref} className="chapter-slot" data-chapter={id} style={ready ? undefined : { minHeight: '100svh' }}>
      {ready && <Suspense fallback={<div style={{ minHeight: '100svh' }} />}>{children}</Suspense>}
    </div>
  )
}

export default function App() {
  const setChapter = useStore((s) => s.setChapter)
  const unlock = useStore((s) => s.unlock)
  const t = useT()

  // keep the tab title and share metadata in the active language
  useEffect(() => {
    document.title = t.meta.title
    const set = (sel: string, v: string) => document.querySelector(sel)?.setAttribute('content', v)
    set('meta[name="description"]', t.meta.description)
    set('meta[property="og:title"]', t.meta.title)
    set('meta[property="og:description"]', t.meta.description)
  }, [t])

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
      <a className="skip-link" href="#main">
        {t.meta.skip}
      </a>
      <World />
      <Sky />
      <div className="board-wrap">
        <Board />
      </div>
      <Hud />
      <main id="main" tabIndex={-1}>
        <Hero />
        <About />
        <LazySlot id="prime">
          <PrimePath />
          <CodexPrime prime={3} style={{ right: '7%', top: '24%' }} />
        </LazySlot>
        <LazySlot id="experience">
          <Experience />
          <CodexPrime prime={5} style={{ right: '9%', top: '62%' }} />
        </LazySlot>
        <LazySlot id="skills">
          <Skills />
          <CodexPrime prime={7} style={{ right: '6%', bottom: '9%' }} />
        </LazySlot>
        <LazySlot id="projects">
          <Projects />
          <CodexPrime prime={11} style={{ right: '5%', top: '40%' }} />
        </LazySlot>
        <LazySlot id="interests">
          <Interests />
          <CodexPrime prime={13} style={{ right: '11%', top: '52%' }} />
        </LazySlot>
        <LazySlot id="boss">
          <Boss />
        </LazySlot>
        <LazySlot id="credits">
          <Credits />
        </LazySlot>
      </main>
    </>
  )
}
