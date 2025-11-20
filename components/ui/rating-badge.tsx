import { clsx } from 'clsx'
import type * as React from 'react'

export interface RatingBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  rating?: number | null
  compact?: boolean
}

export function RatingBadge({
  rating,
  compact = false,
  className,
  ...props
}: RatingBadgeProps) {
  if (rating === undefined || rating === null) return null

  // Use orange gradient in light mode and green in dark mode for consistent branding
  const base =
    'bg-gradient-to-br from-orange-400 to-orange-500 dark:from-green-400 dark:to-green-600 text-white shadow-md'
  const compactClasses =
    'h-10 w-10 flex items-center justify-center rounded-full text-[12px] font-bold'
  const defaultClasses =
    'inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold'

  return (
    <span
      aria-label={`Rating ${rating} out of 10`}
      className={clsx(
        base,
        compact ? compactClasses : defaultClasses,
        className,
      )}
      {...props}
    >
      {String(rating)}
      {!compact ? '/10' : ''}
    </span>
  )
}

export default RatingBadge
