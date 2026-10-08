# Kaan Ceylan — Interactive Portfolio

A scroll-driven portfolio. Scrolling solves a Prime Path puzzle, moves through four worlds
(open space, crystal realm, obsidian caldera, tiny village) and ends with a boss fight.

Live: https://kaanceylantr.github.io/Portfolyo/

```
npm install
npm run dev      # local dev server
npm run build    # type-check + production build
```

## What's inside
- **Prime Path demo** — playable, with real levels 33/57, a secret 5x5 level and a DFS solver that proves solvability
- **Pacing curve** — scroll-drawn tension graph for the Gnarly internship
- **Perk cards, Side Quests** — skills as rogue-lite perks; a dependency-free physics drawing demo
- **Rest room** — WebAudio piano, keepy-uppy, scroll-typed poem
- **Boss fight + Prime Codex** — 7 hidden primes unlock the secret level
- **TR / EN** language switch, sound toggle, achievements (saved in localStorage)

## Where to edit content
- Text (both languages): `src/content/en.ts`, `src/content/tr.ts`
- Prime Path levels: `src/game/levels.ts` (verified by `src/game/solver.ts`)
- Store screenshots: `src/assets/store/`
- Poem: `interests.poem` in the content files
- Contact links: `src/sections/Boss.tsx`

## Performance
Stack: Vite, React 19, TypeScript, GSAP ScrollTrigger, Lenis, Canvas 2D, Zustand.
Heavy sections mount lazily as you approach them. Lighthouse (mobile, throttled):
Performance 99, Accessibility 100, Best Practices 100, SEO 100.
Honors `prefers-reduced-motion`; low-power devices get a lighter particle budget.

## Deploy
GitHub Pages via `.github/workflows/pages.yml` (deploys from the default branch).
