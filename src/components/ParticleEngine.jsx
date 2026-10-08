import { useEffect, useRef } from 'react'

const PALETTES = {
  ember: ['245, 203, 113', '120, 255, 196', '255, 241, 184'],
  realm: ['108, 255, 222', '242, 199, 104', '160, 141, 255'],
  cinder: ['255, 225, 145', '255, 166, 70', '255, 248, 216'],
}

export default function ParticleEngine({ mode = 'ember', className = '' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d', { alpha: true })
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const pointer = { x: -9999, y: -9999 }
    let frame
    let width = 0
    let height = 0
    let particles = []

    const makeParticle = (initial = false) => {
      const isRealm = mode === 'realm'
      return {
        x: Math.random() * width,
        y: initial ? Math.random() * height : height + 12,
        radius: Math.random() * (isRealm ? 2.2 : 1.6) + 0.5,
        vx: (Math.random() - 0.5) * (isRealm ? 0.24 : 0.12),
        vy: -(Math.random() * 0.18 + (isRealm ? 0.04 : 0.09)),
        drift: Math.random() * Math.PI * 2,
        pulse: Math.random() * Math.PI * 2,
        color: PALETTES[mode][Math.floor(Math.random() * PALETTES[mode].length)],
        alpha: Math.random() * 0.55 + 0.2,
      }
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = reduced ? 12 : Math.min(72, Math.floor((width * height) / 18000))
      particles = Array.from({ length: count }, () => makeParticle(true))
    }

    const movePointer = (event) => {
      pointer.x = event.clientX
      pointer.y = event.clientY
    }

    const draw = (time) => {
      context.clearRect(0, 0, width, height)
      particles.forEach((particle, index) => {
        particle.drift += 0.008
        particle.pulse += 0.018
        particle.x += particle.vx + Math.sin(particle.drift) * 0.08
        particle.y += particle.vy

        const dx = particle.x - pointer.x
        const dy = particle.y - pointer.y
        const distance = Math.hypot(dx, dy)
        if (distance < 90 && distance > 1) {
          particle.x += (dx / distance) * 0.6
          particle.y += (dy / distance) * 0.6
        }

        if (particle.y < -15 || particle.x < -15 || particle.x > width + 15) {
          particles[index] = makeParticle()
          return
        }

        const glow = particle.radius * 5
        const alpha = particle.alpha * (0.65 + Math.sin(particle.pulse) * 0.35)
        const gradient = context.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          glow,
        )
        gradient.addColorStop(0, `rgba(${particle.color}, ${alpha})`)
        gradient.addColorStop(0.25, `rgba(${particle.color}, ${alpha * 0.45})`)
        gradient.addColorStop(1, `rgba(${particle.color}, 0)`)
        context.fillStyle = gradient
        context.beginPath()
        context.arc(particle.x, particle.y, glow, 0, Math.PI * 2)
        context.fill()
      })
      frame = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize, { passive: true })
    window.addEventListener('pointermove', movePointer, { passive: true })
    frame = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', movePointer)
    }
  }, [mode])

  return <canvas ref={canvasRef} className={`particle-canvas ${className}`} aria-hidden="true" />
}
