'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { MoonStar, Sun, SunMoon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { setTheme, resolvedTheme } = useTheme()

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), [])

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="flex items-center">
      <button
        onClick={toggleTheme}
        className="flex items-center justify-center rounded-sm p-1.5 hover:bg-orange-100 hover:text-orange-600 dark:hover:bg-green-900/20 dark:hover:text-green-400 transition-colors"
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
