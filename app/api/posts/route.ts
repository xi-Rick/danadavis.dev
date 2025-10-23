import { NextResponse } from 'next/server'
import { prisma } from '../../../db'

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { date: 'desc' },
      include: { author: true },
    })

    const formattedPosts = posts.map((post) => ({
      slug: post.slug,
      title: post.title,
      summary: post.summary || '',
      tags: post.tags,
      categories: post.categories,
      images: post.images,
      canonicalUrl: post.canonicalUrl,
      layout: post.layout,
      bibliography: post.bibliography,
      draft: post.draft,
      featured: post.featured,
      date: post.date.toISOString(),
      content: post.content,
      authors: post.authors,
    }))

    return NextResponse.json({ posts: formattedPosts })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 },
    )
  }
}
