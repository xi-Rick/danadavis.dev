'use server'

import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { revalidatePath } from 'next/cache'
import { createComment } from '~/db/queries'

export async function submitComment(formData: FormData) {
  try {
    // Validate basic form data
    const postSlug = formData.get('postSlug') as string | null
    const parentId = (formData.get('parentId') as string) || null
    const content = formData.get('content') as string | null

    if (!postSlug || !content) {
      return { error: 'Missing required fields' }
    }

    const { getUser, isAuthenticated } = getKindeServerSession()
    const auth = await isAuthenticated()
    if (!auth) {
      return { error: 'You must be signed in to post a comment' }
    }
    const kindeUser = await getUser()
    const authorId = kindeUser?.id || null
    const authorName =
      kindeUser?.given_name ||
      kindeUser?.family_name ||
      kindeUser?.email ||
      null
    const authorEmail = kindeUser?.email || null
    const authorImage = kindeUser?.picture || null

    const comment = await createComment({
      postSlug,
      parentId,
      content,
      authorId,
      authorName,
      authorEmail,
      authorImage,
    })

    // Revalidate the post page so server components fetch the latest comments
    try {
      // Revalidate the correct path depending on post type. We use
      // a `project-<slug>` prefix when creating comments for projects.
      // For blogs/posts we keep the plain slug that maps to `/blog/<slug>`
      let pathToRevalidate = `/blog/${postSlug}`
      if (postSlug.startsWith('project-')) {
        pathToRevalidate = `/projects/${postSlug.replace(/^project-/, '')}`
      }
      revalidatePath(pathToRevalidate)
    } catch (revalErr) {
      console.warn('submitComment: revalidatePath failed', revalErr)
    }

    return { success: true, comment }
  } catch (error: unknown) {
    console.error('submitComment error:', error)
    const message = error instanceof Error ? error.message : String(error)
    return { error: message || 'Unable to submit comment' }
  }
}
