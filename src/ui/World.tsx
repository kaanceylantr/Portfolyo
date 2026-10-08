import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useStore } from '../app/store'
import { useT } from '../app/i18n'
import { CHAPTERS, CHAPTER_WORLD, WORLDS, type World as WorldId } from '../content/chapters'
import { reducedMotion } from '../engine/perf'
import { audio } from '../engine/audio'

/** Where the reveal wipe starts for each world. */
const ORIGIN: Record<WorldId, string> = {
  space: '50% 30%',
  crystal: '80% 15%',
  obsidian: '50% 100%',
  village: '50% 55%',
}

function Space() {
  return (
    <>
      <i className="cloud c1" />
      <i className="cloud c2" />
      <i className="cloud c3" />
      <i className="cloud c4" />
      <i className="planet" />
    </>
  )
}

function Crystal() {
  return (
    <>
      <i className="cloud c1" />
      <i className="cloud c2" />
      <svg className="scene" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <defs>
          <linearGradient id="kg1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.9" />
            <stop offset="1" stopColor="#b9c9ff" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="kg2" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e6fbff" stopOpacity="0.95" />
            <stop offset="1" stopColor="#8fdcff" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="kg3" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#fff0fb" stopOpacity="0.85" />
            <stop offset="1" stopColor="#f3b8e0" stopOpacity="0.12" />
          </linearGradient>
        </defs>
        <g className="bob b1">
          <polygon points="1030,560 1180,300 1330,560 1180,760" fill="url(#kg1)" />
          <polygon points="1030,560 1180,300 1180,760" fill="url(#kg2)" opacity="0.6" />
          <polygon points="1180,300 1330,560 1180,760" fill="url(#kg3)" opacity="0.45" />
        </g>
        <g className="bob b2">
          <polygon points="1260,200 1330,90 1400,200 1330,300" fill="url(#kg2)" />
          <polygon points="1260,200 1330,90 1330,300" fill="url(#kg1)" opacity="0.7" />
        </g>
        <g className="bob b3">
          <polygon points="-40,640 90,420 220,640 90,860" fill="url(#kg3)" />
          <polygon points="-40,640 90,420 90,860" fill="url(#kg1)" opacity="0.6" />
        </g>
        <g className="bob b4">
          <polygon points="360,120 420,40 480,120 420,200" fill="url(#kg1)" />
          <polygon points="860,760 910,690 960,760 910,830" fill="url(#kg2)" />
        </g>
      </svg>
    </>
  )
}

function Obsidian() {
  return (
    <svg className="scene" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" aria-hidden>
      <defs>
        <radialGradient id="og1" cx="0.5" cy="1" r="0.75">
          <stop offset="0" stopColor="#ff6a2a" stopOpacity="0.55" />
          <stop offset="0.5" stopColor="#c2331a" stopOpacity="0.22" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="og2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd27a" />
          <stop offset="0.45" stopColor="#ff7a3d" />
          <stop offset="1" stopColor="#c2331a" />
        </linearGradient>
      </defs>
      <rect className="heat" width="1440" height="900" fill="url(#og1)" />
      <path d="M470 900 L690 430 L735 392 L790 392 L835 430 L1060 900Z" fill="#150d11" />
      <ellipse className="crater" cx="762" cy="396" rx="48" ry="11" fill="#ff8a4a" />
      <g fill="none" strokeLinecap="round">
        <path d="M758 400 C 740 500 700 560 690 650 S 640 800 620 900" stroke="#ff6a2a" strokeOpacity="0.25" strokeWidth="18" />
        <path d="M758 400 C 740 500 700 560 690 650 S 640 800 620 900" stroke="url(#og2)" strokeWidth="5" />
        <path d="M770 402 C 800 520 850 600 840 700 S 900 820 930 900" stroke="#ff6a2a" strokeOpacity="0.25" strokeWidth="14" />
        <path d="M770 402 C 800 520 850 600 840 700 S 900 820 930 900" stroke="url(#og2)" strokeWidth="4" />
      </g>
      <g fill="#0c070a" stroke="#ff7a3d" strokeOpacity="0.35" strokeWidth="1.2">
        <polygon points="80,900 150,640 230,760 300,560 380,900" />
        <polygon points="1080,900 1170,600 1240,720 1330,520 1420,900" />
        <polygon points="-20,900 40,760 120,900" />
        <polygon points="1300,900 1380,780 1460,900" />
      </g>
      <g className="bob b1" fill="#120a0e" stroke="#ff7a3d" strokeOpacity="0.4" strokeWidth="1">
        <polygon points="1120,180 1160,120 1200,190 1160,250" />
        <polygon points="260,260 290,210 330,270 292,320" />
      </g>
    </svg>
  )
}

function Village() {
  const tree = (x: number, y: number, s: number, c = '#4fb35f') => (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-5" y="-4" width="10" height="26" rx="4" fill="#8a5a3c" />
      <circle cy="-22" r="28" fill={c} />
      <circle cx="-14" cy="-10" r="18" fill={c} />
      <circle cx="14" cy="-10" r="18" fill={c} />
    </g>
  )
  const house = (x: number, y: number, roof: string) => (
    <g transform={`translate(${x} ${y})`}>
      <rect x="0" y="0" width="64" height="46" rx="8" fill="#fff3dc" />
      <polygon points="-8,4 32,-34 72,4" fill={roof} />
      <rect x="24" y="18" width="16" height="28" rx="8" fill="#8a5a3c" />
      <rect x="6" y="12" width="12" height="12" rx="4" fill="#9fd8f5" />
    </g>
  )
  return (
    <>
      <i className="sun" />
      {[1, 2, 3].map((n) => (
        <svg key={n} className={`puff p${n}`} viewBox="0 0 200 90" aria-hidden>
          <g fill="#fff">
            <circle cx="60" cy="52" r="32" />
            <circle cx="100" cy="38" r="38" />
            <circle cx="142" cy="54" r="30" />
            <rect x="40" y="52" width="130" height="32" rx="16" />
          </g>
        </svg>
      ))}
      <svg className="scene" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" aria-hidden>
        <path d="M0 650 C 200 570 380 610 560 650 S 900 610 1100 640 S 1340 610 1440 630 V900 H0Z" fill="#b6e99c" />
        <g transform="translate(1030 478)">
          <rect x="44" y="62" width="150" height="112" rx="8" fill="#f6ead2" />
          <rect x="0" y="42" width="52" height="132" rx="8" fill="#efdfc0" />
          <rect x="186" y="42" width="52" height="132" rx="8" fill="#efdfc0" />
          <polygon points="-10,46 26,-10 62,46" fill="#e8583f" />
          <polygon points="176,46 212,-10 248,46" fill="#e8583f" />
          <path d="M84 174 v-42 a35 35 0 0 1 70 0 v42Z" fill="#8a5a3c" />
          <rect x="16" y="84" width="16" height="26" rx="8" fill="#7a5a8c" />
          <rect x="206" y="84" width="16" height="26" rx="8" fill="#7a5a8c" />
          <line x1="26" y1="-10" x2="26" y2="-36" stroke="#8a5a3c" strokeWidth="3" />
          <polygon points="26,-36 56,-28 26,-20" fill="#ff8f3d" />
        </g>
        <path d="M0 720 C 240 650 420 700 640 730 S 1020 690 1200 710 S 1380 700 1440 700 V900 H0Z" fill="#8bdc8c" />
        {house(820, 650, '#e8583f')}
        {house(930, 668, '#ff8f3d')}
        {tree(760, 700, 0.9)}
        {tree(1010, 690, 0.8, '#5cc46a')}
        {tree(1360, 690, 1.1)}
        <path d="M0 800 C 300 740 520 790 760 800 S 1200 770 1440 790 V900 H0Z" fill="#5fbf6a" />
        {tree(140, 780, 1.3, '#47a85a')}
        {tree(1290, 800, 1.5, '#47a85a')}
        <g>
          {[[260, 840, '#fff'], [420, 855, '#ffd84a'], [600, 845, '#fff'], [900, 850, '#ffd84a'], [1100, 842, '#fff'], [1190, 860, '#ffd84a']].map(
            ([x, y, c], i) => (
              <circle key={i} cx={x as number} cy={y as number} r="6" fill={c as string} />
            ),
          )}
        </g>
      </svg>
    </>
  )
}

const SCENES: Record<WorldId, () => React.JSX.Element> = {
  space: () => <Space />,
  crystal: () => <Crystal />,
  obsidian: () => <Obsidian />,
  village: () => <Village />,
}

export function World() {
  const t = useT()
  const chapter = useStore((s) => s.chapter)
  const layers = useRef<Partial<Record<WorldId, HTMLDivElement | null>>>({})
  const current = useRef<WorldId>('space')
  const z = useRef(1)
  const [card, setCard] = useState<{ world: WorldId; key: number } | null>(null)

  useEffect(() => {
    const next = CHAPTER_WORLD[CHAPTERS[Math.min(chapter, CHAPTERS.length - 1)]]
    if (next === current.current) return
    current.current = next
    const el = layers.current[next]
    if (!el) return
    const setWorld = () => {
      document.documentElement.dataset.world = next
    }
    const settle = () => {
      WORLDS.forEach((w) => w !== next && layers.current[w]?.classList.remove('on'))
      el.style.clipPath = ''
    }
    setCard({ world: next, key: Date.now() })
    if (useStore.getState().sound) audio.whoosh()
    z.current += 1
    el.style.zIndex = String(z.current)
    el.classList.add('on')
    if (reducedMotion) {
      setWorld()
      settle()
      return
    }
    const at = ORIGIN[next]
    gsap.killTweensOf(el)
    gsap.fromTo(
      el,
      { clipPath: `circle(0% at ${at})` },
      { clipPath: `circle(150% at ${at})`, duration: 1.1, ease: 'power2.inOut', onComplete: settle },
    )
    gsap.delayedCall(0.4, setWorld)
  }, [chapter])

  return (
    <>
      <div className="worlds" aria-hidden>
        {WORLDS.map((w) => (
          <div
            key={w}
            ref={(n) => {
              layers.current[w] = n
            }}
            className={`w-layer w-${w}${w === 'space' ? ' on' : ''}`}
          >
            {SCENES[w]()}
          </div>
        ))}
      </div>
      {card && (
        <div key={card.key} className="world-card" onAnimationEnd={() => setCard(null)} aria-hidden>
          <small>
            {t.worldLabel} {WORLDS.indexOf(card.world) + 1}
          </small>
          <b>{t.worlds[card.world]}</b>
        </div>
      )}
    </>
  )
}
