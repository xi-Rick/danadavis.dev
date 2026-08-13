import { type NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '~/lib/session'
import { prisma } from '../../../db'

export async function POST(request: NextRequest) {
  try {
    const user = await requireAdmin()

    const {
      type,
      title,
      description,
      imgSrc,
      url,
      repo,
      builtWith,
      links,
      content,
      draft,
      featured,
    } = await request.json()

    if (!title || !imgSrc) {
      return NextResponse.json(
        { error: 'Title and image are required' },
        { status: 400 },
      )
    }

    // Generate slug
    let slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Ensure slug is unique
    let existingProject = await prisma.project.findUnique({ where: { slug } })
    let counter = 1
    while (existingProject) {
      slug = `${slug}-${counter}`
      existingProject = await prisma.project.findUnique({ where: { slug } })
      counter++
    }

    // Create project in database
    const newProject = await prisma.project.create({
      data: {
        type: type || 'self',
        title,
        slug,
        description,
        imgSrc,
        url,
        repo,
        builtWith: builtWith || [],
        links: links || null,
        content,
        draft: draft || false,
        featured: featured || false,
        authorId: String(user.id),
      },
    })

    return NextResponse.json({ success: true, slug: newProject.slug })
  } catch (error) {
    console.error('Error saving project:', error)
    return NextResponse.json(
      { error: 'Failed to save project' },
      { status: 500 },
    )
  }
}
