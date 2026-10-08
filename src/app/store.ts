import { create } from 'zustand'
import type { Lang } from '../content/types'

const LS = 'kc-portfolio'

interface Persisted {
  lang?: Lang
  ach?: string[]
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
  chapter: number
  ach: string[]
  toast: string | null
  setLang: (l: Lang) => void
  setChapter: (i: number) => void
  unlock: (id: string) => void
  clearToast: () => void
}

export const useStore = create<State>((set, get) => ({
  lang: initialLang,
  chapter: 0,
  ach: saved.ach ?? [],
  toast: null,
  setLang: (lang) => {
    document.documentElement.lang = lang
    save({ lang, ach: get().ach })
    set({ lang })
  },
  setChapter: (chapter) => set({ chapter }),
  unlock: (id) => {
    const { ach, lang } = get()
    if (ach.includes(id)) return
    const next = [...ach, id]
    save({ lang, ach: next })
    set({ ach: next, toast: id })
  },
  clearToast: () => set({ toast: null }),
}))

document.documentElement.lang = initialLang
