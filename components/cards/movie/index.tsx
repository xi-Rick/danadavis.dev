import { GradientBorder } from '~/components/ui/gradient-border'
import { GrowingUnderline } from '~/components/ui/growing-underline'
import { Image, Zoom } from '~/components/ui/image'
import { Link } from '~/components/ui/link'
import { TiltedGridBackground } from '~/components/ui/tilted-grid-background'
import type { SelectMovie } from '~/db/schema'
import { Ratings } from './ratings'

function getLargePoster(poster: string, size = 1000) {
  if (!poster) return ''
  return poster.replace('._V1_SX300', `._V1_SX${size}`)
}

export function MovieCard({ movie }: { movie: SelectMovie }) {
  const { url, title, titleType, poster, year, runtime, totalSeasons } = movie

  if (!poster) return null

  function handleZoom(e: React.MouseEvent<HTMLDivElement>) {
    const rmiz = e.currentTarget.querySelector('[data-rmiz]')
    const modalId = rmiz?.getAttribute('aria-owns')?.split('-').pop()
    if (modalId) {
      const zoomedPoster = document.getElementById(`rmiz-modal-img-${modalId}`)
      if (zoomedPoster) {
        zoomedPoster.removeAttribute('srcset')
      }
    }
  }

  return (
    <GradientBorder className="space-y-2 rounded-xl shadow-xs dark:bg-white/5">
      <TiltedGridBackground className="inset-0 z-[-1]" />
      <div className="flex gap-5 md:gap-5">
        <div
          onClick={handleZoom}
          className="-mt-12 mb-4 ml-4 flex h-52 w-36 shrink-0 items-end md:-mt-16 md:h-56"
        >
          <Zoom
            zoomImg={{ src: getLargePoster(poster), alt: title }}
            canSwipeToUnzoom={false} // Not working
          >
            <Image
              src={poster}
              alt={title}
              width={300}
              height={450}
              className="h-auto w-full rounded-lg shadow-lg"
            />
          </Zoom>
        </div>
        <div className="relative flex grow flex-col gap-1 overflow-hidden py-4 pr-2 md:pr-4">
          <div className="flex items-start justify-between gap-3 text-xl font-semibold md:text-2xl">
            <Link href={url}>
              <GrowingUnderline>{title}</GrowingUnderline>
            </Link>
          </div>
          <div className="grow">
            <div className="flex flex-wrap items-center gap-1 text-gray-500 dark:text-gray-400">
              <span>
                {year}
                {titleType === 'Movie' && ` - ${formatRuntime(runtime)}`}
              </span>
              <span>
                {titleType === 'TV Series' && (
                  <span> - (TV series / {totalSeasons} seasons)</span>
                )}
              </span>
            </div>
          </div>
          <Ratings movie={movie} />
        </div>
      </div>
    </GradientBorder>
  )
}

function formatRuntime(runtime: number) {
  const hours = Math.floor(runtime / 60)
  const mins = runtime % 60
  return `${hours}h ${mins < 10 ? '0' : ''}${mins}m`
}
