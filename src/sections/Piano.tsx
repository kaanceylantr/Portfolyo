import { useEffect, useRef, useState } from 'react'
import { useT } from '../app/i18n'
import { useStore } from '../app/store'
import { audio } from '../engine/audio'

interface Key {
  note: string
  freq: number
  black: boolean
  /** left offset in white-key units (0 to 14) */
  at: number
  kb: string
}

// 2 octaves: C4 to C6 (15 white keys, 10 black keys)
const WHITE: [string, number, string][] = [
  // Octave 4
  ['C', 261.63, 'a'],
  ['D', 293.66, 's'],
  ['E', 329.63, 'd'],
  ['F', 349.23, 'f'],
  ['G', 392.0, 'g'],
  ['A', 440.0, 'h'],
  ['B', 493.88, 'j'],
  // Octave 5
  ['C', 523.25, 'k'],
  ['D', 587.33, 'l'],
  ['E', 659.25, 'z'],
  ['F', 698.46, 'x'],
  ['G', 783.99, 'c'],
  ['A', 880.0, 'v'],
  ['B', 987.77, 'b'],
  // High C (Octave 6)
  ['C', 1046.5, 'n'],
]

const BLACK: [string, number, number, string][] = [
  // Octave 4
  ['C#', 277.18, 1, 'w'],
  ['D#', 311.13, 2, 'e'],
  ['F#', 369.99, 4, 't'],
  ['G#', 415.3, 5, 'y'],
  ['A#', 466.16, 6, 'u'],
  // Octave 5
  ['C#', 554.37, 8, 'o'],
  ['D#', 622.25, 9, 'p'],
  ['F#', 739.99, 11, '1'],
  ['G#', 830.61, 12, '2'],
  ['A#', 932.33, 13, '3'],
]

const TOTAL_WHITE = 15

const KEYS: Key[] = [
  ...WHITE.map(([note, freq, kb], i) => ({ note, freq, black: false, at: i, kb })),
  ...BLACK.map(([note, freq, at, kb]) => ({ note, freq, black: true, at, kb })),
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
      <div className="keys-wrap">
        <div className="keys" role="group" aria-label={t.interests.piano.title}>
          {KEYS.map((k) => (
            <button
              key={k.note + k.at}
              className={`key ${k.black ? 'black' : 'white'}${lit[k.note + k.at] ? ' lit' : ''}`}
              style={{ left: `${(k.at / TOTAL_WHITE) * 100}%` }}
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
      </div>
      <p className="blk-hint">{t.interests.piano.hint}</p>
    </div>
  )
}
