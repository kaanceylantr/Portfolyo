import { useEffect, useRef, useState } from 'react'
import { useT } from '../app/i18n'
import { useStore } from '../app/store'
import { audio } from '../engine/audio'

interface Key {
  note: string
  freq: number
  black: boolean
  /** left offset in white-key units (black keys sit between whites) */
  at: number
  kb: string
}

// one octave, C4 to C5
const WHITE: [string, number, string][] = [
  ['C', 261.63, 'a'], ['D', 293.66, 's'], ['E', 329.63, 'd'], ['F', 349.23, 'f'],
  ['G', 392.0, 'g'], ['A', 440.0, 'h'], ['B', 493.88, 'j'], ['C', 523.25, 'k'],
]
const BLACK: [string, number, number, string][] = [
  ['C#', 277.18, 0, 'w'], ['D#', 311.13, 1, 'e'], ['F#', 369.99, 3, 't'], ['G#', 415.3, 4, 'y'], ['A#', 466.16, 5, 'u'],
]
const KEYS: Key[] = [
  ...WHITE.map(([note, freq, kb], i) => ({ note, freq, black: false, at: i, kb })),
  ...BLACK.map(([note, freq, i, kb]) => ({ note, freq, black: true, at: i + 1, kb })),
]

export function Piano() {
  const t = useT()
  const { sound, setSound, unlock } = useStore()
  const [lit, setLit] = useState<Record<string, boolean>>({})
  const heard = useRef(new Set<string>())
  const root = useRef<HTMLDivElement>(null)
  const visible = useRef(false)

  const press = (k: Key) => {
    if (!useStore.getState().sound) setSound(true)
    audio.note(k.freq)
    setLit((l) => ({ ...l, [k.note + k.at]: true }))
    setTimeout(() => setLit((l) => ({ ...l, [k.note + k.at]: false })), 220)
    heard.current.add(k.note + k.at)
    if (heard.current.size >= 5) unlock('pianist')
  }

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => (visible.current = e.isIntersecting), { threshold: 0.3 })
    io.observe(root.current!)
    const onKey = (e: KeyboardEvent) => {
      if (!visible.current || e.repeat || e.metaKey || e.ctrlKey || e.altKey) return
      const k = KEYS.find((x) => x.kb === e.key.toLowerCase())
      if (k) press(k)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      io.disconnect()
      window.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="card-block piano" ref={root}>
      <div className="blk-top">
        <b>{t.interests.piano.title}</b>
        <span className="blk-state">{sound ? '♪' : '♪̸'}</span>
      </div>
      <div className="keys" role="group" aria-label={t.interests.piano.title}>
        {KEYS.map((k) => (
          <button
            key={k.note + k.at}
            className={`key ${k.black ? 'black' : 'white'}${lit[k.note + k.at] ? ' lit' : ''}`}
            style={{ left: `${(k.at / 8) * 100}%` }}
            onPointerDown={(e) => {
              e.preventDefault()
              press(k)
            }}
            aria-label={k.note}
          >
            <span>{k.kb.toUpperCase()}</span>
          </button>
        ))}
      </div>
      <p className="blk-hint">{t.interests.piano.hint}</p>
    </div>
  )
}
