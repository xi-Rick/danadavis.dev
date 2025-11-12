import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { type NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../db'

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

    // Query from Prisma database instead of MDX files
    const post = await prisma.post.findUnique({
      where: { slug },
      include: { author: true },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Return the post data
    return NextResponse.json({
      id: post.id,
      slug: post.slug,
      title: post.title,
      summary: post.summary,
      tags: post.tags,
      categories: post.categories,
      images: post.images,
      canonicalUrl: post.canonicalUrl,
      layout: post.layout,
      bibliography: post.bibliography,
      draft: post.draft,
      featured: post.featured,
      content: post.content,
      date: post.date,
      lastmod: post.lastmod,
      authors: post.authors,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      authorId: post.authorId,
      author: post.author,
    })
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

    // Delete from Prisma database instead of MDX files
    const post = await prisma.post.findUnique({ where: { slug } })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    await prisma.post.delete({ where: { slug } })

    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 },
    )
  }
}
