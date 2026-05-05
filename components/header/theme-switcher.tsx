'use client'

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

    const prefersReducedMotion = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (prefersReducedMotion) {
      setTheme(newTheme)
      return
    }

    if (!document.startViewTransition) {
      setTheme(newTheme)
      return
    }

    setIsAnimating(true)

    try {
      const x = e?.clientX ?? window.innerWidth / 2
      const y = e?.clientY ?? window.innerHeight / 2

      const isMobile = window.innerWidth < 640
      const viewportMax = Math.max(window.innerWidth, window.innerHeight)

      const rawEndRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      )

      const mobileLimit = viewportMax * 0.9
      const endRadius = Math.min(
        rawEndRadius,
        isMobile ? mobileLimit : rawEndRadius,
      )

      const transition = document.startViewTransition(() => {
        setTheme(newTheme)
      })

      await transition.ready

      const duration = isMobile ? 350 : 500

      document.documentElement.animate(
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

      await transition.finished
    } catch (err) {
      console.warn('Theme transition animation failed:', err)
    } finally {
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
          resolvedTheme === 'dark' ? (
            <MoonStar strokeWidth={1.5} size={22} />
          ) : (
            <Sun strokeWidth={1.5} size={22} />
          )
        ) : (
          <SunMoon strokeWidth={1.5} size={22} />
        )}
      </button>
    </div>
  )
}
