import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { reducedMotion } from './perf'

gsap.registerPlugin(ScrollTrigger)

/** Hot scroll data, read straight from the ticker (never React state). */
export const scroll = { progress: 0, y: 0, velocity: 0 }

export function initScroll(): () => void {
  let lenis: Lenis | undefined
  let tick: ((t: number) => void) | undefined

  if (!reducedMotion) {
    lenis = new Lenis({ lerp: 0.1 })
    lenis.on('scroll', ScrollTrigger.update)
    tick = (t) => lenis!.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
  }

  const st = ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      scroll.progress = self.progress
      scroll.y = self.scroll()
      scroll.velocity = self.getVelocity()
    },
  })

  return () => {
    st.kill()
    if (tick) gsap.ticker.remove(tick)
    lenis?.destroy()
  }
}

/** Subscribe to the single shared animation loop. */
export function onFrame(fn: (time: number) => void): () => void {
  gsap.ticker.add(fn)
  return () => gsap.ticker.remove(fn)
}
