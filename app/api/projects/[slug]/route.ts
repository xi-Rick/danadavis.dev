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

    const project = await prisma.project.findUnique({
      where: { slug },
      include: { author: true },
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json({
      id: project.id,
      type: project.type,
      title: project.title,
      slug: project.slug,
      description: project.description,
      imgSrc: project.imgSrc,
      url: project.url,
      repo: project.repo,
      builtWith: project.builtWith,
      links: project.links,
      content: project.content,
      draft: project.draft,
      featured: project.featured,
      date: project.date,
      lastmod: project.lastmod,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      authorId: project.authorId,
      author: project.author,
    })
  } catch (error) {
    console.error('Error loading project:', error)
    return NextResponse.json(
      { error: 'Failed to load project' },
      { status: 500 },
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { isAuthenticated } = getKindeServerSession()
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { slug } = await params
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

    const updatedProject = await prisma.project.update({
      where: { slug },
      data: {
        type,
        title,
        description,
        imgSrc,
        url,
        repo,
        builtWith: builtWith || [],
        links: links || null,
        content,
        draft: draft || false,
        featured: featured || false,
        lastmod: new Date(),
      },
    })

    return NextResponse.json({ success: true, slug: updatedProject.slug })
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 },
    )
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

    const project = await prisma.project.findUnique({ where: { slug } })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    await prisma.project.delete({ where: { slug } })

    return NextResponse.json({ message: 'Project deleted successfully' })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 },
    )
  }
}
