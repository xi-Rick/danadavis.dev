'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { MoonStar, Sun, SunMoon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { setTheme, resolvedTheme } = useTheme()
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => setMounted(true), [])

  const toggleTheme = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isAnimating) return

    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark'

    // Check for reduced motion preference first
    const prefersReducedMotion = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (prefersReducedMotion) {
      setTheme(newTheme)
      return
    }

    // If View Transitions API not supported — fallback
    if (!document.startViewTransition) {
      setTheme(newTheme)
      return
    }

    setIsAnimating(true)

    try {
      // Get click position; fallback to center of viewport
      const x = e?.clientX ?? window.innerWidth / 2
      const y = e?.clientY ?? window.innerHeight / 2

      // Cache mobile check
      const isMobile = window.innerWidth < 640
      const viewportMax = Math.max(window.innerWidth, window.innerHeight)

      // Calculate radius to cover viewport
      const rawEndRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      )

      // Mobile optimization: clamp radius
      const mobileLimit = viewportMax * 0.9
      const endRadius = Math.min(
        rawEndRadius,
        isMobile ? mobileLimit : rawEndRadius,
      )

      // Start the transition
      const transition = document.startViewTransition(() => {
        setTheme(newTheme)
      })

      await transition.ready

      // Animate with circular clip-path
      const duration = isMobile ? 350 : 500

      const animation = document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration,
          easing: 'ease-in-out',
          pseudoElement: '::view-transition-new(root)',
        } as KeyframeAnimationOptions,
      )

      // Wait for transition to complete
      await transition.finished
    } catch (err) {
      // Graceful fallback if animation fails
      console.warn('Theme transition animation failed:', err)
    } finally {
      // Always reset animating state
      setIsAnimating(false)
    }
  }

  return (
    <div className="flex items-center">
      <button
        onClick={toggleTheme}
        disabled={isAnimating}
        className={`flex items-center justify-center rounded-sm p-1.5 hover:bg-orange-100 hover:text-orange-600 dark:hover:bg-green-900/20 dark:hover:text-green-400 transition-colors ${
          isAnimating ? 'cursor-wait' : 'cursor-pointer'
        }`}
        aria-label="Toggle theme"
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
