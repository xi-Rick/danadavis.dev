import * as fs from 'node:fs'
import * as path from 'node:path'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function exportData() {
  try {
    // Ensure the export directory exists
    const exportDir = path.join(__dirname, '..', 'data-export')
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true })
    }

    // Fetch and export Users
    const users = await prisma.user.findMany()
    fs.writeFileSync(
      path.join(exportDir, 'users.json'),
      JSON.stringify(users, null, 2),
    )

    // Fetch and export Posts
    const posts = await prisma.post.findMany()
    fs.writeFileSync(
      path.join(exportDir, 'posts.json'),
      JSON.stringify(posts, null, 2),
    )

    // Fetch and export Projects
    const projects = await prisma.project.findMany()
    fs.writeFileSync(
      path.join(exportDir, 'projects.json'),
      JSON.stringify(projects, null, 2),
    )

    // Fetch and export Movies
    const movies = await prisma.movie.findMany()
    fs.writeFileSync(
      path.join(exportDir, 'movies.json'),
      JSON.stringify(movies, null, 2),
    )

    // Fetch and export Books
    const books = await prisma.book.findMany()
    fs.writeFileSync(
      path.join(exportDir, 'books.json'),
      JSON.stringify(books, null, 2),
    )

    // Fetch and export Snippets
    const snippets = await prisma.snippet.findMany()
    fs.writeFileSync(
      path.join(exportDir, 'snippets.json'),
      JSON.stringify(snippets, null, 2),
    )

    // Fetch and export Products
    const products = await prisma.product.findMany()
    fs.writeFileSync(
      path.join(exportDir, 'products.json'),
      JSON.stringify(products, null, 2),
    )

    // Fetch and export ProductVariants
    const productVariants = await prisma.productVariant.findMany()
    fs.writeFileSync(
      path.join(exportDir, 'product-variants.json'),
      JSON.stringify(productVariants, null, 2),
    )

    // Fetch and export Reviews
    const reviews = await prisma.review.findMany()
    fs.writeFileSync(
      path.join(exportDir, 'reviews.json'),
      JSON.stringify(reviews, null, 2),
    )

    console.log(
      'Data export completed successfully. Files saved in data-export/',
    )
  } catch (error) {
    console.error('Error exporting data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

exportData()
