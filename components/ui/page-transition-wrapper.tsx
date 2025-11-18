'use client'

import { PAGE_TRANSITION_VARIANTS } from '@/lib/animations'
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

interface PageTransitionWrapperProps {
  children: React.ReactNode
}

const PageTransitionWrapper = ({ children }: PageTransitionWrapperProps) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [layoutEnabled, setLayoutEnabled] = useState(true)

  useEffect(() => {
    const disableHandler = () => setLayoutEnabled(false)
    const enableHandler = () => setLayoutEnabled(true)
    if (typeof window !== 'undefined' && 'addEventListener' in window) {
      window.addEventListener('page-transition:disable-layout', disableHandler)
      window.addEventListener('page-transition:enable-layout', enableHandler)
    }
    return () => {
      if (typeof window !== 'undefined' && 'removeEventListener' in window) {
        window.removeEventListener(
          'page-transition:disable-layout',
          disableHandler,
        )
        window.removeEventListener(
          'page-transition:enable-layout',
          enableHandler,
        )
      }
    }
  }, [])

  // Re-enable layout animation when the search params change (query navigation)
  useEffect(() => {
    // Read the search params so the effect will run when they change.
    // We don't otherwise use the value — we only need the effect to
    // re-run on changes to query params so layout animations re-enable.
    // Using `searchParams` in the effect body ensures the lint rule
    // recognizes that this dependency is intentionally used.
    void searchParams?.toString()
    setLayoutEnabled(true)
  }, [searchParams])

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={pathname}
        initial="hidden"
        animate="show"
        exit="exit"
        variants={PAGE_TRANSITION_VARIANTS}
        layout={layoutEnabled}
        // notify when page transition finishes so other UI (like Footer)
        // can wait to appear until the content has faded in.
        onAnimationComplete={() => {
          try {
            if (typeof window !== 'undefined' && 'CustomEvent' in window) {
              window.dispatchEvent(new CustomEvent('page-transition:complete'))
            }
          } catch (e) {
            // noop
          }
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export default PageTransitionWrapper

// Listen for filter/page navigation related events and toggle layout animations
// so that clicking links that just update query params won't trigger the
// page wrapper's layout animation (this prevents bounce effects on prod builds).
// We intentionally keep the public API events minimal:
// - page-transition:disable-layout --> disable layout animations
// - page-transition:enable-layout  --> enable layout animations
