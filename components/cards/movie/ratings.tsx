import { Brand } from '~/components/ui/brand'
import { Link } from '~/components/ui/link'
import type { SelectMovie } from '~/db/schema'

interface RatingItem {
  value: string
  source: string
}

export function Ratings({ movie }: { movie: SelectMovie }) {
  const { imdbRating, ratings, url, title, numVotes } = movie
  const ratingsArray = Array.isArray(ratings)
    ? (ratings as unknown as RatingItem[])
    : []
  const rottenTomatoRating = ratingsArray.find(
    ({ source }) => source === 'Rotten Tomatoes',
  )
  const rottenSearchUrl = new URL('https://www.rottentomatoes.com/search')
  rottenSearchUrl.searchParams.set('search', title)

  return (
    <div className="flex items-center gap-4">
      <Link href={url} className="flex items-center gap-1.5 md:gap-2">
        <Brand name="IMBb" className="h-5 w-5 md:h-6 md:w-6" as="icon" />
        <span>
          {imdbRating}{' '}
          <span className="hidden text-gray-500 md:inline dark:text-gray-400">
            ({shortenNumVotes(numVotes)})
          </span>
        </span>
      </Link>
      <Link
        href={rottenSearchUrl.toString()}
        className="flex items-center gap-1.5 md:gap-2"
      >
        <Brand
          name="RottenTomatoes"
          as="icon"
          className="h-5 w-5 md:h-6 md:w-6"
        />
        <span>{rottenTomatoRating?.value || 'N/A'}</span>
      </Link>
    </div>
  )
}

function shortenNumVotes(n: number, suffix = '') {
  const suffixes = ['', 'K', 'M', 'B', 'T']
  if (n < 1000) {
    const fixedPoint = n.toFixed(1)
    if (fixedPoint.endsWith('.0')) {
      return n.toFixed(0) + suffix
    }
    return n.toFixed(1) + suffix
  }
  const index = suffix ? suffixes.indexOf(suffix) + 1 : 1
  return shortenNumVotes(n / 1000, suffixes[index])
}
