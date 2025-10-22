import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const postsDirectory = path.join(process.cwd(), 'data', 'blog')

    // Check if directory exists
    if (!fs.existsSync(postsDirectory)) {
      return NextResponse.json({ posts: [] })
    }

    const fileNames = fs.readdirSync(postsDirectory)
    const posts = fileNames
      .filter((fileName) => fileName.endsWith('.mdx'))
      .map((fileName) => {
        const slug = fileName.replace(/\.mdx$/, '')
        const fullPath = path.join(postsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data, content } = matter(fileContents)

        return {
          slug,
          title: data.title || 'Untitled',
          summary: data.summary || '',
          tags: data.tags || [],
          categories: data.categories || [],
          images: data.images || [],
          canonicalUrl: data.canonicalUrl || null,
          layout: data.layout || null,
          bibliography: data.bibliography || null,
          draft: data.draft || false,
          featured: data.featured || false,
          date: data.date || new Date().toISOString(),
          content: content,
        }
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 },
    )
  }
}
