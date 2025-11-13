'use client'

import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Footer } from '~/components/footer'
import { FADE_IN_ANIMATION_VARIANTS } from '~/lib/animations'

export const FooterController = () => {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')
  // showFooter: control when Footer is mounted/visible
  // default: visible for non-admin routes, hidden initially for admin
  const [showFooter, setShowFooter] = useState<boolean>(!isAdmin)

  useEffect(() => {
    if (!isAdmin) {
      // non-admin: show immediately
      setShowFooter(true)
      return
    }

    // admin route: hide footer until page transition completes.
    setShowFooter(false)

    const onComplete = () => {
      setShowFooter(true)
      clearTimeout(fallback)
    }

    // Listen for the event dispatched by PageTransitionWrapper
    window.addEventListener('page-transition:complete', onComplete)

    // Safety fallback: ensure footer appears after 1s in case event doesn't fire
    const fallback = window.setTimeout(onComplete, 1000)

    return () => {
      window.removeEventListener('page-transition:complete', onComplete)
      clearTimeout(fallback)
    }
  }, [isAdmin])

  if (!showFooter) return null

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={FADE_IN_ANIMATION_VARIANTS}
    >
      <Footer />
    </motion.div>
  )
}

export default FooterController
