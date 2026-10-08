import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Eye, EyeOff, KeyRound } from 'lucide-react'
import ParticleEngine from './ParticleEngine'

const SECRET = 'mellon'

function playRumble() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    const audio = new AudioContext()
    const oscillator = audio.createOscillator()
    const gain = audio.createGain()
    oscillator.type = 'sawtooth'
    oscillator.frequency.setValueAtTime(58, audio.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(28, audio.currentTime + 0.35)
    gain.gain.setValueAtTime(0.045, audio.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.38)
    oscillator.connect(gain).connect(audio.destination)
    oscillator.start()
    oscillator.stop(audio.currentTime + 0.4)
    oscillator.addEventListener('ended', () => audio.close(), { once: true })
  } catch {
    // Audio is decorative; unsupported browsers still receive visual feedback.
  }
}

export default function VaultLockScreen({ onUnlock }) {
  const [key, setKey] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [errorCount, setErrorCount] = useState(0)
  const [error, setError] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => () => window.clearTimeout(timerRef.current), [])

  const submit = (event) => {
    event.preventDefault()
    window.clearTimeout(timerRef.current)
    if (key.trim().toLowerCase() === SECRET) {
      setError(false)
      onUnlock()
      return
    }
    setError(true)
    setErrorCount((count) => count + 1)
    playRumble()
    timerRef.current = window.setTimeout(() => setError(false), 2400)
  }

  return (
    <section className={`vault-screen ${error ? 'vault-error' : ''}`}>
      <div className="vault-aurora" aria-hidden="true" />
      <div className="vault-stars" aria-hidden="true" />
      <ParticleEngine mode="ember" />

      <div className="top-mark" aria-hidden="true">
        <span />
        <svg viewBox="0 0 64 64">
          <path d="M32 5 38 23 56 32 38 39 32 58 25 39 7 32 25 23Z" />
          <circle cx="32" cy="32" r="5" />
        </svg>
        <span />
      </div>

      <motion.div
        key={errorCount}
        className="vault-wrap"
        animate={error ? { x: [0, -15, 13, -10, 8, -4, 0], rotate: [0, -0.7, 0.5, -0.4, 0] } : {}}
        transition={{ duration: 0.48, ease: 'easeInOut' }}
      >
        <div className="vault-rings" aria-hidden="true">
          <div className="ring ring-one" />
          <div className="ring ring-two" />
          <div className="rune-orbit">
            {['ᚠ', 'ᛇ', 'ᚱ', 'ᚷ', 'ᛖ', 'ᚾ', 'ᛟ', 'ᛏ'].map((rune, index) => (
              <span key={rune} style={{ '--i': index }}>{rune}</span>
            ))}
          </div>
        </div>

        <div className="vault-card">
          <div className="corner corner-tl" />
          <div className="corner corner-tr" />
          <div className="corner corner-bl" />
          <div className="corner corner-br" />
          <motion.div
            className="key-sigil"
            animate={{ boxShadow: ['0 0 18px #72ddb044', '0 0 36px #dabd7077', '0 0 18px #72ddb044'] }}
            transition={{ repeat: Infinity, duration: 3.2 }}
          >
            <KeyRound strokeWidth={1.2} />
          </motion.div>

          <p className="eyebrow">The first gate of Aelinor</p>
          <h1>Speak, friend, and enter</h1>
          <p className="invitation">
            Beyond the veil, the stars remember.<br />
            Whisper the ancient word to cross the threshold.
          </p>

          <form onSubmit={submit} className="key-form">
            <label htmlFor="rune-key">Enter the rune key</label>
            <div className="input-shell">
              <span className="input-rune">ᚦ</span>
              <input
                id="rune-key"
                type="text"
                value={key}
                onChange={(event) => {
                  setKey(event.target.value)
                  setError(false)
                }}
                placeholder="The word lies sleeping…"
                autoComplete="off"
                spellCheck="false"
                autoFocus
                aria-invalid={error}
                aria-describedby="key-feedback"
              />
              <div className="input-glint" />
            </div>
            <p id="key-feedback" className={`feedback ${error ? 'visible' : ''}`} role="status">
              The stone rejects your word.
            </p>

            <motion.button
              type="submit"
              className="unlock-button"
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Awaken the gate</span>
              <ArrowRight size={17} />
              <i className="button-spark s1" />
              <i className="button-spark s2" />
              <i className="button-spark s3" />
            </motion.button>
          </form>

          <button
            className="hint-button"
            type="button"
            onClick={() => setShowHint((visible) => !visible)}
            aria-expanded={showHint}
          >
            {showHint ? <EyeOff size={14} /> : <Eye size={14} />}
            {showHint ? <>The elven word is <strong>mellon</strong></> : 'A whisper from the old tongue'}
          </button>
        </div>
      </motion.div>

      <p className="vault-footer"><span>✦</span> Not all who wander are lost <span>✦</span></p>
    </section>
  )
}
