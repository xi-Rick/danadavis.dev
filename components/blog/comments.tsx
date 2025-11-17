'use client'
import { useState } from 'react'
import { CommentsSection } from '~/components/comments/comment-section'

interface RawComment {
  id: string
  content: string
  createdAt: string | Date
  updatedAt?: string | Date | null
  authorId?: string | null
  authorName?: string | null
  authorImage?: string | null
  authorEmail?: string | null
  parentId?: string | null
  replies?: RawComment[]
  reactionsCount?: number
  userReacted?: boolean
  isDeleted?: boolean
}

interface NormalizedComment
  extends Omit<
    RawComment,
    'createdAt' | 'updatedAt' | 'replies' | 'authorName' | 'authorImage'
  > {
  createdAt: Date
  updatedAt?: Date | null
  replies?: NormalizedComment[]
  authorName: string | null
  authorImage: string | null
}

interface CommentsProps {
  url: string
  identifier: string
  title: string
  className?: string
  postSlug?: string
  comments?: RawComment[]
}

export default function Comments({
  url: _url,
  identifier,
  title: _title,
  className,
  postSlug,
  comments,
}: CommentsProps) {
  const [error, setError] = useState<string | null>(null)
  // Not using reload key anymore since Disqus is removed

  // Always use local comments (Disqus removed)

  if (error) {
    return (
      <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={() => {
            setError(null)
          }}
          className="mt-2 text-sm text-red-600 underline hover:no-underline dark:text-red-400"
        >
          Try again
        </button>
      </div>
    )
  }

  // Normalize raw comment dates into JS Date objects for the UI components
  const normalizeComments = (
    raw: RawComment[] | undefined,
  ): NormalizedComment[] => {
    if (!raw) return []
    return raw.map((c) => ({
      id: c.id,
      content: c.content,
      createdAt: new Date(c.createdAt),
      updatedAt: c.updatedAt ? new Date(c.updatedAt) : null,
      authorId: c.authorId ?? null,
      authorName: c.authorName ?? null,
      authorImage: c.authorImage ?? null,
      authorEmail: c.authorEmail ?? null,
      parentId: c.parentId ?? null,
      replies: normalizeComments(c.replies),
      reactionsCount: c.reactionsCount ?? 0,
      userReacted: c.userReacted ?? false,
      isDeleted: c.isDeleted ?? false,
    }))
  }
  const normalized = normalizeComments(comments)

  return (
    <div className={className}>
      <CommentsSection
        postSlug={postSlug || identifier}
        comments={normalized}
      />
    </div>
  )
}
