import type { World } from './chapters'

export interface Dict {
  meta: { title: string; description: string; skip: string }
  worldLabel: string
  worlds: Record<World, string>
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
    levelNames: string[]
    secret: string
    rule: string
    targets: string
    idle: string
    win: string
    stuck: string
    undo: string
    reset: string
    check: string
    solver: string
    live: (sum: number) => string
    noPrime: string
    noMatch: (sum: number) => string
    solved: (t: number) => string
    stats: (swipes: number[], nodes: number) => string
  }
  projects: {
    eyebrow: string
    title: string
    sub: string
    reward: string
    log: string
    done: string
    items: {
      id: 'draw' | 'hybrid' | 'stock' | 'robot'
      type: string
      title: string
      meta: string
      bullets: string[]
      stack: string[]
      reward?: string
      link?: { href: string; label: string }
    }[]
  }
  draw: {
    title: string
    note: string
    ink: string
    drop: string
    stop: string
    undo: string
    reset: string
    level: string
    hint: string
    win: string
    lose: string
    stuck: string
  }
  interests: {
    eyebrow: string
    title: string
    sub: string
    tags: string[]
    piano: { title: string; hint: string }
    keepy: { title: string; hint: string; streak: (n: number) => string; best: (n: number) => string; drop: string }
    poem: { title: string; lines: string[]; note: string }
  }
  codex: {
    title: string
    found: (prime: number, n: number, total: number) => string
    hidden: string
    secretLocked: string
  }
  boss: {
    eyebrow: string
    name: string
    level: string
    hp: string
    intro: string
    hit: string
    how: string
    steps: string[]
    skillsTitle: string
    skills: { name: string; note: string }[]
    skip: string
    winTitle: string
    winText: string
    mail: string
    subject: string
    body: string
    again: string
  }
  credits: {
    eyebrow: string
    title: string
    sheet: { k: string; v: string; d: string }[]
    madeBy: string
    stack: string
    refs: string
    codexDone: string
    top: string
    trophies: string
    locked: string
  }
  exp: {
    eyebrow: string
    title: string
    role: string
    axis: [string, string]
    items: { k: string; t: string; d: string; stat?: { n: string; l: string } }[]
    side: { title: string; now: string; note: string }
    facts: { n: string; l: string }[]
  }
  skills: {
    eyebrow: string
    title: string
    sub: string
    equip: string
    equipped: string
    count: (n: number, total: number) => string
    slots: string
    empty: string
    sideNote: string
    cards: { rarity: string; name: string; tag: string; items: string[] }[]
  }
}
export type Lang = 'tr' | 'en'
