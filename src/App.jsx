import React, { useEffect, useState } from 'react'
import PreReveal from './components/PreReveal'
import Reveal from './components/Reveal'
import MusicToggle from './components/MusicToggle'

// Helper: compute the next Feb 14th 00:00 local time for current year
function nextFeb14() {
  const now = new Date()
  const year = now.getFullYear()
  const targetThisYear = new Date(year, 1, 14, 0, 0, 0, 0) // Month is 0-indexed: 1=Feb
  if (now >= targetThisYear) return targetThisYear // already on/after Feb 14 -> reveal
  return targetThisYear
}

export default function App() {
  const target = nextFeb14()
  const [now, setNow] = useState(new Date())
  const [revealed, setRevealed] = useState(now >= target)

  useEffect(() => {
    const t = setInterval(() => {
      const n = new Date()
      setNow(n)
      if (!revealed && n >= target) {
        setRevealed(true)
      }
    }, 250)
    return () => clearInterval(t)
  }, [revealed, target])

  return (
    <div className={revealed ? 'reveal-mode' : 'pre-reveal-mode'}>
      <MusicToggle id="main-music" />
      {revealed ? (
        <Reveal targetDate={target} now={now} />
      ) : (
        <PreReveal targetDate={target} now={now} />
      )}
    </div>
  )
}
