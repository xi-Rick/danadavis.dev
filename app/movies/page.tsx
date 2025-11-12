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
    "This is where I log all the movies and TV series I've watched. I'm a huge fan of Tom Hanks and Christopher Nolan, so expect to see a lot of them in the top spots! Anything I've rated 10 stars is something I absolutely love and have probably rewatched many times (highly recommended). Take a look and maybe find your next favorite film!",
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
          This is where I log all the movies and TV series I’ve watched. I’m a
          huge fan of <span className="font-medium">Tom Hanks</span> and{' '}
          <span className="font-medium">Christopher Nolan</span>, so expect to
          see a lot of them in the top spots! Anything I’ve rated 10 stars is
          something I absolutely love and have probably rewatched many times
          (highly recommended). Take a look and maybe find your next favorite
          film!
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
