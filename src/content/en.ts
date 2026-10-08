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
  },
  ach: {
    unlocked: 'Achievement unlocked',
    items: {
      explorer: 'Explorer — you started scrolling',
      student: 'Quick Learner — tutorial complete',
    },
  },
  soon: {
    title: 'Next level loading…',
    text: 'The next chapters are being built. Come back soon.',
  },
}
