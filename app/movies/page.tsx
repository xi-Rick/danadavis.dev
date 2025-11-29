import { promises as fs } from 'node:fs'
import path from 'node:path'
import { Suspense } from 'react'
import { genPageMetadata } from '~/app/seo'
import { Container } from '~/components/ui/container'
import { PageHeader } from '~/components/ui/page-header'
import type { SelectMovie } from '~/db/schema'
import { MoviesList } from './movies-list'

export const metadata = genPageMetadata({
  title: 'My movies list',
  description:
    'A personal record of the TV shows and animated series I love — heavy on anime, animation, and long-running series. My 10-star picks are the ones I’ve rewatched and recommend without hesitation.',
})

async function loadMoviesFromJson(): Promise<SelectMovie[]> {
  try {
    const filePath = path.join(process.cwd(), 'json', 'movies.json')
    const fileContents = await fs.readFile(filePath, 'utf8')
    const moviesData = JSON.parse(fileContents) as Array<{
      id: string
      title: string
      slug: string
      summary: string
      content: string
      date: string
      lastmod: string
      tags: string[]
      categories: string[]
      images: string[]
      authors: string[]
      draft: boolean
      featured: boolean
      layout: string
      director: string
      year: number
      titleType: 'tv' | 'movie'
      yourRating: number
      imdbRating: number
      imdbUrl: string
      runtime?: string
      ratings?: Array<{ value: string; source: string }>
      totalSeasons?: string
      numVotes?: string
      createdAt: string
      updatedAt: string
      authorId: string
    }>

    return moviesData.map((movie) => ({
      id: movie.id,
      yourRating: movie.yourRating,
      dateRated: movie.date, // using date as dateRated
      title: movie.title,
      originalTitle: movie.title, // assuming same
      url: movie.imdbUrl,
      titleType: movie.titleType === 'movie' ? 'Movie' : 'TV Series', // converts tv/movie to Movie/TV Series
      imdbRating: movie.imdbRating,
      runtime: Number.parseFloat(movie.runtime || '0'), // convert to number
      year: String(movie.year),
      genres: movie.tags.join(', '), // using tags as genres
      numVotes: Number.parseFloat(movie.numVotes || '0'), // convert to number
      releaseDate: movie.date,
      directors: movie.director,
      actors: '', // default
      plot: movie.summary,
      poster: movie.images[0] || '', // using first image as poster
      language: '', // default
      country: '', // default
      awards: '', // default
      boxOffice: '', // default
      totalSeasons: movie.totalSeasons || '', // Use the actual number of seasons
      ratings: movie.ratings || [],
      createdAt: new Date(movie.createdAt),
      updatedAt: new Date(movie.updatedAt),
    }))
  } catch (error) {
    console.error('Error loading movies from JSON:', error)
    return []
  }
}

export default async function MoviesPage() {
  const movies = await loadMoviesFromJson()

  return (
    <Container className="pt-4 lg:pt-12">
      <PageHeader
        title="Movies"
        description=<p>
          This is my watchlist — a curated log of animated series, anime, and
          long-running TV that I keep coming back to. I’m drawn to bold
          worldbuilding, memorable characters, and shows that reward repeat
          viewings — from quiet slice-of-life anime to sprawling serialized
          epics. When I mark something a
          <span className="font-medium"> 10 </span>, it means I rewatched it,
          still catch new details, and recommend it without hesitation. Browse
          through — you might find a series to binge or an old favorite to
          revisit.
        </p>
        className="border-b border-gray-200 dark:border-gray-700"
      />
      <div className="py-5 md:py-10">
        <Suspense>
          <MoviesList movies={movies} />
        </Suspense>
      </div>
    </Container>
  )
}
