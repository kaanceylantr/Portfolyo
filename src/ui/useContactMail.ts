import { useState, useCallback, useEffect } from 'react'
import { MAIL } from '../content/links'

export function useContactMail(targetMailto?: string, timeoutMs = 8000) {
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (!revealed) return
    const id = setTimeout(() => setRevealed(false), timeoutMs)
    return () => clearTimeout(id)
  }, [revealed, timeoutMs])

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!revealed) {
        e.preventDefault()
        setRevealed(true)
        try {
          if (navigator?.clipboard?.writeText) {
            navigator.clipboard.writeText(MAIL).catch(() => {})
          }
        } catch {}
      }
    },
    [revealed],
  )

  const mailHref = targetMailto ?? `mailto:${MAIL}`

  return {
    revealed,
    href: revealed ? mailHref : '#',
    handleClick,
    mail: MAIL,
  }
}
