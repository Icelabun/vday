import React, { useEffect, useRef, useState } from 'react'

// Typewriter helper for After Dark messages
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

export default function Reveal({ onEnterAfterDark, afterDark, exitAfterDark }) {
  // Staggered animation states
  const [titleVisible, setTitleVisible] = useState(false)
  const [subtitleVisible, setSubtitleVisible] = useState(false)
  
  // Poems section
  const [poemsVisible, setPoemsVisible] = useState(false)
  const poemsRef = useRef(null)
  
  // Reasons cards
  const [cardsVisible, setCardsVisible] = useState([])
  
  // After Dark states
  const [afterDarkMessageIndex, setAfterDarkMessageIndex] = useState(-1)
  const [showAfterDarkCTA, setShowAfterDarkCTA] = useState(false)
  const [showFinalMoment, setShowFinalMoment] = useState(false)
  
  // After Dark messages - CUSTOMIZE THESE
  const afterDarkMessages = [
    "Some thoughts about you don't belong on a screen.",
    "You have no idea what you do to me.",
    "If I said everything I'm thinking… I'd have to stop typing."
  ]
  
  const currentMessage = afterDarkMessageIndex >= 0 ? afterDarkMessages[afterDarkMessageIndex] : ''
  const afterDarkTyped = useTypewriter(
    currentMessage ? [currentMessage] : [],
    afterDark ? 90 : 28,
    afterDark ? 1200 : 600
  )

  // Staggered hero animations
  useEffect(() => {
    setTimeout(() => setTitleVisible(true), 300)
    setTimeout(() => setSubtitleVisible(true), 800)
  }, [])

  // Poems reveal on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setPoemsVisible(true)
          }
        })
      },
      { threshold: 0.2 }
    )

    if (poemsRef.current) {
      observer.observe(poemsRef.current)
    }

    return () => {
      if (poemsRef.current) {
        observer.unobserve(poemsRef.current)
      }
    }
  }, [])

  // Reasons cards animate in sequentially
  useEffect(() => {
    // CUSTOMIZE THESE REASONS
    const reasons = [
      "The way you make time disappear when I'm with you.",
      "How close I feel to you without touching.",
      "The thoughts you start and never finish.",
      "The way you look when you know exactly what you're doing.",
      "How easily you pull me in."
    ]
    
    reasons.forEach((r, i) => {
      setTimeout(() => setCardsVisible((s) => [...s, r]), 2000 + i * 450)
    })
  }, [])

  // Dim music when final moment appears
  useEffect(() => {
    if (showFinalMoment) {
      const audio = document.getElementById('main-music')
      if (audio) {
        const fadeOut = setInterval(() => {
          if (audio.volume > 0.1) {
            audio.volume = Math.max(0.1, audio.volume - 0.05)
          } else {
            clearInterval(fadeOut)
          }
        }, 100)
        return () => clearInterval(fadeOut)
      }
    }
  }, [showFinalMoment])

  // After Dark progression
  useEffect(() => {
    if (afterDark && afterDarkMessageIndex === -1) {
      // Show first message after entering After Dark
      setTimeout(() => {
        setAfterDarkMessageIndex(0)
      }, 1000)
    }
  }, [afterDark, afterDarkMessageIndex])

  // Show CTA after message finishes typing
  useEffect(() => {
    if (afterDark && afterDarkMessageIndex >= 0 && afterDarkTyped[0] === afterDarkMessages[afterDarkMessageIndex]) {
      const timer = setTimeout(() => {
        setShowAfterDarkCTA(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [afterDark, afterDarkMessageIndex, afterDarkTyped, afterDarkMessages])

  const handleAfterDarkContinue = () => {
    if (afterDarkMessageIndex < afterDarkMessages.length - 1) {
      setShowAfterDarkCTA(false)
      setTimeout(() => {
        setAfterDarkMessageIndex(afterDarkMessageIndex + 1)
      }, 500)
    } else {
      // Final moment
      setShowAfterDarkCTA(false)
      setTimeout(() => {
        setShowFinalMoment(true)
      }, 2000)
    }
  }

  return (
    <main className={`reveal ${afterDark ? 'after-dark' : ''} ${showFinalMoment ? 'final-moment' : ''}`}>
      {!afterDark && (
        <div className="celebrate">
          <div className="fireworks" />
          <div className="confetti" />
        </div>
      )}

      <header className="hero">
        <h1 className={`hero-title ${titleVisible ? 'visible' : ''}`}>
          Happy Valentine's Day ❤️
        </h1>
        <span className="heart-pulse"></span>
        <div className={`hero-sub ${subtitleVisible ? 'visible' : ''}`}>
          I made this for you — with all my heart.
        </div>
      </header>

      {!afterDark && (
        <>
          <section className="poems" ref={poemsRef}>
            <div className={`poem ${poemsVisible ? 'visible' : ''}`}>
              {/* CUSTOMIZE THIS POEM */}
              "Loving you feels quiet and loud at the same time.
              <br />
              Calm — until you smile.
              <br />
              Peaceful — until I miss you."
            </div>
          </section>

          <section className="reasons">
            <h2>Reasons I Want You</h2>
            <div className="cards">
              {cardsVisible.map((r, i) => (
                <div className="card" key={i} style={{ animationDelay: `${i * 120}ms` }}>
                  {r}
                </div>
              ))}
            </div>
          </section>

          <div className="after-dark-controls">
            <button className="btn-after-dark" onClick={onEnterAfterDark}>
              Enter After Dark 🌙
            </button>
          </div>
        </>
      )}

      {afterDark && (
        <section className="after-dark-content">
          {afterDarkMessageIndex === 0 && afterDarkTyped[0] && (
            <p className="after-dark-audio-hint">Turn the volume up. Trust me.</p>
          )}
          <div className="after-dark-messages">
            {afterDarkTyped[0] && (
              <p className={`after-dark-line ${afterDarkTyped[0] ? 'visible' : ''}`}>
                {afterDarkTyped[0]}
              </p>
            )}
          </div>
          
          {showAfterDarkCTA && (
            <button 
              className="btn-continue" 
              onClick={handleAfterDarkContinue}
            >
              {afterDarkMessageIndex < afterDarkMessages.length - 1 
                ? "Don't stop…" 
                : "Tell me more"}
            </button>
          )}
        </section>
      )}

      {showFinalMoment && (
        <div className="final-center visible">
          Now come here.
        </div>
      )}

      <div className="characters reveal-chars">
        <div className="cat small" />
        <div className="bear small" />
      </div>
    </main>
  )
}
