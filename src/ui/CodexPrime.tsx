import { useStore } from '../app/store'
import { useT } from '../app/i18n'

/** A hidden collectible prime. Absolutely positioned inside a `position: relative` parent. */
export function CodexPrime({ prime, style }: { prime: number; style: React.CSSProperties }) {
  const t = useT()
  const got = useStore((s) => s.codex.includes(prime))
  const collect = useStore((s) => s.collect)
  if (got) return null
  return (
    <button className="cdx" style={style} onClick={() => collect(prime)} aria-label={`${t.codex.hidden} ${prime}`}>
      <span>{prime}</span>
    </button>
  )
}
