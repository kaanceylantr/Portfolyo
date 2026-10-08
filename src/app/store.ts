import { create } from 'zustand'
import type { Lang } from '../content/types'
import { audio } from '../engine/audio'

const LS = 'kc-portfolio'

export const CODEX_PRIMES = [2, 3, 5, 7, 11, 13, 17] as const

interface Persisted {
  lang?: Lang
  ach?: string[]
  sound?: boolean
  codex?: number[]
}

function load(): Persisted {
  try {
    return JSON.parse(localStorage.getItem(LS) ?? '{}')
  } catch {
    return {}
  }
}

function save(p: Persisted) {
  try {
    localStorage.setItem(LS, JSON.stringify(p))
  } catch {
    /* storage unavailable */
  }
}

const saved = load()
const initialLang: Lang = saved.lang ?? (navigator.language.toLowerCase().startsWith('tr') ? 'tr' : 'en')

export type Toast = { kind: 'ach'; id: string } | { kind: 'codex'; prime: number; n: number }

interface State {
  lang: Lang
  sound: boolean
  chapter: number
  ach: string[]
  codex: number[]
  toast: Toast | null
  setLang: (l: Lang) => void
  setSound: (on: boolean) => void
  setChapter: (i: number) => void
  unlock: (id: string) => void
  collect: (prime: number) => void
  clearToast: () => void
}

export const useStore = create<State>((set, get) => {
  const persist = (patch: Partial<Persisted>) => {
    const s = get()
    save({ lang: s.lang, ach: s.ach, sound: s.sound, codex: s.codex, ...patch })
  }
  return {
    lang: initialLang,
    sound: saved.sound ?? false,
    chapter: 0,
    ach: saved.ach ?? [],
    codex: saved.codex ?? [],
    toast: null,
    setLang: (lang) => {
      document.documentElement.lang = lang
      persist({ lang })
      set({ lang })
    },
    setSound: (sound) => {
      persist({ sound })
      set({ sound })
    },
    setChapter: (chapter) => set({ chapter }),
    unlock: (id) => {
      const { ach, sound } = get()
      if (ach.includes(id)) return
      const next = [...ach, id]
      persist({ ach: next })
      set({ ach: next, toast: { kind: 'ach', id } })
      if (sound) audio.chime()
    },
    collect: (prime) => {
      const { codex, sound } = get()
      if (codex.includes(prime)) return
      const next = [...codex, prime]
      persist({ codex: next })
      set({ codex: next, toast: { kind: 'codex', prime, n: next.length } })
      if (sound) audio.chime()
      if (next.length === CODEX_PRIMES.length) get().unlock('codex')
    },
    clearToast: () => set({ toast: null }),
  }
})

document.documentElement.lang = initialLang
