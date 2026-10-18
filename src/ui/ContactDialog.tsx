import { useEffect, useRef, useState } from 'react'
import { useStore } from '../app/store'
import { useT } from '../app/i18n'
import { LINKS, MAIL } from '../content/links'

/** Contact box: shows the address and offers copy / Gmail / mail app, so it works without a desktop mail client. */
export function ContactDialog() {
  const t = useT()
  const contact = useStore((s) => s.contact)
  const close = useStore((s) => s.closeContact)
  const [copied, setCopied] = useState(false)
  const first = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!contact) return
    setCopied(false)
    first.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [contact, close])

  if (!contact) return null

  const q = (k: string, v?: string) => (v ? `&${k}=${encodeURIComponent(v)}` : '')
  const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${MAIL}${q('su', contact.subject)}${q('body', contact.body)}`
  const mailto = `mailto:${MAIL}${contact.subject || contact.body ? '?' : ''}${[
    contact.subject && `subject=${encodeURIComponent(contact.subject)}`,
    contact.body && `body=${encodeURIComponent(contact.body)}`,
  ]
    .filter(Boolean)
    .join('&')}`

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(MAIL)
    } catch {
      // older browsers: copy through a temporary input
      const i = document.createElement('input')
      i.value = MAIL
      document.body.appendChild(i)
      i.select()
      document.execCommand('copy')
      i.remove()
    }
    setCopied(true)
  }

  return (
    <div className="cbox-back" onClick={close}>
      <div className="cbox" role="dialog" aria-modal="true" aria-labelledby="cbox-t" onClick={(e) => e.stopPropagation()}>
        <h2 id="cbox-t">{t.contactBox.title}</h2>
        <p className="cbox-sub">{t.contactBox.sub}</p>
        <p className="cbox-mail" aria-live="polite">
          {MAIL}
        </p>
        <div className="cbox-actions">
          <button ref={first} className="cta" onClick={copy}>
            {copied ? t.contactBox.copied : t.contactBox.copy}
          </button>
          <a className="ghost" href={gmail} target="_blank" rel="noreferrer">
            {t.contactBox.gmail} ↗
          </a>
          <a className="ghost" href={mailto}>
            {t.contactBox.app}
          </a>
        </div>
        <div className="cbox-links">
          {LINKS.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noreferrer">
              {l.label} ↗
            </a>
          ))}
        </div>
        <button className="cbox-x" onClick={close} aria-label={t.contactBox.close}>
          ✕
        </button>
      </div>
    </div>
  )
}
