/** Deterministic board + path used for the decorative scroll-solved puzzle. */

export const SIZE = 5

export interface Board {
  size: number
  /** visiting order of cell indices (row * size + col) */
  path: number[]
  /** prime label per path step */
  labels: number[]
  blocked: Set<number>
}

const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71]

function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0
    return seed / 4294967296
  }
}

/** Randomised DFS for a long self-avoiding path (seeded, so it is stable). */
export function makeBoard(seed = 7): Board {
  const n = SIZE
  const rand = rng(seed)
  const target = 18
  let best: number[] = []

  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ]

  const visited = new Array(n * n).fill(false)
  const stack: number[] = []
  let steps = 0

  const dfs = (cell: number): boolean => {
    if (++steps > 20000) return false
    visited[cell] = true
    stack.push(cell)
    if (stack.length > best.length) best = [...stack]
    if (stack.length >= target) return true
    const r = Math.floor(cell / n)
    const c = cell % n
    const order = dirs.map((d) => ({ d, k: rand() })).sort((a, b) => a.k - b.k)
    for (const { d } of order) {
      const nr = r + d[0]
      const nc = c + d[1]
      if (nr < 0 || nc < 0 || nr >= n || nc >= n) continue
      const nx = nr * n + nc
      if (visited[nx]) continue
      if (dfs(nx)) return true
    }
    stack.pop()
    visited[cell] = false
    return false
  }

  dfs(0)
  const path = best
  const onPath = new Set(path)
  const blocked = new Set<number>()
  for (let i = 0; i < n * n; i++) if (!onPath.has(i) && blocked.size < 3) blocked.add(i)

  return { size: n, path, labels: path.map((_, i) => PRIMES[i % PRIMES.length]), blocked }
}
