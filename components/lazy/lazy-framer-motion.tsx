'use client'

import dynamic from 'next/dynamic'
import type { ComponentProps } from 'react'

// Dynamically import motion components
export const LazyMotionDiv = dynamic(
  () => import('framer-motion').then((mod) => mod.motion.div),
  { ssr: false },
)

export const LazyAnimatePresence = dynamic(
  () => import('framer-motion').then((mod) => mod.AnimatePresence),
  { ssr: false },
)

// Type-safe wrappers with fallback
export function MotionDiv(
  props: ComponentProps<typeof import('framer-motion').motion.div>,
) {
  return <LazyMotionDiv {...props} />
}

export function AnimatePresence(
  props: ComponentProps<typeof import('framer-motion').AnimatePresence>,
) {
  return <LazyAnimatePresence {...props} />
}
