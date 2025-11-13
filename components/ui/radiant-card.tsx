import { clsx } from 'clsx'
import { GradientBorder } from './gradient-border'
import { TiltedGridBackground } from './tilted-grid-background'

export function RadiantCard({
  children,
  className,
  radius = '1rem',
}: {
  children: React.ReactNode
  radius?: string
  className?: string
}) {
  return (
    <GradientBorder className={clsx('rounded-2xl', className)}>
      <div
        className={clsx([
          'relative h-full w-full rounded-2xl',
          'bg-zinc-50 dark:bg-white/5',
        ])}
      >
        <TiltedGridBackground className="inset-0 z-[-1]" />
        {children}
      </div>
    </GradientBorder>
  )
}
