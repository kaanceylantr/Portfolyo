import type { Dict } from './types'

export const en: Dict = {
  nav: { chapter: 'Chapter', sound: 'Sound' },
  hero: {
    role: 'Game Designer & Computer Engineer',
    tagline: 'I design puzzles, economies and feel — then I build them.',
    scroll: 'Scroll to play',
  },
  about: {
    title: 'Tutorial',
    stepLabel: 'Step',
    steps: [
      {
        k: 'Who',
        t: 'Engineer brain, designer heart.',
        d: 'Computer Engineering graduate and Game Designer with end-to-end production experience across commercial mobile titles, systems design and algorithmic game mechanics.',
      },
      {
        k: 'Built',
        t: 'One game, from zero to Google Play.',
        d: 'Prime Path is my solo mobile puzzle: production GDD, a solver that guarantees every level is solvable, and a hybrid economy — now in live playtesting.',
      },
      {
        k: 'Craft',
        t: 'Pacing, balance and cognitive traps.',
        d: 'Level pacing, combat balancing, tutorial curricula, tactile feedback — the invisible things that make a game feel right.',
      },
      {
        k: 'Studio',
        t: 'Gnarly Game Studio.',
        d: 'Levels, boss pitches, competitor research, playable-ad analytics and live balancing on a flagship cover-shooter.',
      },
      {
        k: 'Data',
        t: 'Design that listens to players.',
        d: 'Funnel telemetry, churn tracking and Remote Config tuning, so decisions come from what players actually do.',
      },
    ],
  },
  chapters: {
    hero: 'Boot',
    about: 'Tutorial',
    prime: 'Prime Path',
  },
  ach: {
    unlocked: 'Achievement unlocked',
    items: {
      explorer: 'Explorer — you started scrolling',
      student: 'Quick Learner — tutorial complete',
      solver: 'Puzzle Solver — you cracked a Prime Path level',
    },
  },
  prime: {
    title: 'Prime Path',
    sub: 'A mathematical logic puzzle — designed, built and shipped solo.',
    chip: 'Live on Google Play · playtesting',
    facts: [
      { n: '290', l: 'line production GDD' },
      { n: '2×2 → 5×5', l: 'boards, every level provably solvable' },
      { n: '1–10', l: 'automatic difficulty rating' },
      { n: '13', l: 'stage tutorial curriculum' },
    ],
    trapsTitle: 'Cognitive traps',
    traps: [
      { t: 'Fork / greed', d: 'The tempting route that dead-ends.' },
      { t: 'Blocked transit', d: 'Cells you can see but cannot cross.' },
      { t: 'Mirror', d: 'Symmetry that lies about the answer.' },
      { t: 'Center contention', d: 'Every path wants the same cell.' },
    ],
    shotsTitle: 'From the store',
    shotSoon: 'Screenshot slot',
    stack: 'React 19 · TypeScript · Capacitor · Supabase · Firebase',
  },
  demo: {
    title: 'Try it',
    level: 'Level',
    levelNames: ['Tutorial', 'Level 33', 'Level 57'],
    rule: 'Swipe across neighbouring cells (diagonals too). The numbers must add up to a target, and the swipe needs at least one ★ prime.',
    targets: 'Targets',
    idle: 'Drag across cells, or tap them one by one and press Check. Tutorial: no lives are lost.',
    win: 'All targets reached! The solver confirms this level is solvable.',
    stuck: 'Dead end — the remaining targets cannot be reached. Undo a swipe.',
    undo: 'Undo',
    reset: 'Reset',
    check: 'Check',
    solver: 'Show solver',
    live: (n) => `Sum ${n}`,
    noPrime: 'Right sum, but no ★ prime in the swipe.',
    noMatch: (n) => `${n} is not one of the targets.`,
    solved: (t) => `${t} reached!`,
    stats: (s, n) => `Solver: ${s.join(' / ')} valid swipes per target · ${n.toLocaleString('en')} states searched`,
  },
  soon: {
    title: 'Next level loading…',
    text: 'The next chapters are being built. Come back soon.',
  },
}
