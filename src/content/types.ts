export interface Dict {
  nav: { chapter: string; sound: string }
  hero: { role: string; tagline: string; scroll: string }
  about: { title: string; stepLabel: string; steps: { k: string; t: string; d: string }[] }
  chapters: Record<string, string>
  ach: { unlocked: string; items: Record<string, string> }
  prime: {
    title: string
    sub: string
    chip: string
    facts: { n: string; l: string }[]
    trapsTitle: string
    traps: { t: string; d: string }[]
    shotsTitle: string
    shotSoon: string
    stack: string
  }
  demo: {
    title: string
    level: string
    rule: string
    start: string
    goal: string
    idle: string
    win: string
    stuck: string
    undo: string
    reset: string
    solver: string
    errors: Record<'blocked' | 'visited' | 'far' | 'sum', string>
    stats: (solutions: number, dead: number, nodes: number, diff: number) => string
  }
  soon: { title: string; text: string }
}
export type Lang = 'tr' | 'en'
