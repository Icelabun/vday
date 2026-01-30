import React, { useEffect, useState } from 'react'
import Countdown from './Countdown'

// Rotating teaser messages
const TEASERS = [
  'Something special is coming… 💕',
  'Every second brings us closer ❤️',
  'I made this just for you 🥺',
  'Be patient… it\'s worth it 😌',
]

export default function PreReveal({ targetDate, now }) {
  const [i, setI] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setI((s) => (s + 1) % TEASERS.length), 4000)
    return () => clearInterval(t)
  }, [])

  return (
    <main className="pre-reveal">
      <div className="soft-bg" />
      <div className="content" onMouseMove={(e)=>{
        // subtle parallax on content
        const el = e.currentTarget
        const rect = el.getBoundingClientRect()
        const x = (e.clientX - rect.left - rect.width/2)/rect.width
        const y = (e.clientY - rect.top - rect.height/2)/rect.height
        el.style.setProperty('--px', `${x*6}px`)
        el.style.setProperty('--py', `${y*6}px`)
      }}>
        <h1 className="fade-in">A Little Surprise</h1>
        <Countdown targetDate={targetDate} now={now} />

        <div className="teaser fade-in-2">{TEASERS[i]}</div>

        <div className="scene">
          <div className="hearts">
            <div className="heart h1" />
            <div className="heart h2" />
            <div className="heart h3" />
          </div>

          <div className="characters">
            <div className="cat" aria-hidden>
              <div className="cat-body" />
              <div className="cat-tail" />
              <div className="cat-eye left" />
              <div className="cat-eye right" />
            </div>

            <div className="bear" aria-hidden>
              <div className="bear-body" />
              <div className="bear-arm left" />
              <div className="bear-arm right" />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
