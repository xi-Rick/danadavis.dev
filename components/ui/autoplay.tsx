'use client'

import { useEffect, useRef } from 'react'

const SESSION_KEY = 'opening_audio_played'

export default function AutoPlayAudio() {
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return

    const audio = audioRef.current
    if (!audio) return

    let didPlay = false

    const markPlayed = () => {
      didPlay = true
      sessionStorage.setItem(SESSION_KEY, '1')
    }

    const attemptPlay = async (): Promise<void> => {
      if (didPlay) return
      try {
        await audio.play()
        markPlayed()
      } catch {
        // Autoplay blocked — will retry on first interaction
      }
    }

    const controller = new AbortController()

    const handleInteraction = async (): Promise<void> => {
      if (didPlay) return
      controller.abort() // remove all interaction listeners immediately
      await attemptPlay()
    }

    const INTERACTION_EVENTS = ['click', 'keydown', 'touchstart'] as const

    for (const event of INTERACTION_EVENTS) {
      document.addEventListener(event, handleInteraction, {
        signal: controller.signal,
        passive: true,
      })
    }

    // Attempt autoplay; fall back silently to interaction listeners
    attemptPlay()

    return () => {
      controller.abort()
      if (!audio.paused) audio.pause()
    }
  }, [])

  return (
    <audio ref={audioRef} preload="auto" hidden playsInline>
      <source src="/audio/opening.mp3" type="audio/mpeg" />
    </audio>
  )
}
