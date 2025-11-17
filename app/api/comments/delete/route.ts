import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'
import { prisma } from '~/db'
import { deleteComment } from '~/db/queries'
import { normalizeEmail } from '~/utils/misc'

export async function POST(request: Request) {
  try {
    const { isAuthenticated, getUser } = getKindeServerSession()
    const auth = await isAuthenticated()
    if (!auth)
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const user = await getUser()
    const { commentId } = await request.json()
    if (!commentId)
      return NextResponse.json({ error: 'Missing commentId' }, { status: 400 })

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    })
    if (!comment)
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })

    // Only allow delete if the user created the comment OR the user is the admin
    const adminEmail = normalizeEmail(process.env.ADMIN_EMAIL || '')
    const isAdminUser = !!(
      user?.email &&
      adminEmail &&
      normalizeEmail(user.email) === adminEmail
    )
    const isCommentAuthorById = !!(
      comment.authorId &&
      user?.id &&
      user.id === comment.authorId
    )
    const isCommentAuthorByEmail = !!(
      comment.authorEmail &&
      user?.email &&
      normalizeEmail(user.email) === normalizeEmail(comment.authorEmail)
    )

    if (!isAdminUser && !isCommentAuthorById && !isCommentAuthorByEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const res = await deleteComment(commentId)

    // Revalidate the post page so server components fetch the latest comments
    try {
      let pathToRevalidate = `/blog/${comment.postSlug}`
      if (comment.postSlug.startsWith('project-')) {
        pathToRevalidate = `/projects/${comment.postSlug.replace(/^project-/, '')}`
      }
      revalidatePath(pathToRevalidate)
    } catch (revalErr) {
      console.warn('deleteComment: revalidatePath failed', revalErr)
    }

    return NextResponse.json({ success: true, comment: res })
  } catch (error) {
    console.error('delete comment error:', error)
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 },
    )
  }
}
