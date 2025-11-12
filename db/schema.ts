/**
 * Database schema types and exports
 *
 * This file exports types from Prisma Client to maintain compatibility
 * with the application code that previously used Drizzle ORM.
 * All types are now sourced from the Prisma schema.
 */

import type {
  GoodreadsBook,
  GoodreadsMovie,
  StatsType as PrismaStatsType,
  Stats,
} from '@prisma/client'
import { z } from 'zod'

// Re-export StatsType enum from Prisma
export type StatsType = PrismaStatsType

// Stats types
export type SelectStats = Stats

// Book types
export type SelectBook = GoodreadsBook
export type InsertBook = Omit<GoodreadsBook, 'createdAt' | 'updatedAt'>

// Movie types
export type SelectMovie = GoodreadsMovie
export type InsertMovie = Omit<GoodreadsMovie, 'createdAt' | 'updatedAt'>

// Schema validation for seeds and data imports
// These provide basic validation similar to the old drizzle-zod schemas
export const insertBookSchema = z
  .object({
    id: z.string(),
    guid: z.string(),
    pubDate: z.string(),
    title: z.string(),
    link: z.string(),
    bookImageUrl: z.string(),
    bookSmallImageUrl: z.string(),
    bookMediumImageUrl: z.string(),
    bookLargeImageUrl: z.string(),
    bookDescription: z.string(),
    authorName: z.string(),
    isbn: z.string().nullable(),
    userName: z.string(),
    userRating: z.number(),
    userReadAt: z.string().nullable(),
    userDateAdded: z.string(),
    userDateCreated: z.string(),
    userShelves: z.string().nullable(),
    userReview: z.string().nullable(),
    averageRating: z.number(),
    bookPublished: z.string().nullable(),
    numPages: z.number().int().nullable(),
    content: z.string(),
  })
  .transform((data) => ({
    ...data,
    // Ensure nullable fields are null instead of undefined
    isbn: data.isbn ?? null,
    userReadAt: data.userReadAt ?? null,
    userShelves: data.userShelves ?? null,
    userReview: data.userReview ?? null,
    bookPublished: data.bookPublished ?? null,
    numPages: data.numPages ?? null,
  }))

export const insertMovieSchema = z
  .object({
    id: z.string(),
    yourRating: z.number(),
    dateRated: z.string(),
    title: z.string(),
    originalTitle: z.string(),
    url: z.string(),
    titleType: z.string(),
    imdbRating: z.number(),
    runtime: z.number(),
    year: z.string().nullable(),
    genres: z.string(),
    numVotes: z.number(),
    releaseDate: z.string(),
    directors: z.string(),
    actors: z.string(),
    plot: z.string(),
    poster: z.string(),
    language: z.string(),
    country: z.string(),
    awards: z.string(),
    boxOffice: z.string().nullable(),
    totalSeasons: z.string().nullable(),
    ratings: z.array(
      z.object({
        value: z.string(),
        source: z.string(),
      }),
    ),
  })
  .transform((data) => ({
    ...data,
    // Ensure nullable fields are null instead of undefined
    year: data.year ?? null,
    boxOffice: data.boxOffice ?? null,
    totalSeasons: data.totalSeasons ?? null,
  }))
