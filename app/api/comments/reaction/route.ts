import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { NextResponse } from 'next/server'
import { reactToComment } from '~/db/queries'

export async function POST(request: Request) {
  try {
    const { isAuthenticated, getUser } = getKindeServerSession()
    const auth = await isAuthenticated()
    if (!auth)
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const user = await getUser()
    if (!user?.id)
      return NextResponse.json({ error: 'User not found' }, { status: 401 })

    const body = await request.json()
    const { commentId, type } = body
    if (!commentId || !type)
      return NextResponse.json({ error: 'Missing params' }, { status: 400 })

    if (type !== 'LIKE' && type !== 'UNLIKE')
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })

    const updated = await reactToComment(commentId, user.id, type)
    return NextResponse.json({ success: true, comment: updated })
  } catch (error) {
    console.error('reaction error:', error)
    return NextResponse.json(
      { error: 'Failed to update reaction' },
      { status: 500 },
    )
  }
}
