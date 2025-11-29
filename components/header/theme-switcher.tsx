'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { MoonStar, Sun, SunMoon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { setTheme, resolvedTheme } = useTheme()
  const [isAnimating, setIsAnimating] = useState(false)

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), [])

  const toggleTheme = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent multiple clicks during animation
    if (isAnimating) return

    // If View Transitions API not supported — fallback
    if (!document.startViewTransition) {
      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
      return
    }

    setIsAnimating(true)

    // Get click position; fallback to center of viewport when unavailable
    const x = e?.clientX ?? window.innerWidth / 2
    const y = e?.clientY ?? window.innerHeight / 2

    // radius to cover the entire viewport
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    )

    const transition = document.startViewTransition(() => {
      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
    })

    await transition.ready

    // Animate the root element with a circular clip-path expanding from click
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 500,
        easing: 'ease-in-out',
        // Apply to the incoming view so it masks the new theme
        pseudoElement: '::view-transition-new(root)',
      } as KeyframeAnimationOptions,
    )

    transition.finished.then(() => setIsAnimating(false))
  }

  return (
    <div className="flex items-center">
      <button
        onClick={toggleTheme}
        disabled={isAnimating}
        className={`flex items-center justify-center rounded-sm p-1.5 hover:bg-orange-100 hover:text-orange-600 dark:hover:bg-green-900/20 dark:hover:text-green-400 transition-colors ${isAnimating ? 'cursor-wait' : 'cursor-pointer'}`}
        aria-label="Theme switcher"
        data-umami-event="nav-theme-switcher"
      >
        {mounted ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={resolvedTheme}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {resolvedTheme === 'dark' ? (
                <MoonStar strokeWidth={1.5} size={22} />
              ) : (
                <Sun strokeWidth={1.5} size={22} />
              )}
            </motion.div>
          </AnimatePresence>
        ) : (
          <SunMoon strokeWidth={1.5} size={22} />
        )}
      </button>
    </div>
  )
}
