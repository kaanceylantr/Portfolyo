export type World = 'space' | 'crystal' | 'obsidian' | 'village'

/** Ordered chapters currently present in the page. Extend as sections are built. */
export const CHAPTERS = ['hero', 'about', 'prime', 'experience', 'skills', 'projects', 'interests'] as const
export type ChapterId = (typeof CHAPTERS)[number]

/** Each chapter lives in a world; the backdrop switches when the world changes. */
export const CHAPTER_WORLD: Record<ChapterId, World> = {
  hero: 'space',
  about: 'space',
  prime: 'crystal',
  experience: 'obsidian',
  skills: 'village',
  projects: 'village',
  interests: 'space',
}

export const WORLDS: World[] = ['space', 'crystal', 'obsidian', 'village']
