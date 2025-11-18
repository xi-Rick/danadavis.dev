'use client'

import { PAGE_TRANSITION_VARIANTS } from '@/lib/animations'
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

interface PageTransitionWrapperProps {
  children: React.ReactNode
}

const PageTransitionWrapper = ({ children }: PageTransitionWrapperProps) => {
  const pathname = usePathname()

  return (
    <AnimatePresence>
      <motion.div
        key={pathname}
        initial="hidden"
        animate="show"
        exit="exit"
        variants={PAGE_TRANSITION_VARIANTS}
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
