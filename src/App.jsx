import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import VaultLockScreen from './components/VaultLockScreen'
import CrumblingTransition from './components/CrumblingTransition'
import ElvishLandscape from './components/ElvishLandscape'

export const PHASES = {
  LOCKED: 'LOCKED',
  CRUMBLING: 'CRUMBLING',
  UNLOCKED: 'UNLOCKED',
}

export default function App() {
  const [phase, setPhase] = useState(PHASES.LOCKED)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key.toLowerCase() === 'r' && event.shiftKey) {
        setPhase(PHASES.LOCKED)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const unlock = () => {
    setPhase(PHASES.CRUMBLING)
    window.setTimeout(
      () => setPhase(PHASES.UNLOCKED),
      reduceMotion ? 700 : 3400,
    )
  }

  return (
    <main className="app-shell">
      <AnimatePresence mode="wait">
        {phase === PHASES.LOCKED && (
          <motion.div key="locked" className="phase-layer" exit={{ opacity: 0 }}>
            <VaultLockScreen onUnlock={unlock} />
          </motion.div>
        )}

        {phase === PHASES.CRUMBLING && (
          <motion.div key="crumbling" className="phase-layer">
            <CrumblingTransition reducedMotion={reduceMotion} />
          </motion.div>
        )}

        {phase === PHASES.UNLOCKED && (
          <motion.div
            key="unlocked"
            className="phase-layer"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <ElvishLandscape />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
