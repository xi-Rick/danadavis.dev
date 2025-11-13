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
        onClick={() => document.getElementById('comment')?.scrollIntoView()}
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
      'bg-white dark:bg-black',
      'hover:bg-orange-100 dark:hover:bg-green-950',
      'ring-2 ring-orange-500 dark:ring-white',
      'text-orange-600 dark:text-green-400',
    ]),
    green: clsx([
      'bg-white dark:bg-black',
      'hover:bg-green-100 dark:hover:bg-green-950',
      'ring-2 ring-green-500 dark:ring-white',
      'text-green-600 dark:text-green-400',
    ]),
  }

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className={clsx(['rounded-lg p-2 transition-all', colorClasses[color]])}
    >
      <Icon className="h-5 w-5" />
    </button>
  )
}
