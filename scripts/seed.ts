import fs from 'node:fs'
import path from 'node:path'
import csv from 'csv-parser'
import Parser from 'rss-parser'
import { SITE_METADATA } from '~/data/site-metadata'
import { upsertBooks } from '~/db/queries'
import { type InsertBook, insertBookSchema } from '~/db/schema'
import type { GoodreadsBook, GoodreadsCsvBook } from '~/types/data'

const parser = new Parser<{ [key: string]: unknown }, GoodreadsBook>({
  customFields: {
    item: [
      'guid',
      'title',
      'link',
      'pubDate',
      ['book_id', 'id'],
      ['book_image_url', 'bookImageUrl'],
      ['book_small_image_url', 'bookSmallImageUrl'],
      ['book_medium_image_url', 'bookMediumImageUrl'],
      ['book_large_image_url', 'bookLargeImageUrl'],
      ['book_description', 'bookDescription'],
      ['book', 'numPages'],
      ['author_name', 'authorName'],
      ['isbn', 'isbn'],
      ['user_name', 'userName'],
      ['user_rating', 'userRating'],
      ['user_read_at', 'userReadAt'],
      ['user_date_added', 'userDateAdded'],
      ['user_date_created', 'userDateCreated'],
      ['user_shelves', 'userShelves'],
      ['user_review', 'userReview'],
      ['average_rating', 'averageRating'],
      ['book_published', 'bookPublished'],
    ],
  },
})

export async function seedBooksUsingRssFeed() {
  if (SITE_METADATA.goodreadsFeedUrl) {
    try {
      console.log('Parsing Goodreads RSS feed...')
      const data = await parser.parseURL(SITE_METADATA.goodreadsFeedUrl)

      // Process book descriptions
      for (const book of data.items) {
        book.bookDescription = book.bookDescription
          .replace(/<[^>]*(>|$)/g, '')
          .replace(/\s\s+/g, ' ')
          .replace(/^["|"]|["|"]$/g, '')
          .replace(/\.([a-zA-Z0-9])/g, '. $1')
        book.content = book.content.replace(/\n/g, '').replace(/\s\s+/g, ' ')
        book.userShelves = book.userShelves || 'read'

        // Convert ratings to numbers
        ;(book as any).userRating =
          Number.parseFloat(String(book.userRating)) || 0
        ;(book as any).averageRating =
          Number.parseFloat(String(book.averageRating)) || 0

        // Add numPages to book object for later use
        if (book.numPages && typeof book.numPages === 'object') {
          const numPages = Object.values(book.numPages)?.[1]?.[0]
          if (numPages && !Number.isNaN(Number(numPages))) {
            book.numPages = Number(numPages)
          } else {
            // If we can't extract a valid number, remove the field
            // biome-ignore lint/performance/noDelete: <explanation>
            delete book.numPages
          }
        }
      }

      // Validate books data using Zod schema
      const validBooks: InsertBook[] = []
      for (const book of data.items) {
        try {
          const validatedBook = insertBookSchema.parse({
            ...book,
            updatedAt: new Date(),
          })
          validBooks.push(validatedBook)
        } catch (error: unknown) {
          console.log(`❌ Invalid book data for "${book.title}":`, error)
        }
      }

      if (validBooks.length > 0) {
        try {
          const savedBooks = await upsertBooks(validBooks)
          console.log(
            `📚 ${savedBooks.length}/${data.items.length} books saved to database.`,
          )
        } catch (error) {
          console.error(`❌ Error saving books to database: ${error.message}`)
        }
      } else {
        console.log('📚 No valid books to save.')
      }
    } catch (error) {
      console.error(`Error fetching the Goodreads RSS feed: ${error.message}`)
    }
  } else {
    console.log('📚 No Goodreads RSS feed found.')
  }
}

// Export Goodreads CSV data: https://www.goodreads.com/review/import
const GOODREADS_CSV_FILE_PATH = path.join(
  process.cwd(),
  'scripts',
  'goodreads_library_export.csv',
)

export async function seedBooksByParsingCSV() {
  console.log('Processing Goodreads books from CSV...')
  if (!fs.existsSync(GOODREADS_CSV_FILE_PATH)) {
    console.log('📚 Goodreads CSV file not found.')
    return
  }

  try {
    const csvBooks: GoodreadsCsvBook[] = []
    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(GOODREADS_CSV_FILE_PATH)
        .pipe(
          csv({
            mapHeaders: ({ header }) => {
              // Map CSV headers to database schema fields
              const headerMap: Record<string, string> = {
                'Book Id': 'id',
                Title: 'title',
                Author: 'authorName',
                ISBN: 'isbn',
                'My Rating': 'userRating',
                'Average Rating': 'averageRating',
                Publisher: 'publisher',
                'Number of Pages': 'numberOfPages',
                'Year Published': 'yearPublished',
                'Original Publication Year': 'bookPublished',
                'Date Read': 'userReadAt',
                'Date Added': 'userDateAdded',
                Bookshelves: 'userShelves',
                'Exclusive Shelf': 'exclusiveShelves',
                'My Review': 'userReview',
                Binding: 'binding',
              }
              return (
                headerMap[header] || header.toLowerCase().replace(/\s+/g, '')
              )
            },
          }),
        )
        .on('data', (book: GoodreadsCsvBook) => {
          csvBooks.push(book)
        })
        .on('error', (error) => {
          console.error(`Error parsing Goodreads CSV file: ${error.message}`)
          reject(error)
        })
        .on('end', async () => {
          try {
            const books: GoodreadsBook[] = []
            for (const book of csvBooks) {
              // Transform CSV data to match database schema
              const transformedBook: GoodreadsBook = {
                id: book.id || '',
                guid: `goodreads-${book.id}` || '',
                pubDate: book.userDateAdded || new Date().toISOString(),
                title: book.title || '',
                link: `https://www.goodreads.com/book/show/${book.id}`,
                bookImageUrl: '', // Not available in CSV, will be empty
                bookSmallImageUrl: '',
                bookMediumImageUrl: '',
                bookLargeImageUrl: '',
                bookDescription: book.userReview || book.title || '',
                authorName: book.authorName || '',
                isbn: book.isbn?.replace(/[="]/g, '') || '',
                userName: 'User', // Static value as not available in CSV
                userRating: Number.parseFloat(book.userRating) || 0,
                userReadAt: book.userReadAt || '',
                userDateAdded: book.userDateAdded || new Date().toISOString(),
                userDateCreated: book.userDateAdded || new Date().toISOString(),
                userShelves: book.userShelves || book.exclusiveShelves || '',
                userReview: book.userReview || '',
                averageRating: Number.parseFloat(book.averageRating) || 0,
                bookPublished: book.bookPublished || book.yearPublished || '',
                content: book.userReview || book.title || '',
              }

              // Process book descriptions and content
              if (transformedBook.bookDescription) {
                transformedBook.bookDescription =
                  transformedBook.bookDescription
                    .replace(/<[^>]*(>|$)/g, '')
                    .replace(/\s\s+/g, ' ')
                    .replace(/^["|"]|["|"]$/g, '')
                    .replace(/\.([a-zA-Z0-9])/g, '. $1')
              }

              if (transformedBook.content) {
                transformedBook.content = transformedBook.content
                  .replace(/\n/g, '')
                  .replace(/\s\s+/g, ' ')
              }

              books.push(transformedBook)
            }

            // Validate books data using Zod schema
            const validBooks: InsertBook[] = []
            for (const book of books) {
              try {
                const validatedBook = insertBookSchema.parse({
                  ...book,
                  updatedAt: new Date(),
                })
                validBooks.push(validatedBook)
              } catch (error: unknown) {
                console.log(`❌ Invalid book data for "${book.title}":`, error)
              }
            }

            if (validBooks.length > 0) {
              try {
                const savedBooks = await upsertBooks(validBooks)
                console.log(
                  `📚 ${savedBooks.length}/${books.length} books saved to database.`,
                )
              } catch (error: unknown) {
                const errorMessage =
                  error instanceof Error ? error.message : String(error)
                console.error(
                  `❌ Error saving books to database: ${errorMessage}`,
                )
              }
            } else {
              console.log('📚 No valid books to save.')
            }
            resolve()
          } catch (error) {
            reject(error)
          }
        })
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(`Error parsing Goodreads CSV file: ${errorMessage}`)
  }
}

export async function seed() {
  await seedBooksUsingRssFeed()
  // await seedBooksByParsingCSV()
}

seed()
  .then(() => {
    console.log('🌱 The seed command has finished successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
