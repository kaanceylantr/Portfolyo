export interface Level {
  name: string
  size: number
  nums: number[]
  /** cells that can never be used */
  locked: number[]
  /** sums to reach; each swipe must include at least one prime */
  targets: number[]
}

export type Path = number[]

export const isPrime = (n: number) => {
  if (n < 2) return false
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false
  return true
}

/** 8-way neighbours (swipes may go diagonally). */
export const adjacent = (size: number, a: number, b: number) =>
  a !== b &&
  Math.abs(Math.floor(a / size) - Math.floor(b / size)) <= 1 &&
  Math.abs((a % size) - (b % size)) <= 1

export const neighbours = (size: number, c: number) => {
  const out: number[] = []
  for (let i = 0; i < size * size; i++) if (adjacent(size, c, i)) out.push(i)
  return out
}

export const sumOf = (lv: Level, p: Path) => p.reduce((s, c) => s + lv.nums[c], 0)
export const hasPrime = (lv: Level, p: Path) => p.some((c) => isPrime(lv.nums[c]))

export interface Solution {
  /** one path per target, same order as lv.targets */
  paths: Path[]
}

export interface Analysis {
  solution: Solution | null
  /** distinct valid swipes per target, ignoring other targets */
  swipes: number[]
  nodes: number
}

/** All distinct swipes (direction ignored) that hit `target` with a prime, avoiding `blocked`. */
function swipesFor(lv: Level, target: number, blocked: Set<number>, counter: { n: number }): Path[] {
  const found = new Map<string, Path>()
  const path: Path = []
  const seen = new Set<number>()
  const dfs = (c: number, sum: number) => {
    counter.n++
    path.push(c)
    seen.add(c)
    const total = sum + lv.nums[c]
    if (total === target && hasPrime(lv, path)) {
      const fwd = path.join(',')
      const rev = [...path].reverse().join(',')
      if (!found.has(rev)) found.set(fwd, [...path])
    }
    if (total < target) {
      for (const x of neighbours(lv.size, c)) {
        if (!seen.has(x) && !blocked.has(x)) dfs(x, total)
      }
    }
    path.pop()
    seen.delete(c)
  }
  for (let c = 0; c < lv.size * lv.size; c++) if (!blocked.has(c)) dfs(c, 0)
  return [...found.values()]
}

/** Find disjoint swipes for `targets` using only free cells; null if impossible. */
export function solve(lv: Level, targets: number[], used: Set<number>, counter = { n: 0 }): Path[] | null {
  if (!targets.length) return []
  const blocked = new Set([...lv.locked, ...used])
  const [t, ...rest] = targets
  for (const p of swipesFor(lv, t, blocked, counter)) {
    const next = solve(lv, rest, new Set([...used, ...p]), counter)
    if (next) return [p, ...next]
  }
  return null
}

/** Exhaustive search: proves solvability and measures difficulty. */
export function analyse(lv: Level): Analysis {
  const counter = { n: 0 }
  const paths = solve(lv, lv.targets, new Set(), counter)
  const swipes = lv.targets.map((t) => swipesFor(lv, t, new Set(lv.locked), counter).length)
  return { solution: paths ? { paths } : null, swipes, nodes: counter.n }
}
