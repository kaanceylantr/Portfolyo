import { useEffect, useRef } from 'react'
import { useStore } from '../app/store'
import { useT } from '../app/i18n'
import { CHAPTERS } from '../content/chapters'
import { onFrame, scroll } from '../engine/scroll'

export function Hud() {
  const t = useT()
  const { lang, setLang, sound, setSound, chapter, toast, clearToast } = useStore()
  const bar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let last = -1
    return onFrame(() => {
      if (scroll.progress === last) return
      last = scroll.progress
      bar.current!.style.transform = `scaleX(${scroll.progress})`
    })
  }, [])

  useEffect(() => {
    if (!toast) return
    const id = setTimeout(clearToast, 3200)
    return () => clearTimeout(id)
  }, [toast, clearToast])

  const id = CHAPTERS[Math.min(chapter, CHAPTERS.length - 1)]

  return (
    <>
      <header className="hud">
        <div className="hud-logo">KC</div>
        <div className="hud-chapter">
          <span className="hud-ch-label">
            {t.nav.chapter} {chapter + 1}/{CHAPTERS.length}
          </span>
          <b>{t.chapters[id]}</b>
        </div>
        <button
          className="snd"
          aria-pressed={sound}
          aria-label={t.nav.sound}
          title={t.nav.sound}
          onClick={() => setSound(!sound)}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
            <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
            {sound ? (
              <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            ) : (
              <path d="M16 9l5 6M21 9l-5 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            )}
          </svg>
        </button>
        <div className="lang" role="group" aria-label="Language">
          {(['tr', 'en'] as const).map((l) => (
            <button key={l} aria-pressed={lang === l} onClick={() => setLang(l)}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="xp" aria-hidden>
          <div ref={bar} className="xp-fill" />
        </div>
      </header>
      <div className={`toast${toast ? ' show' : ''}`} role="status" aria-live="polite">
        {toast && (
          <>
            <span>✦ {t.ach.unlocked}</span>
            <b>{t.ach.items[toast]}</b>
          </>
        )}
      </div>
    </>
  )
}
