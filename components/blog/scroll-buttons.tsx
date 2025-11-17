'use client'

import { clsx } from 'clsx'
import { ChevronsUp, MessageSquareText } from 'lucide-react'
import { useEffect, useState } from 'react'

type ThemeColor = 'orange' | 'green'

interface ScrollButtonsProps {
  color?: ThemeColor
}

export function ScrollButtons({ color = 'orange' }: ScrollButtonsProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    function handleWindowScroll() {
      setShow(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleWindowScroll)
    return () => window.removeEventListener('scroll', handleWindowScroll)
  }, [])

  return (
    <div
      className={clsx(
        'fixed right-8 bottom-8 hidden flex-col gap-3 z-50',
        show && 'lg:flex',
      )}
    >
      <ScrollButton
        ariaLabel="Scroll To Comment"
        onClick={() => {
          // Prefer a dedicated comments container if present — this avoids
          // targeting individual textarea ids which may appear multiple times
          // (reply forms). Fallback to the last '#comment' element if needed.
          const container =
            document.querySelector<HTMLElement>('.comments-section')
          if (container) {
            container.scrollIntoView({ behavior: 'smooth', block: 'center' })
            return
          }

          const els = document.querySelectorAll<HTMLElement>('#comment')
          const el = els.length ? els[els.length - 1] : null
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        }}
        icon={MessageSquareText}
        color={color}
      />
      <ScrollButton
        ariaLabel="Scroll To Top"
        onClick={() => window.scrollTo({ top: 0 })}
        icon={ChevronsUp}
        color={color}
      />
    </div>
  )
}

function ScrollButton({
  onClick,
  ariaLabel,
  icon: Icon,
  color = 'orange',
}: {
  onClick: () => void
  ariaLabel: string
  icon: React.FC<React.SVGProps<SVGSVGElement>>
  color?: ThemeColor
}) {
  const colorClasses = {
    orange: clsx([
      'inline-block rounded-lg border-2 font-semibold transition-all duration-200',
      'border-black bg-white text-black hover:border-orange-500 hover:bg-orange-500 hover:text-white',
      'dark:border-white dark:bg-black dark:text-white dark:hover:border-green-500 dark:hover:bg-green-500 dark:hover:text-white',
      'p-2',
    ]),
    green: clsx([
      'inline-block rounded-lg border-2 font-semibold transition-all duration-200',
      'border-black bg-white text-black hover:border-green-500 hover:bg-green-500 hover:text-white',
      'dark:border-white dark:bg-black dark:text-white dark:hover:border-green-500 dark:hover:bg-green-500 dark:hover:text-white',
      'p-2',
    ]),
  }

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className={colorClasses[color]}
    >
      <Icon className="h-5 w-5" />
    </button>
  )
}
