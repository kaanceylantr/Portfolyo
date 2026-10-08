/** Ordered chapters currently present in the page. Extend as sections are built. */
export const CHAPTERS = ['hero', 'about', 'prime'] as const
export type ChapterId = (typeof CHAPTERS)[number]
