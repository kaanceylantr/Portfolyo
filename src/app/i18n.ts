import { en } from '../content/en'
import { tr } from '../content/tr'
import type { Dict } from '../content/types'
import { useStore } from './store'

const dicts: Record<string, Dict> = { en, tr }

export function useT(): Dict {
  return dicts[useStore((s) => s.lang)]
}
