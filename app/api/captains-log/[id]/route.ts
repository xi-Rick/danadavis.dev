import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { type NextRequest, NextResponse } from 'next/server'
import { prisma } from '~/db'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const params = await context.params
  try {
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const logEntry = await prisma.captainsLog.findUnique({
      where: { id: params.id },
    })

    if (!logEntry) {
      return NextResponse.json(
        { error: 'Log entry not found' },
        { status: 404 },
      )
    }

    return NextResponse.json({ logEntry })
  } catch (error) {
    console.error("Error fetching captain's log:", error)
    return NextResponse.json({ error: 'Failed to fetch log' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const params = await context.params
  try {
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      transcription,
      summary,
      contentType,
      tags,
      blogPotential,
      projectPotential,
      isPrivate,
    } = body

    const updatedLog = await prisma.captainsLog.update({
      where: { id: params.id },
      data: {
        transcription,
        summary,
        contentType,
        tags,
        blogPotential,
        projectPotential,
        isPrivate,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({ logEntry: updatedLog })
  } catch (error) {
    console.error("Error updating captain's log:", error)
    return NextResponse.json({ error: 'Failed to update log' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const params = await context.params
  try {
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      transcription,
      summary,
      contentType,
      tags,
      blogPotential,
      projectPotential,
      duration,
      isPrivate,
    } = body

    const updatedLog = await prisma.captainsLog.update({
      where: { id: params.id },
      data: {
        transcription,
        summary,
        contentType,
        tags,
        blogPotential,
        projectPotential,
        duration,
        isPrivate,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({ logEntry: updatedLog })
  } catch (error) {
    console.error("Error updating captain's log:", error)
    return NextResponse.json({ error: 'Failed to update log' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const params = await context.params
  try {
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.captainsLog.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting captain's log:", error)
    return NextResponse.json({ error: 'Failed to delete log' }, { status: 500 })
  }
}
