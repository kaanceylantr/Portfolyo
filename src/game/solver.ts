export interface Level {
  size: number
  nums: number[]
  blocked: number[]
}

export const isPrime = (n: number) => {
  if (n < 2) return false
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false
  return true
}

export const neighbours = (size: number, c: number) => {
  const r = Math.floor(c / size)
  const k = c % size
  const out: number[] = []
  if (r > 0) out.push(c - size)
  if (r < size - 1) out.push(c + size)
  if (k > 0) out.push(c - 1)
  if (k < size - 1) out.push(c + 1)
  return out
}

/** Why a step is not allowed (null = legal). Rule lives here so it is easy to swap. */
export function stepError(lv: Level, path: number[], to: number): 'blocked' | 'visited' | 'far' | 'sum' | null {
  const from = path[path.length - 1]
  if (lv.blocked.includes(to)) return 'blocked'
  if (path.includes(to)) return 'visited'
  if (!neighbours(lv.size, from).includes(to)) return 'far'
  if (!isPrime(lv.nums[from] + lv.nums[to])) return 'sum'
  return null
}

export interface Analysis {
  solutions: number[][]
  deadEnds: number
  nodes: number
}

/** Exhaustive DFS from cell 0 to the last cell: proves solvability and measures difficulty. */
export function analyse(lv: Level): Analysis {
  const goal = lv.size * lv.size - 1
  const solutions: number[][] = []
  let deadEnds = 0
  let nodes = 0
  const path = [0]
  const dfs = () => {
    nodes++
    const c = path[path.length - 1]
    if (c === goal) return void solutions.push([...path])
    let moved = false
    for (const x of neighbours(lv.size, c)) {
      if (stepError(lv, path, x)) continue
      moved = true
      path.push(x)
      dfs()
      path.pop()
    }
    if (!moved) deadEnds++
  }
  dfs()
  return { solutions, deadEnds, nodes }
}

/** 1–10 demo difficulty from path length, dead ends and search size. */
export function difficulty(a: Analysis): number {
  const len = a.solutions[0]?.length ?? 0
  return Math.max(1, Math.min(10, Math.round(len * 0.3 + a.deadEnds * 0.5 + Math.log2(a.nodes + 1) * 0.3)))
}
