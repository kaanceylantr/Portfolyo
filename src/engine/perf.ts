const nav = navigator as Navigator & { deviceMemory?: number }

export const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches

/** Low-power devices get fewer particles and no idle shimmer. */
export const lite =
  (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4 || matchMedia('(pointer: coarse)').matches

export const MAX_DPR = 2
export const dpr = () => Math.min(window.devicePixelRatio || 1, MAX_DPR)
