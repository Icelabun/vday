import React, { useEffect, useState } from 'react'
import Countdown from './Countdown'

// Rotating teaser messages
const TEASERS = [
  'Something special is coming… 💕',
  'Every second brings us closer ❤️',
  'I made this just for you 🥺',
  'A little surprise — with all my heart 💌',
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
      <div className="content">
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
