import { clsx } from 'clsx'
import { GradientBorder } from '~/components/ui/gradient-border'
import { GrowingUnderline } from '~/components/ui/growing-underline'
import { Image, Zoom } from '~/components/ui/image'
import { Link } from '~/components/ui/link'
import { RatingBadge } from '~/components/ui/rating-badge'
import { TiltedGridBackground } from '~/components/ui/tilted-grid-background'
import type { Game } from '~/types/data'

export function GameCard({ game }: { game: Game }) {
  const {
    title,
    summary,
    images,
    storeUrl,
    demo,
    platforms,
    developers,
    releaseDate,
    rating,
    slug,
  } = game

  return (
    <GradientBorder className="space-y-3 rounded-xl dark:bg-white/5 min-h-[96px] md:min-h-[120px] group">
      <TiltedGridBackground className="inset-0 z-[-1] rounded-xl" />
      <div className="flex flex-col gap-3 p-3 md:p-6 min-w-0">
        {images && images.length > 0 && (
          <div className="-mt-8 mb-3 mx-auto flex h-44 w-full max-w-[360px] lg:max-w-none shrink-0 items-center justify-center md:-mt-12 sm:h-48 md:h-56 lg:h-64 relative transition-transform duration-300 group-hover:scale-105">
            <div className="rounded-xl p-1 bg-white/0 shadow-inner">
              <div className="rounded-lg overflow-hidden bg-white/10">
                <Zoom
                  zoomImg={{ src: images[0], alt: title }}
                  canSwipeToUnzoom={false}
                >
                  <Image
                    src={images[0]}
                    alt={title}
                    width={1600}
                    height={900}
                    className="h-44 sm:h-48 md:h-56 lg:h-64 w-full rounded-lg shadow-2xl object-cover"
                  />
                </Zoom>
              </div>
            </div>
          </div>
        )}
        <div className="flex grow flex-col gap-3 min-w-0 lg:bg-white/5 lg:dark:bg-black/40 lg:p-6 lg:rounded-b-xl lg:py-2">
          <div className="flex items-start justify-between gap-4 min-w-0">
            <div className="flex-1 min-w-0 pr-3">
              <h3 className="text-xl font-semibold md:text-2xl line-clamp-2">
                {storeUrl ? (
                  <Link
                    href={storeUrl}
                    aria-label={`Open store link for ${title}`}
                  >
                    <GrowingUnderline className="truncate">
                      {title}
                    </GrowingUnderline>
                  </Link>
                ) : (
                  <span className="truncate">{title}</span>
                )}
              </h3>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {developers?.[0]} ·{' '}
                {releaseDate ? new Date(releaseDate).getFullYear() : ''}
              </div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
              {/* Rating visible in overlay on smaller screens, and under title on desktop */}
              {rating ? (
                <RatingBadge
                  rating={rating}
                  className="hidden lg:inline-flex ring-2 ring-black/10 dark:ring-white/10"
                />
              ) : null}
            </div>
          </div>
          <p className="text-gray-700 dark:text-gray-300 line-clamp-3 md:line-clamp-4 max-w-full leading-relaxed">
            {summary}
          </p>
          <div className="mt-auto flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 flex-wrap">
            {platforms && platforms.length > 0 && (
              <div className="flex items-center gap-2">
                {platforms.map((p) => (
                  <span
                    key={p}
                    className={clsx(
                      'platform-badge',
                      'bg-gray-100 text-gray-800 dark:bg-white/5 dark:text-gray-200',
                    )}
                  >
                    {p}
                  </span>
                ))}
              </div>
            )}
            <div className="ml-0 md:ml-auto flex items-center gap-2 flex-wrap">
              {demo && (
                <Link href={demo} className="text-sm">
                  Demo
                </Link>
              )}

              <Link href={`/games/${slug}`} className="text-sm">
                <GrowingUnderline>Details</GrowingUnderline>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </GradientBorder>
  )
}

export default GameCard
