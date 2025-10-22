'use client'
import { useEffect, useRef, useState } from 'react'

export default function AutoPlayAudio() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [hasPlayed, setHasPlayed] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || hasPlayed) return

    // Handle user interaction to enable audio
    const handleUserInteraction = async () => {
      if (!hasPlayed && audio) {
        try {
          await audio.play()
          setHasPlayed(true)
        } catch (error) {
          console.log('Audio play failed:', error)
        }
      }
    }

    // Add event listeners for user interaction
    const events = ['click', 'keydown', 'touchstart'] as const
    for (const event of events) {
      document.addEventListener(event, handleUserInteraction, { once: true })
    }

    // Try to play on component mount
    const playAudio = async () => {
      try {
        await audio.play()
        setHasPlayed(true)
      } catch {
        // Auto-play blocked, waiting for user interaction
        console.log('Auto-play blocked, waiting for user interaction')
      }
    }

    playAudio()

    return () => {
      for (const event of events) {
        document.removeEventListener(event, handleUserInteraction)
      }
    }
  }, [hasPlayed])

  return (
    <audio ref={audioRef} preload="auto" style={{ display: 'none' }}>
      <source src="/audio/opening.mp3" type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
  )
}
