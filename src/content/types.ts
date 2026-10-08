export interface Dict {
  nav: { chapter: string; sound: string }
  hero: { role: string; tagline: string; scroll: string }
  about: { title: string; stepLabel: string; steps: { k: string; t: string; d: string }[] }
  chapters: Record<string, string>
  ach: { unlocked: string; items: Record<string, string> }
  soon: { title: string; text: string }
}
export type Lang = 'tr' | 'en'
