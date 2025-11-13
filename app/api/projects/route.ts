import { NextResponse } from 'next/server'
import { prisma } from '../../../db'

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { date: 'desc' },
      include: { author: true },
    })

    const formattedProjects = projects.map((project) => ({
      id: project.id,
      type: project.type as 'work' | 'self',
      title: project.title,
      slug: project.slug,
      description: project.description || '',
      imgSrc: project.imgSrc,
      url: project.url,
      repo: project.repo,
      builtWith: project.builtWith,
      links: project.links as { title: string; url: string }[] | undefined,
      content: project.content || '',
      draft: project.draft,
      featured: project.featured,
      date: project.date.toISOString(),
      lastmod: project.lastmod.toISOString(),
    }))

    return NextResponse.json({ projects: formattedProjects })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 },
    )
  }
}
