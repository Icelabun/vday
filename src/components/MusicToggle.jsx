import React, { useEffect, useRef, useState } from 'react'

// MusicToggle controls an <audio> element; if no audio file provided, uses WebAudio fallback
export default function MusicToggle({ id, src, afterDark = false }) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [playlist, setPlaylist] = useState([])
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(false)
  const ctxRef = useRef(null)

  useEffect(() => {
    // Fade in music button after a delay (staggered animation)
    const timer = setTimeout(() => {
      setVisible(true)
    }, 2000)
    return () => {
      clearTimeout(timer)
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
    if (!playing) {
      // choose source: playlist > src prop > default
      const chosen = playlist.length ? playlist[index].url : (src || '/music/celebrate.mp3')
      if (audioRef.current) {
        audioRef.current.src = chosen
        audioRef.current.volume = 1.0 // Reset volume when starting
      }

      if (audioRef.current && audioRef.current.src) {
        try {
          await audioRef.current.play()
        } catch (e) {
          // fallback to WebAudio if audio playback fails
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

  // advance to next track
  function nextTrack() {
    if (!playlist.length) return
    setIndex((s) => (s + 1) % playlist.length)
  }
  function prevTrack() {
    if (!playlist.length) return
    setIndex((s) => (s - 1 + playlist.length) % playlist.length)
  }

  // load playlist from /music/love/tracks.json or attempt directory listing
  useEffect(() => {
    let mounted = true
    async function loadList() {
      try {
        const res = await fetch('/music/love/tracks.json')
        if (res.ok) {
          const names = await res.json()
          if (Array.isArray(names) && mounted) {
            setPlaylist(names.map((n) => ({ name: n, url: `/music/love/${n}` })))
          }
          return
        }
      } catch (e) {}

      // attempt to fetch directory index (Vite dev server may return HTML)
      try {
        const r2 = await fetch('/music/love/')
        if (r2.ok) {
          const text = await r2.text()
          const matches = Array.from(text.matchAll(/href=\"([^\"]+\.(mp3|ogg|wav))\"/gi)).map(m=>m[1])
          if (matches.length && mounted) {
            setPlaylist(matches.map((n) => ({ name: decodeURIComponent(n.split('/').pop()), url: `/music/love/${decodeURIComponent(n.split('/').pop())}` })))
          }
        }
      } catch (e) {}
    }
    loadList()
    return () => { mounted = false }
  }, [])

  // when index changes, auto-play the next track if currently playing
  useEffect(() => {
    if (!audioRef.current) return
    if (playlist.length) {
      audioRef.current.src = playlist[index].url
      if (playing) audioRef.current.play().catch(()=>{})
    }
  }, [index, playlist])

  return (
    <div className={`music-toggle ${visible ? 'visible' : ''}`}>
      {visible && (
        <>
          <p className="music-cta">Press play. Trust me.</p>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <button onClick={prevTrack} className="btn-music">◀</button>
            <button onClick={toggle} className={`btn-music ${playing ? 'on' : 'off'}`}>
              {playing ? 'Pause Music ⏸️' : 'Play Music 🎵'}
            </button>
            <button onClick={nextTrack} className="btn-music">▶</button>
          </div>

          {playlist.length > 0 && (
            <div style={{marginTop:8,display:'flex',gap:8,alignItems:'center'}}>
              <label style={{fontSize:12,color:'#5f3b3b'}}>Playlist</label>
              <select value={index} onChange={(e)=>setIndex(Number(e.target.value))}>
                {playlist.map((p,i) => (
                  <option key={i} value={i}>{p.name}</option>
                ))}
              </select>
            </div>
          )}
        </>
      )}
      <audio ref={audioRef} id={id} src={src || '/music/celebrate.mp3'} preload="none" onEnded={() => { if (playlist.length) nextTrack(); }} />
    </div>
  )
}
