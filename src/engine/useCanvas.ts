import { useEffect, useRef } from 'react'
import { dpr, reducedMotion } from './perf'
import { onFrame, scroll } from './scroll'

type Draw = (ctx: CanvasRenderingContext2D, w: number, h: number, time: number) => void

/**
 * Sizes a canvas to its CSS box (DPR-capped), drives it from the shared ticker,
 * and pauses while off-screen. Under reduced motion it only redraws on scroll/resize.
 */
export function useCanvas(draw: Draw) {
  const ref = useRef<HTMLCanvasElement>(null)
  const drawRef = useRef(draw)
  drawRef.current = draw

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    let w = 0
    let h = 0
    let visible = true
    let dirty = true
    let lastY = -1

    const resize = () => {
      const r = canvas.getBoundingClientRect()
      const d = dpr()
      w = r.width
      h = r.height
      canvas.width = Math.round(w * d)
      canvas.height = Math.round(h * d)
      ctx.setTransform(d, 0, 0, d, 0, 0)
      dirty = true
    }
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(canvas)

    const off = onFrame((t) => {
      if (!visible || !w) return
      if (reducedMotion) {
        if (!dirty && scroll.y === lastY) return
        lastY = scroll.y
        dirty = false
      }
      ctx.clearRect(0, 0, w, h)
      drawRef.current(ctx, w, h, t)
    })

    return () => {
      off()
      ro.disconnect()
      io.disconnect()
    }
  }, [])

  return ref
}
