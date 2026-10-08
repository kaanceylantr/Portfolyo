import type { Level } from './solver'

/**
 * Level 33 and 57 are the real boards from the Prime Path store screenshots.
 * Locked cells are the greyed-out tiles in level 33.
 */
export const LEVELS: Level[] = [
  { name: 'tutorial', size: 3, nums: [4, 6, 3, 1, 9, 2, 8, 5, 4], locked: [], targets: [10, 12] },
  { name: '33', size: 4, nums: [4, 15, 1, 5, 11, 11, 2, 6, 5, 11, 4, 3, 15, 2, 4, 4], locked: [0, 1, 4], targets: [19, 13] },
  { name: '57', size: 4, nums: [19, 19, 8, 8, 6, 20, 3, 6, 11, 6, 3, 8, 3, 19, 10, 10], locked: [], targets: [27, 39, 45] },
  // Unlocked by completing the Prime Codex. Generated with the solver (planted, verified solvable).
  { name: 'secret', size: 5, nums: [5, 14, 13, 5, 15, 6, 7, 14, 15, 8, 5, 13, 17, 12, 5, 18, 8, 18, 9, 6, 5, 5, 17, 3, 4], locked: [13, 19], targets: [28, 46, 44, 33] },
]
