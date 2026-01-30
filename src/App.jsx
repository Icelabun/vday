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
  // Allow bypassing the countdown for development or preview using:
  //  - URL query: ?forceReveal=1 or ?reveal
  //  - localStorage key: `vday.forceReveal` = '1'
  const forceFromQuery = typeof window !== 'undefined' && (new URLSearchParams(window.location.search).get('forceReveal') === '1' || window.location.search.includes('reveal'))
  const forceFromStorage = typeof window !== 'undefined' && window.localStorage && window.localStorage.getItem('vday.forceReveal') === '1'
  const [revealed, setRevealed] = useState(() => Boolean(forceFromQuery || forceFromStorage || now >= target))

  // After Dark mode + music source management
  const [afterDark, setAfterDark] = useState(false)
  const musicSrc = afterDark ? '/music/afterdark.mp3' : '/music/celebrate.mp3'
  function enterAfterDark() {
    setAfterDark(true)
    try { window.localStorage.setItem('vday.afterDark', '1') } catch(e){}
  }
  function exitAfterDark() {
    setAfterDark(false)
    try { window.localStorage.removeItem('vday.afterDark') } catch(e){}
  }

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
    <div className={revealed ? (afterDark ? 'reveal-mode after-dark' : 'reveal-mode') : 'pre-reveal-mode'}>
      {revealed && <MusicToggle id="main-music" src={musicSrc} afterDark={afterDark} />}

      {revealed ? (
        <Reveal targetDate={target} now={now} onEnterAfterDark={enterAfterDark} afterDark={afterDark} exitAfterDark={exitAfterDark} />
      ) : (
        <PreReveal targetDate={target} now={now} />
      )}
    </div>
  )
}
