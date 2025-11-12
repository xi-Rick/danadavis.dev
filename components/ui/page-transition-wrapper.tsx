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
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="hidden"
        animate="show"
        exit="exit"
        variants={PAGE_TRANSITION_VARIANTS}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export default PageTransitionWrapper
