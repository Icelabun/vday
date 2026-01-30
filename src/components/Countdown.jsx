import React from 'react'

// Countdown display component: receives targetDate and now
export default function Countdown({ targetDate, now }) {
  const diff = Math.max(0, targetDate - now)
  const seconds = Math.floor(diff / 1000)
  const days = Math.floor(seconds / (3600 * 24))
  const hours = Math.floor((seconds % (3600 * 24)) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  return (
    <div className="countdown">
      <div className="time">
        <div className="block">
          <div className="num">{days}</div>
          <div className="lbl">days</div>
        </div>
        <div className="block">
          <div className="num">{hours.toString().padStart(2, '0')}</div>
          <div className="lbl">hours</div>
        </div>
        <div className="block">
          <div className="num">{minutes.toString().padStart(2, '0')}</div>
          <div className="lbl">mins</div>
        </div>
        <div className="block">
          <div className="num">{secs.toString().padStart(2, '0')}</div>
          <div className="lbl">secs</div>
        </div>
      </div>
    </div>
  )
}
