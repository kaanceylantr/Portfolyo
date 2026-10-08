/** Small WebAudio kit: soft piano notes, UI chime and a whoosh. Created lazily on first use. */

let ctx: AudioContext | null = null
let master: GainNode | null = null

function ensure(): AudioContext | null {
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    ctx = new AC()
    master = ctx.createGain()
    master.gain.value = 0.7
    master.connect(ctx.destination)
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

function tone(freq: number, opts: { dur?: number; gain?: number; type?: OscillatorType; at?: number } = {}) {
  const c = ensure()
  if (!c || !master) return
  const { dur = 1.5, gain = 0.22, type = 'triangle', at = 0 } = opts
  const t0 = c.currentTime + at
  const lp = c.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = Math.min(6000, freq * 6)
  const env = c.createGain()
  env.gain.setValueAtTime(0.0001, t0)
  env.gain.exponentialRampToValueAtTime(gain, t0 + 0.006)
  env.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  lp.connect(env).connect(master)
  // fundamental + two softer partials give a piano-ish body
  for (const [mult, g, kind] of [[1, 1, type], [2, 0.28, 'sine'], [3, 0.1, 'sine']] as const) {
    const o = c.createOscillator()
    o.type = kind
    o.frequency.value = freq * mult
    const og = c.createGain()
    og.gain.value = g
    o.connect(og).connect(lp)
    o.start(t0)
    o.stop(t0 + dur + 0.05)
  }
}

export const audio = {
  note: (freq: number) => tone(freq, { dur: 1.6, gain: 0.24 }),
  thud: () => tone(110, { dur: 0.18, gain: 0.3, type: 'sine' }),
  chime() {
    tone(1318.5, { dur: 0.7, gain: 0.1, type: 'sine' })
    tone(1760, { dur: 0.9, gain: 0.1, type: 'sine', at: 0.09 })
  },
  whoosh() {
    const c = ensure()
    if (!c || !master) return
    const len = Math.floor(c.sampleRate * 0.7)
    const buf = c.createBuffer(1, len, c.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
    const src = c.createBufferSource()
    src.buffer = buf
    const bp = c.createBiquadFilter()
    bp.type = 'bandpass'
    bp.Q.value = 1.2
    const t0 = c.currentTime
    bp.frequency.setValueAtTime(300, t0)
    bp.frequency.exponentialRampToValueAtTime(2600, t0 + 0.55)
    const g = c.createGain()
    g.gain.setValueAtTime(0.0001, t0)
    g.gain.exponentialRampToValueAtTime(0.09, t0 + 0.2)
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.7)
    src.connect(bp).connect(g).connect(master)
    src.start(t0)
  },
}
