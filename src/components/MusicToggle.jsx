import React, { useEffect, useRef, useState } from 'react'

// MusicToggle controls an <audio> element; if no audio file provided, uses WebAudio fallback
export default function MusicToggle({ id }) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const ctxRef = useRef(null)

  useEffect(() => {
    return () => {
      if (ctxRef.current) ctxRef.current.close()
    }
  }, [])

  async function startFallbackMusic() {
    // simple arpeggio-like melody using WebAudio
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    ctxRef.current = ctx
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.connect(gain)
    gain.connect(ctx.destination)
    gain.gain.value = 0
    osc.start()

    const notes = [440, 523.25, 659.25, 880]
    notes.forEach((freq, i) => {
      osc.frequency.setValueAtTime(freq, now + i * 0.45)
      gain.gain.setValueAtTime(0.12, now + i * 0.45)
      gain.gain.linearRampToValueAtTime(0.0, now + i * 0.45 + 0.4)
    })

    // loop short melody
    const interval = setInterval(() => {
      const t = ctx.currentTime
      notes.forEach((freq, i) => {
        osc.frequency.setValueAtTime(freq, t + i * 0.45)
        gain.gain.setValueAtTime(0.12, t + i * 0.45)
        gain.gain.linearRampToValueAtTime(0.0, t + i * 0.45 + 0.4)
      })
    }, 2000)

    return () => {
      clearInterval(interval)
      osc.stop()
      ctx.close()
    }
  }

  async function toggle() {
    // Try HTML audio first (file can be placed in /public/music/celebrate.mp3)
    if (!playing) {
      if (audioRef.current && audioRef.current.src) {
        try {
          await audioRef.current.play()
        } catch (e) {
          // user gesture required; proceed to fallback
          await startFallbackMusic()
        }
      } else {
        await startFallbackMusic()
      }
      setPlaying(true)
    } else {
      if (audioRef.current && !audioRef.current.paused) audioRef.current.pause()
      if (ctxRef.current) {
        ctxRef.current.close()
        ctxRef.current = null
      }
      setPlaying(false)
    }
  }

  return (
    <div className="music-toggle">
      <button onClick={toggle} className={`btn-music ${playing ? 'on' : 'off'}`}>
        {playing ? 'Pause Music' : 'Play Music'}
      </button>
      <audio ref={audioRef} id={id} src="/music/celebrate.mp3" loop preload="none" />
    </div>
  )
}
