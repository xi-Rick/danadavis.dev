import { readFileSync, unlinkSync } from 'node:fs'
import { join } from 'node:path'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import matter from 'gray-matter'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { isAuthenticated } = getKindeServerSession()
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { slug } = await params
    const filePath = join(process.cwd(), 'data', 'blog', `${slug}.mdx`)

    try {
      const fileContent = readFileSync(filePath, 'utf-8')
      const { data, content } = matter(fileContent)

      // Return the post data
      return NextResponse.json({
        slug,
        title: data.title || '',
        summary: data.summary || '',
        tags: data.tags || [],
        categories: data.categories || [],
        images: data.images || [],
        canonicalUrl: data.canonicalUrl || '',
        layout: data.layout || '',
        bibliography: data.bibliography || '',
        draft: data.draft || false,
        featured: data.featured || false,
        content,
        date: data.date,
        lastmod: data.lastmod,
        authors: data.authors || [],
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        authorId: data.authorId,
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_fileError) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }
  } catch (error) {
    console.error('Error loading post:', error)
    return NextResponse.json({ error: 'Failed to load post' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { isAuthenticated } = getKindeServerSession()
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { slug } = await params
    const filePath = join(process.cwd(), 'data', 'blog', `${slug}.mdx`)

    try {
      // Check if file exists before deleting
      readFileSync(filePath, 'utf-8')
      // Delete the file
      unlinkSync(filePath)

      return NextResponse.json({ message: 'Post deleted successfully' })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_fileError) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 },
    )
  }
}
