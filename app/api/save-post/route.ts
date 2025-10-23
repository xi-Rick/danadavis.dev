import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { type NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../db'

export async function PUT(request: NextRequest) {
  try {
    const { getUser, isAuthenticated } = getKindeServerSession()
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await getUser()
    if (!user || !user.id) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 })
    }

    const {
      slug,
      title,
      summary,
      tags,
      categories,
      images,
      canonicalUrl,
      layout,
      bibliography,
      draft,
      featured,
      content,
    } = await request.json()

    if (!slug || !title || !content) {
      return NextResponse.json(
        { error: 'Slug, title and content are required' },
        { status: 400 },
      )
    }

    // Update post in database
    const updatedPost = await prisma.post.update({
      where: { slug },
      data: {
        title,
        summary,
        content,
        tags: tags || [],
        categories: categories || [],
        images: images || [],
        canonicalUrl,
        layout,
        bibliography,
        draft: draft || false,
        featured: featured || false,
        lastmod: new Date(),
      },
    })

    return NextResponse.json({ success: true, slug: updatedPost.slug })
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { getUser, isAuthenticated } = getKindeServerSession()
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await getUser()
    if (!user || !user.id) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 })
    }

    const {
      title,
      summary,
      tags,
      categories,
      images,
      canonicalUrl,
      layout,
      bibliography,
      draft,
      featured,
      content,
    } = await request.json()

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 },
      )
    }

    // Generate slug
    let slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Ensure slug is unique
    let existingPost = await prisma.post.findUnique({ where: { slug } })
    let counter = 1
    while (existingPost) {
      slug = `${slug}-${counter}`
      existingPost = await prisma.post.findUnique({ where: { slug } })
      counter++
    }

    // Create post in database
    const newPost = await prisma.post.create({
      data: {
        title,
        slug,
        summary,
        content,
        tags: tags || [],
        categories: categories || [],
        images: images || [],
        authors: ['Dana Davis'],
        canonicalUrl,
        layout,
        bibliography,
        draft: draft || false,
        featured: featured || false,
        authorId: user.id,
      },
    })

    return NextResponse.json({ success: true, slug: newPost.slug })
  } catch (error) {
    console.error('Error saving post:', error)
    return NextResponse.json({ error: 'Failed to save post' }, { status: 500 })
  }
}
