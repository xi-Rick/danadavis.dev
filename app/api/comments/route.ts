import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { NextResponse } from 'next/server'
import { getCommentsBySlug } from '~/db/queries'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    if (!slug)
      return NextResponse.json({ error: 'Missing slug' }, { status: 400 })

    const { getUser } = getKindeServerSession()
    const user = await getUser()
    const userId = user?.id

    const comments = await getCommentsBySlug(slug, userId)
    return NextResponse.json({ comments })
  } catch (error) {
    console.error('get comments error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 },
    )
  }
}
