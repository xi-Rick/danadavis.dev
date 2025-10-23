import { promises as fs } from 'node:fs'
import path from 'node:path'
import { Suspense } from 'react'
import { genPageMetadata } from '~/app/seo'
import { Container } from '~/components/ui/container'
import { PageHeader } from '~/components/ui/page-header'
import type { SelectBook } from '~/db/schema'
import { BooksList } from './books-list'

export const metadata = genPageMetadata({
  title: 'My bookshelf',
  description:
    "Reading has been my hobby since childhood, starting with comics, magazines, and textbooks. Today, I strive to keep reading daily, exploring topics such as science, technology, nonfiction, business, education, productivity, and history. This is where I keep track of what I've read and what's on my reading list.",
})

async function loadBooksFromJson(): Promise<SelectBook[]> {
  try {
    const filePath = path.join(process.cwd(), 'json', 'books.json')
    const fileContents = await fs.readFile(filePath, 'utf8')
    const booksData = JSON.parse(fileContents) as Array<{
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
      bookAuthor: string
      year: number
      pageCount: number | null
      userShelves: string
      goodreadsUrl: string
      createdAt: string
      updatedAt: string
      authorId: string
      userRating?: number | string
      averageRating?: number | string
    }>

    return booksData.map((book) => ({
      id: book.id,
      guid: book.id, // using id as guid
      pubDate: book.date,
      title: book.title,
      link: book.goodreadsUrl,
      bookImageUrl: book.images[0] || '',
      bookSmallImageUrl: book.images[0] || '',
      bookMediumImageUrl: book.images[0] || '',
      bookLargeImageUrl: book.images[0] || '',
      bookDescription: book.summary,
      authorName: book.bookAuthor,
      isbn: null, // default
      userName: 'Dana Davis', // default
      userRating: book.userRating ? Number(book.userRating) : 5, // default rating
      userReadAt: book.userShelves === 'read' ? book.date : null,
      userDateAdded: book.date,
      userDateCreated: book.createdAt,
      userShelves: book.userShelves,
      userReview: null, // default
      averageRating: book.averageRating ? Number(book.averageRating) : 4.5, // default
      bookPublished: String(book.year),
      numPages: book.pageCount,
      content: book.content,
      createdAt: new Date(book.createdAt),
      updatedAt: new Date(book.updatedAt),
    }))
  } catch (error) {
    console.error('Error loading books from JSON:', error)
    return []
  }
}

export default async function BooksPage() {
  const books = await loadBooksFromJson()

  return (
    <Container className="pt-4 lg:pt-12">
      <PageHeader
        title="Books"
        description=<p>
          Reading has been my hobby since childhood, starting with comics,
          magazines, and textbooks. Today, I strive to keep reading daily,
          exploring topics such as science, technology, nonfiction, business,
          education, productivity, and history.
          <br />
          This is where I keep track of what I’ve read and what’s on my reading
          list.
        </p>
        className="border-b border-gray-200 dark:border-gray-700"
      />
      <Suspense>
        <BooksList
          books={books.sort(
            (a, b) => Number(b.userRating) - Number(a.userRating),
          )}
        />
      </Suspense>
      <div className="w-1/3 mx-auto border-t border-gray-200 dark:border-gray-700 my-6" />
    </Container>
  )
}
