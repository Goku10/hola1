import { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

export default function AudioToggle() {
  const [enabled, setEnabled] = useState(false)
  const audioRef = useRef(null)

  const stopAudio = () => {
    if (!audioRef.current) return
    window.clearInterval(audioRef.current.chimeTimer)
    audioRef.current.context.close()
    audioRef.current = null
  }

  const startAudio = () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return
    const context = new AudioContext()
    const master = context.createGain()
    master.gain.value = 0.055
    master.connect(context.destination)

    const wind = context.createBufferSource()
    const buffer = context.createBuffer(1, context.sampleRate * 4, context.sampleRate)
    const data = buffer.getChannelData(0)
    for (let index = 0; index < data.length; index += 1) {
      data[index] = (Math.random() * 2 - 1) * 0.32
    }
    wind.buffer = buffer
    wind.loop = true
    const filter = context.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 380
    const windGain = context.createGain()
    windGain.gain.value = 0.2
    wind.connect(filter).connect(windGain).connect(master)
    wind.start()

    const chime = () => {
      if (context.state === 'closed') return
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      oscillator.type = 'sine'
      oscillator.frequency.value = [523.25, 659.25, 783.99][Math.floor(Math.random() * 3)]
      gain.gain.setValueAtTime(0, context.currentTime)
      gain.gain.linearRampToValueAtTime(0.16, context.currentTime + 0.08)
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 2.8)
      oscillator.connect(gain).connect(master)
      oscillator.start()
      oscillator.stop(context.currentTime + 3)
    }
    chime()
    const chimeTimer = window.setInterval(chime, 6800)
    audioRef.current = { context, chimeTimer }
  }

  useEffect(() => stopAudio, [])

  const toggle = () => {
    if (enabled) stopAudio()
    else startAudio()
    setEnabled((value) => !value)
  }

  return (
    <button
      className={`audio-toggle ${enabled ? 'playing' : ''}`}
      type="button"
      onClick={toggle}
      aria-label={enabled ? 'Mute forest ambience' : 'Play forest ambience'}
    >
      {enabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
      <span>{enabled ? 'Forest song' : 'Awaken sound'}</span>
      {enabled && <i className="audio-wave"><b /><b /><b /></i>}
    </button>
  )
}
