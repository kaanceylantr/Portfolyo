import { useEffect, type RefObject } from 'react'
import gsap from 'gsap'
import { reducedMotion } from './perf'

/**
 * One consistent entrance for every chapter heading:
 * the eyebrow slides in, the big title rises out of a mask, the intro line follows.
 */
export function useTitleReveal(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (reducedMotion || !root.current) return
    const eyebrow = root.current.querySelector<HTMLElement>('.eyebrow')
    const title = root.current.querySelector<HTMLElement>('.ex-title')
    if (!eyebrow || !title) return
    const after = title.nextElementSibling?.matches('p') ? title.nextElementSibling : null
    let tl: gsap.core.Timeline | undefined
    const ctx = gsap.context(() => {
      tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } })
      tl!.from(eyebrow, { x: -24, opacity: 0, duration: 0.9 })
        .fromTo(
          title,
          { clipPath: 'inset(0% 0% 100% 0%)', y: 48 },
          { clipPath: 'inset(0% 0% -20% 0%)', y: 0, duration: 1.3, clearProps: 'clipPath,transform' },
          0.08,
        )
      if (after) tl!.from(after, { y: 16, opacity: 0, duration: 1 }, 0.35)
    }, root)
    // an observer instead of a scroll trigger: immune to lazy sections shifting the layout,
    // and it also fires when the heading is already passed (fast scroll / jump)
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting && e.boundingClientRect.top > 0) return
        tl?.play()
        io.disconnect()
      },
      { rootMargin: '0px 0px -12% 0px' },
    )
    io.observe(eyebrow)
    return () => {
      io.disconnect()
      ctx.revert()
    }
  }, [root])
}
