import { create } from 'zustand'
import type { Lang } from '../content/types'
import { audio } from '../engine/audio'

const LS = 'kc-portfolio'

interface Persisted {
  lang?: Lang
  ach?: string[]
  sound?: boolean
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

interface State {
  lang: Lang
  sound: boolean
  chapter: number
  ach: string[]
  toast: string | null
  setLang: (l: Lang) => void
  setSound: (on: boolean) => void
  setChapter: (i: number) => void
  unlock: (id: string) => void
  clearToast: () => void
}

export const useStore = create<State>((set, get) => ({
  lang: initialLang,
  sound: saved.sound ?? false,
  chapter: 0,
  ach: saved.ach ?? [],
  toast: null,
  setLang: (lang) => {
    document.documentElement.lang = lang
    save({ lang, ach: get().ach, sound: get().sound })
    set({ lang })
  },
  setSound: (sound) => {
    save({ lang: get().lang, ach: get().ach, sound })
    set({ sound })
  },
  setChapter: (chapter) => set({ chapter }),
  unlock: (id) => {
    const { ach, lang, sound } = get()
    if (ach.includes(id)) return
    const next = [...ach, id]
    save({ lang, ach: next, sound })
    set({ ach: next, toast: id })
    if (sound) audio.chime()
  },
  clearToast: () => set({ toast: null }),
}))

document.documentElement.lang = initialLang
