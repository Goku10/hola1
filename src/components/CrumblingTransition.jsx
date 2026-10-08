import { motion } from 'framer-motion'
import ParticleEngine from './ParticleEngine'

const COLS = 7
const ROWS = 5

const shards = Array.from({ length: COLS * ROWS }, (_, index) => {
  const col = index % COLS
  const row = Math.floor(index / COLS)
  const seed = ((index * 47) % 100) / 100
  return {
    id: index,
    left: `${(col / COLS) * 100}%`,
    top: `${(row / ROWS) * 100}%`,
    width: `${100 / COLS + 0.35}%`,
    height: `${100 / ROWS + 0.35}%`,
    backgroundPosition: `${(col / (COLS - 1)) * 100}% ${(row / (ROWS - 1)) * 100}%`,
    x: (seed - 0.5) * 420,
    y: 220 + ((index * 83) % 430),
    rotateX: (seed - 0.5) * 190,
    rotateY: (((index * 31) % 100) / 100 - 0.5) * 220,
    rotateZ: (seed - 0.5) * 70,
    delay: 0.68 + ((row + col) % 6) * 0.055,
    clipPath:
      index % 3 === 0
        ? 'polygon(0 0, 87% 5%, 100% 76%, 52% 100%, 0 83%)'
        : index % 3 === 1
          ? 'polygon(8% 0, 100% 0, 92% 88%, 34% 100%, 0 58%)'
          : 'polygon(0 12%, 64% 0, 100% 25%, 89% 100%, 12% 91%)',
  }
})

export default function CrumblingTransition({ reducedMotion }) {
  if (reducedMotion) {
    return (
      <section className="crumble-screen">
        <motion.div
          className="reduced-flash"
          initial={{ opacity: 0, scale: 0.2 }}
          animate={{ opacity: [0, 1, 0], scale: 2.5 }}
          transition={{ duration: 0.65 }}
        />
      </section>
    )
  }

  return (
    <section className="crumble-screen">
      <div className="portal-preview" />
      <ParticleEngine mode="cinder" />

      <motion.div
        className="overload-sigil"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1, 1.25, 2] }}
        transition={{ duration: 1.7, times: [0, 0.18, 0.58, 1] }}
      >
        <span>ᚦ</span>
      </motion.div>

      <motion.svg
        className="cracks"
        viewBox="0 0 1000 700"
        preserveAspectRatio="none"
        initial="hidden"
        animate="visible"
      >
        {[
          'M500 350 438 241 340 178 260 50',
          'M500 350 587 265 658 136 720 0',
          'M500 350 632 363 774 320 1000 347',
          'M500 350 556 447 532 556 612 700',
          'M500 350 392 420 290 495 206 700',
          'M500 350 355 327 193 265 0 290',
          'M438 241 466 154 420 75',
          'M632 363 716 447 857 491',
          'M392 420 302 392 190 410',
        ].map((path, index) => (
          <motion.path
            key={path}
            d={path}
            variants={{
              hidden: { pathLength: 0, opacity: 0 },
              visible: { pathLength: 1, opacity: [0, 1, 1, 0.45] },
            }}
            transition={{ duration: 0.55, delay: 0.18 + index * 0.035 }}
          />
        ))}
      </motion.svg>

      <div className="shard-field" aria-hidden="true">
        {shards.map((shard) => (
          <motion.div
            key={shard.id}
            className="wall-shard"
            style={{
              left: shard.left,
              top: shard.top,
              width: shard.width,
              height: shard.height,
              backgroundPosition: shard.backgroundPosition,
              clipPath: shard.clipPath,
            }}
            initial={{ x: 0, y: 0, rotateX: 0, rotateY: 0, rotateZ: 0, opacity: 1, scale: 1 }}
            animate={{
              x: shard.x,
              y: shard.y,
              rotateX: shard.rotateX,
              rotateY: shard.rotateY,
              rotateZ: shard.rotateZ,
              opacity: [1, 1, 0],
              scale: [1, 0.96, 0.35],
              filter: ['brightness(1)', 'brightness(2.6)', 'brightness(0.3)'],
            }}
            transition={{ duration: 1.8, delay: shard.delay, ease: [0.22, 0.72, 0.26, 1] }}
          />
        ))}
      </div>

      <motion.div
        className="portal-flash"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 0.15, 1.7, 4], opacity: [0, 1, 0.9, 0] }}
        transition={{ duration: 2.1, delay: 1.05, times: [0, 0.22, 0.64, 1], ease: 'easeOut' }}
      />

      <motion.p
        className="threshold-text"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: [0, 1, 1, 0], y: [8, 0, 0, -8] }}
        transition={{ duration: 2.2, delay: 0.15 }}
      >
        The old word is remembered
      </motion.p>
    </section>
  )
}
