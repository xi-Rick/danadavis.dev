'use client'
import { useEffect, useRef, useState } from 'react'

const SESSION_KEY = 'opening_audio_played'

export default function AutoPlayAudio() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [hasPlayed, setHasPlayed] = useState(
    () =>
      typeof window !== 'undefined' && !!sessionStorage.getItem(SESSION_KEY),
  )

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || hasPlayed) return
    if (sessionStorage.getItem(SESSION_KEY)) return

    // Handle user interaction to enable audio
    const handleUserInteraction = async () => {
      if (!hasPlayed && audio) {
        try {
          await audio.play()
          sessionStorage.setItem(SESSION_KEY, '1')
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
        sessionStorage.setItem(SESSION_KEY, '1')
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
    <audio ref={audioRef} preload="none" style={{ display: 'none' }}>
      <source src="/audio/opening.mp3" type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
  )
}
