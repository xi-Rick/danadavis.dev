import type {
  GoodreadsBook,
  GoodreadsMovie,
  Prisma,
  StatsType,
} from '@prisma/client'
import { prisma } from './index'

export type SelectStats = {
  type: StatsType
  slug: string
  views: number
  loves: number
  applauses: number
  ideas: number
  bullseyes: number
}

export type { StatsType }

export async function getBlogStats(type: StatsType, slug: string) {
  try {
    let stats = await prisma.stats.findUnique({
      where: {
        type_slug: {
          type,
          slug,
        },
      },
    })
    if (stats) {
      return stats
    }
    let newStats = await prisma.stats.create({
      data: {
        type,
        slug,
      },
    })
    return newStats
  } catch (error) {
    // Return default stats if database is unavailable
    return {
      type,
      slug,
      views: 0,
      loves: 0,
      applauses: 0,
      ideas: 0,
      bullseyes: 0,
    }
  }
}

export async function updateBlogStats(
  type: StatsType,
  slug: string,
  updates: Omit<SelectStats, 'type' | 'slug'>,
) {
  try {
    let currentStats = await getBlogStats(type, slug)
    // Safeguard against negative updates
    for (let key in updates) {
      if (
        typeof updates[key] === 'number' &&
        updates[key] < currentStats[key]
      ) {
        updates[key] = currentStats[key]
      }
    }
    let updatedStats = await prisma.stats.update({
      where: {
        type_slug: {
          type,
          slug,
        },
      },
      data: updates,
    })
    return updatedStats
  } catch (error) {
    // Return updated stats if database is unavailable
    let currentStats = await getBlogStats(type, slug)
    return {
      ...currentStats,
      ...updates,
    }
  }
}

export async function getCurrentlyReading(): Promise<GoodreadsBook | null> {
  let books = await prisma.goodreadsBook.findMany({
    where: { userShelves: 'currently-reading' },
    orderBy: { pubDate: 'desc' },
    take: 1,
  })
  return books[0] || null
}

export async function getLastWatchedMovie(): Promise<GoodreadsMovie | null> {
  let movies = await prisma.goodreadsMovie.findMany({
    orderBy: { dateRated: 'desc' },
    take: 1,
  })
  return movies[0] || null
}

export async function upsertBooks(
  booksData: (
    | Prisma.GoodreadsBookCreateInput
    | Prisma.GoodreadsBookUncheckedCreateInput
  )[],
): Promise<GoodreadsBook[]> {
  let result = await Promise.all(
    booksData.map((bookData) =>
      prisma.goodreadsBook.upsert({
        where: { id: bookData.id },
        update: { ...bookData, updatedAt: new Date() },
        create: { ...bookData, updatedAt: new Date() },
      }),
    ),
  )
  return result
}

export async function upsertManyMovies(
  moviesData: (
    | Prisma.GoodreadsMovieCreateInput
    | Prisma.GoodreadsMovieUncheckedCreateInput
  )[],
): Promise<GoodreadsMovie[]> {
  let result = await Promise.all(
    moviesData.map((movieData) =>
      prisma.goodreadsMovie.upsert({
        where: { id: movieData.id },
        update: { ...movieData, updatedAt: new Date() },
        create: { ...movieData, updatedAt: new Date() },
      }),
    ),
  )
  return result
}

export async function getCommentsBySlug(postSlug: string, userId?: string) {
  try {
    // Fetch all non-deleted comments for a post and build a nested replies tree
    const rows = await prisma.comment.findMany({
      where: { postSlug, isDeleted: false },
      orderBy: { createdAt: 'asc' },
      include: { author: true, reactions: true },
    })

    // Normalize rows into a map so we can assemble a nested tree. Maintain
    // the same shape returned previously (with reactionsCount, userReacted,
    // and replies array). This allows the client components to render any
    // depth of nested replies.
    const map = new Map<string, any>()

    for (const r of rows) {
      map.set(r.id, {
        ...r,
        reactionsCount: r.reactions.length,
        userReacted: userId
          ? r.reactions.some((rx) => rx.userId === userId)
          : false,
        replies: [],
      })
    }

    const roots: any[] = []
    for (const r of rows) {
      const node = map.get(r.id)
      if (r.parentId) {
        const parent = map.get(r.parentId)
        if (parent) {
          parent.replies.push(node)
        } else {
          // If parent isn't in the map (deleted or missing), treat this as
          // a top-level comment to avoid losing content.
          roots.push(node)
        }
      } else {
        roots.push(node)
      }
    }
    return roots
  } catch (error) {
    console.error('Error fetching comments for slug', postSlug, error)
    // If the database schema hasn't been migrated yet and the comments table or
    // columns are missing, return an empty list so the site still loads.
    const err = error as { code?: string } | undefined
    if (err?.code === 'P2022') {
      return []
    }
    return []
  }
}

export async function createComment(data: {
  postSlug: string
  parentId?: string | null
  content: string
  authorId?: string | null
  authorName?: string | null
  authorEmail?: string | null
  authorImage?: string | null
}) {
  try {
    // Ensure we don't try to set an authorId that doesn't exist in the DB.
    // If an authorId is provided, prefer that id if it exists; otherwise try
    // to find a user by email and use that user.id. If it still doesn't exist
    // and an email is provided, create a user record so the foreign key is valid.
    let authorIdToUse: string | null = null
    if (data.authorId) {
      const existingById = await prisma.user.findUnique({
        where: { id: data.authorId },
      })
      if (existingById) {
        authorIdToUse = existingById.id
      } else if (data.authorEmail) {
        const existingByEmail = await prisma.user.findUnique({
          where: { email: data.authorEmail },
        })
        if (existingByEmail) {
          authorIdToUse = existingByEmail.id
        } else {
          // Only create a user if we have an email — otherwise leave as null
          // to avoid creating users with incomplete data.
          try {
            const created = await prisma.user.create({
              data: {
                id: data.authorId,
                email: data.authorEmail,
                name: data.authorName || undefined,
              },
            })
            authorIdToUse = created.id
          } catch (createErr) {
            // If creating the user fails (e.g., duplicate email or other
            // constraint), fall back to not setting the authorId to avoid
            // breaking the comment creation.
            console.warn(
              'createComment: unable to create user for authorId',
              data.authorId,
              createErr,
            )
            authorIdToUse = null
          }
        }
      } else {
        // We have an authorId but no email to try to bootstrap a user; don't
        // set authorId in the comment to avoid FK violations.
        authorIdToUse = null
      }
    } else if (data.authorEmail) {
      // No authorId provided — try finding a user by email to attach
      const existingByEmail = await prisma.user.findUnique({
        where: { email: data.authorEmail },
      })
      if (existingByEmail) authorIdToUse = existingByEmail.id
    }

    const result = await prisma.comment.create({
      data: {
        postSlug: data.postSlug,
        parentId: data.parentId || null,
        content: data.content,
        authorId: authorIdToUse || null,
        authorName: data.authorName || null,
        authorEmail: data.authorEmail || null,
        authorImage: data.authorImage || null,
      },
    })
    return result
  } catch (err) {
    console.error('createComment error:', err)
    const e = err as { code?: string } | undefined
    if (e?.code === 'P2022') {
      // Prisma client expects a column that doesn't exist in the DB.
      // Surface a more helpful message for operators.
      throw new Error(
        'Database schema mismatch: run `prisma migrate dev` or `prisma migrate deploy` to update your DB schema.',
      )
    }
    throw err
  }
}

export async function deleteComment(commentId: string) {
  try {
    const result = await prisma.comment.update({
      where: { id: commentId },
      data: { isDeleted: true },
    })
    return result
  } catch (err) {
    console.error('deleteComment error:', err)
    throw err
  }
}

export async function reactToComment(
  commentId: string,
  userId: string,
  type: 'LIKE' | 'UNLIKE',
) {
  try {
    // Check if user has already reacted to this comment
    const existingReaction = await prisma.commentReaction.findUnique({
      where: {
        commentId_userId: {
          commentId,
          userId,
        },
      },
    })

    if (type === 'LIKE') {
      if (existingReaction) {
        // User already liked, this shouldn't happen but return current state
        const comment = await prisma.comment.findUnique({
          where: { id: commentId },
          include: { reactions: true },
        })
        return { ...comment, reactionsCount: comment?.reactions.length ?? 0 }
      }
      // Add new reaction
      await prisma.commentReaction.create({
        data: {
          commentId,
          userId,
        },
      })
    } else if (type === 'UNLIKE') {
      if (existingReaction) {
        // Remove existing reaction
        await prisma.commentReaction.delete({
          where: {
            commentId_userId: {
              commentId,
              userId,
            },
          },
        })
      } else {
        // User hasn't liked, this shouldn't happen but return current state
        const comment = await prisma.comment.findUnique({
          where: { id: commentId },
          include: { reactions: true },
        })
        return { ...comment, reactionsCount: comment?.reactions.length ?? 0 }
      }
    }

    // Return updated comment with reaction count
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { reactions: true },
    })
    return { ...comment, reactionsCount: comment?.reactions.length ?? 0 }
  } catch (err) {
    console.error('reactToComment error:', err)
    throw err
  }
}

export async function getShopItems() {
  try {
    const items = await prisma.shopItem.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
    })
    return items
  } catch (error) {
    console.error('Error loading shop items from database:', error)
    return []
  }
}

export async function getShopItemBySlug(slug: string) {
  try {
    const item = await prisma.shopItem.findUnique({
      where: { slug },
    })
    return item
  } catch (error) {
    console.error('Error loading shop item by slug:', error)
    return null
  }
}

export async function updateShopItemContributed(
  slug: string,
  additionalAmount: number,
) {
  try {
    const item = await prisma.shopItem.findUnique({
      where: { slug },
    })
    if (!item) {
      throw new Error('Shop item not found')
    }

    const newContributed = item.contributed + additionalAmount
    const updatedItem = await prisma.shopItem.update({
      where: { slug },
      data: {
        contributed: newContributed,
        updatedAt: new Date(),
      },
    })
    return updatedItem
  } catch (error) {
    console.error('Error updating shop item contributed amount:', error)
    throw error
  }
}

export async function createContribution(
  shopItemId: string,
  amount: number,
  stripeSessionId?: string,
  email?: string,
) {
  try {
    const contribution = await prisma.contribution.create({
      data: {
        shopItemId,
        amount,
        stripeSessionId,
        email,
      },
    })
    return contribution
  } catch (error) {
    console.error('Error creating contribution:', error)
    throw error
  }
}
