import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, BookOpen, Compass, MoonStar, Sparkles } from 'lucide-react'
import ParticleEngine from './ParticleEngine'
import AudioToggle from './AudioToggle'

const paths = [
  {
    icon: Compass,
    number: 'I',
    title: 'The Silver Path',
    copy: 'Follow the river where starlight gathers in the reeds.',
    tone: 'cyan',
  },
  {
    icon: BookOpen,
    number: 'II',
    title: 'The Living Archive',
    copy: 'Listen closely. The oldest trees still keep every story.',
    tone: 'gold',
  },
  {
    icon: Sparkles,
    number: 'III',
    title: 'The Star Garden',
    copy: 'A quiet place where forgotten wishes begin to bloom.',
    tone: 'violet',
  },
]

export default function ElvishLandscape() {
  const sceneRef = useRef(null)
  const frameRef = useRef(null)
  const [selectedPath, setSelectedPath] = useState(null)

  useEffect(() => {
    const scene = sceneRef.current
    const onPointerMove = (event) => {
      cancelAnimationFrame(frameRef.current)
      frameRef.current = requestAnimationFrame(() => {
        const x = (event.clientX / window.innerWidth - 0.5) * 2
        const y = (event.clientY / window.innerHeight - 0.5) * 2
        scene.style.setProperty('--mx', x.toFixed(3))
        scene.style.setProperty('--my', y.toFixed(3))
      })
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('pointermove', onPointerMove)
    }
  }, [])

  return (
    <section ref={sceneRef} className="realm-scene">
      <div className="realm-sky parallax-far" />
      <div className="stars-layer parallax-far" aria-hidden="true" />
      <div className="moon" aria-hidden="true"><span /></div>
      <div className="mountains parallax-far" aria-hidden="true" />
      <div className="distant-city parallax-mid" aria-hidden="true">
        <i /><i /><i /><i /><i />
      </div>
      <div className="tree-canopy parallax-near" aria-hidden="true" />
      <div className="ancient-tree tree-left parallax-near" aria-hidden="true">
        <i className="branch b1" /><i className="branch b2" /><i className="branch b3" />
        <div className="vines">{Array.from({ length: 7 }, (_, i) => <span key={i} />)}</div>
      </div>
      <div className="ancient-tree tree-right parallax-near" aria-hidden="true">
        <i className="branch b1" /><i className="branch b2" /><i className="branch b3" />
        <div className="vines">{Array.from({ length: 6 }, (_, i) => <span key={i} />)}</div>
      </div>
      <div className="river" aria-hidden="true">
        <div className="river-glow" />
        <div className="water-lines"><span /><span /><span /><span /></div>
      </div>
      <div className="foreground parallax-near" aria-hidden="true" />
      <div className="mist mist-one" aria-hidden="true" />
      <div className="mist mist-two" aria-hidden="true" />
      <div className="falling-leaves" aria-hidden="true">
        {Array.from({ length: 12 }, (_, i) => <i key={i} style={{ '--leaf': i }} />)}
      </div>
      <ParticleEngine mode="realm" />

      <nav className="realm-nav" aria-label="Sanctuary navigation">
        <a className="realm-brand" href="#sanctuary" aria-label="Aelinor sanctuary">
          <MoonStar />
          <span>Aelinor<small>Beyond the veil</small></span>
        </a>
        <div className="nav-center" aria-hidden="true">
          <span />
          <b>ᚠ</b>
          <span />
        </div>
        <AudioToggle />
      </nav>

      <motion.div
        id="sanctuary"
        className="sanctuary-content"
        initial={{ opacity: 0, y: 36 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="welcome-mark"><span>ᚦ</span></div>
        <p className="realm-eyebrow"><i /> The hidden realm has opened <i /></p>
        <h1>Welcome, wayfarer</h1>
        <p className="realm-lede">
          You have crossed the quiet threshold into <em>Aelinor</em>, where
          moonlit waters carry the memories of stars.
        </p>

        <div className="path-grid">
          {paths.map((path, index) => {
            const Icon = path.icon
            return (
              <motion.button
                key={path.title}
                type="button"
                className={`path-card path-${path.tone} ${selectedPath === index ? 'selected' : ''}`}
                onClick={() => setSelectedPath(index === selectedPath ? null : index)}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.14, duration: 0.8 }}
                whileHover={{ y: -7 }}
              >
                <span className="card-number">{path.number}</span>
                <span className="card-icon"><Icon strokeWidth={1.3} /></span>
                <span className="card-copy">
                  <strong>{path.title}</strong>
                  <small>{path.copy}</small>
                </span>
                <ArrowUpRight className="card-arrow" size={18} />
                <span className="card-shine" />
              </motion.button>
            )
          })}
        </div>

        <motion.div
          className="lore-response"
          animate={{ height: selectedPath === null ? 0 : 'auto', opacity: selectedPath === null ? 0 : 1 }}
        >
          {selectedPath !== null && (
            <p><Sparkles size={14} /> {paths[selectedPath].title} remembers your choosing. The way will open soon.</p>
          )}
        </motion.div>
      </motion.div>

      <div className="scroll-whisper" aria-hidden="true">
        <span>Explore the sanctuary</span>
        <i />
      </div>
    </section>
  )
}
