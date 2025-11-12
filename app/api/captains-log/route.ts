import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { type NextRequest, NextResponse } from 'next/server'
import { prisma } from '~/db'

export async function GET(request: NextRequest) {
  try {
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const showPrivate = searchParams.get('showPrivate') === 'true'
    const limit = Number.parseInt(searchParams.get('limit') || '50', 10)

    const allLogs = await prisma.captainsLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: limit,
    })

    const filteredLogs = showPrivate
      ? allLogs
      : allLogs.filter((log) => !log.isPrivate)

    return NextResponse.json({ logEntries: filteredLogs })
  } catch (error) {
    console.error("Error fetching captain's logs:", error)
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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

    const newLog = await prisma.captainsLog.create({
      data: {
        transcription,
        summary,
        contentType,
        tags: tags || [],
        blogPotential: blogPotential || false,
        projectPotential: projectPotential || false,
        duration,
        isPrivate: isPrivate !== undefined ? isPrivate : true,
      },
    })

    return NextResponse.json({ logEntry: newLog }, { status: 201 })
  } catch (error) {
    console.error("Error creating captain's log:", error)
    return NextResponse.json({ error: 'Failed to create log' }, { status: 500 })
  }
}
