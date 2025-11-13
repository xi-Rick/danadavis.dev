import { clsx } from 'clsx'

export function GradientBorder({
  children,
  offset = 16,
  className,
}: {
  children: React.ReactNode
  offset?: number
  className?: string
}) {
  return (
    <div
      className={clsx([
        'relative h-full w-full',
        'border border-gray-200 dark:border-zinc-800',
        className,
      ])}
      style={{ '--offset': `${offset}px` } as React.CSSProperties}
    >
      <span
        className={clsx([
          'absolute -top-px right-(--offset) h-px w-[40%]',
          'bg-linear-to-r from-orange-500/0 via-orange-500/40 to-orange-500/0',
          'dark:from-green-400/0 dark:via-green-400/40 dark:to-green-400/0',
        ])}
      />
      <span
        className={clsx([
          'absolute top-(--offset) -left-px h-[40%] w-px',
          'bg-linear-to-b from-orange-500/0 via-orange-500/40 to-orange-500/0',
          'dark:from-green-400/0 dark:via-green-400/40 dark:to-green-400/0',
        ])}
      />
      {children}
    </div>
  )
}
