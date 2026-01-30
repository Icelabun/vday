import React, { useEffect, useRef, useState } from 'react'

// Typewriter helper
function useTypewriter(lines, speed = 40, gap = 700) {
  const [textLines, setTextLines] = useState(lines.map(() => ''))
  const idxRef = useRef(0)

  useEffect(() => {
    let letterTimer = null
    let pauseTimer = null

    function startLine() {
      const lineIdx = idxRef.current
      const target = lines[lineIdx]
      let pos = 0
      letterTimer = setInterval(() => {
        pos++
        setTextLines((prev) => {
          const copy = [...prev]
          copy[lineIdx] = target.slice(0, pos)
          return copy
        })
        if (pos >= target.length) {
          clearInterval(letterTimer)
          pauseTimer = setTimeout(() => {
            idxRef.current++
            if (idxRef.current < lines.length) startLine()
          }, gap)
        }
      }, speed)
    }

    startLine()
    return () => {
      clearInterval(letterTimer)
      clearTimeout(pauseTimer)
    }
  }, [lines, speed, gap])

  return textLines
}

export default function Reveal() {
  const loveLines = [
    "My dearest —",
    "Each day with you makes my world softer, kinder, and brighter.",
    "You are the reason I smile without thinking, the calm in my chaos.",
    "Happy Valentine's Day. I love you, today and always.",
  ]

  const typed = useTypewriter(loveLines, 28, 600)
  const [cardsVisible, setCardsVisible] = useState([])

  useEffect(() => {
    // reveal 'Reasons' cards one by one
    const reasons = [
      'You make me laugh',
      'You listen with your whole heart',
      'You dream with me',
      'You hold my hand',
      'You are my home',
    ]
    reasons.forEach((r, i) => {
      setTimeout(() => setCardsVisible((s) => [...s, r]), 900 + i * 450)
    })
  }, [])

  // small confetti/fireworks via CSS classes
  return (
    <main className="reveal">
      <div className="celebrate">
        <div className="fireworks" />
        <div className="confetti" />
      </div>

      <section className="letter">
        {typed.map((t, i) => (
          <p key={i} className={`type-line ${t ? 'visible' : ''}`}>{t}</p>
        ))}
      </section>

      <section className="poems">
        <h2>Poems</h2>
        <div className="poem fade-in">
          "I love you not only for what you are, but for what I am when I am with you." —
          anonymous
        </div>
      </section>

      <section className="reasons">
        <h2>Reasons Why I Love You</h2>
        <div className="cards">
          {cardsVisible.map((r, i) => (
            <div className="card" key={i} style={{ animationDelay: `${i * 120}ms` }}>
              {r}
            </div>
          ))}
        </div>
      </section>

      <div className="characters reveal-chars">
        <div className="cat small" />
        <div className="bear small" />
      </div>
    </main>
  )
}
