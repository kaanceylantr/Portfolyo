import { en } from '../content/en'
import { tr } from '../content/tr'
import { fr } from '../content/fr'
import type { Dict } from '../content/types'
import { useStore } from './store'

const dicts: Record<string, Dict> = { en, tr, fr }

export function useT(): Dict {
  return dicts[useStore((s) => s.lang)]
}
