# Kaan Ceylan — Interactive Portfolio

Scroll-driven portfolio: the page solves a Prime Path puzzle as you scroll.

```
npm i
npm run dev      # local
npm run build    # type-check + production build
```

Stack: Vite, React 19, TypeScript, GSAP ScrollTrigger, Lenis, Canvas 2D, Zustand.
Performance budget: initial JS <= 150 KB gzip, 60 fps, compositor-only animation, lite mode on weak devices.
