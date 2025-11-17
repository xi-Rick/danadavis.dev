'use client'

import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import { format } from 'date-fns'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { Badge } from '~/components/ui/badge'
import { GrowingUnderline } from '~/components/ui/growing-underline'
import {
  FADE_IN_ANIMATION_VARIANTS,
  FADE_UP_ANIMATION_VARIANTS,
} from '~/lib/animations'
import { fetcher, normalizeEmail } from '~/utils/misc'
import { CommentForm } from './comment-form'

interface Comment {
  id: string
  content: string
  createdAt: Date
  updatedAt?: Date | null
  authorName: string | null
  authorImage: string | null
  authorEmail?: string | null
  authorId?: string | null
  parentId?: string | null
  replies?: Comment[]
  reactionsCount?: number
  userReacted?: boolean
  isDeleted?: boolean
}

interface CommentItemProps {
  comment: Comment
  postSlug?: string | null
  depth?: number
  compact?: boolean
}

export function CommentItem({
  comment,
  postSlug,
  depth = 0,
  compact = false,
}: CommentItemProps) {
  const { user } = useKindeBrowserClient()
  const [showReply, setShowReply] = useState(false)
  const [liked, setLiked] = useState(!!comment.userReacted)
  const [likes, setLikes] = useState<number>(comment.reactionsCount ?? 0)
  // avatar sizes: compact (nested) use smaller avatars
  const avatarSize: number = compact
    ? 32
    : depth === 0
      ? 48
      : depth === 1
        ? 40
        : 32
  const [showReplies, setShowReplies] = useState<boolean>(depth === 0)
  const [deleted, setDeleted] = useState<boolean>(!!comment.isDeleted)

  const handleToggleLike = async () => {
    // optimistic
    setLiked((v) => !v)
    setLikes((n) => (liked ? Math.max(0, n - 1) : n + 1))
    try {
      await fetch('/api/comments/reaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commentId: comment.id,
          type: liked ? 'UNLIKE' : 'LIKE',
        }),
      })
    } catch (err) {
      console.error('like reaction error', err)
      setLiked((v) => !v)
      setLikes((n) => (liked ? n + 1 : Math.max(0, n - 1)))
    }
  }

  const { data: adminInfo } = useSWR<{ isAdmin: boolean; adminEmail: string }>(
    '/api/admin/is-admin',
    fetcher,
  )
  const adminEmail = normalizeEmail(adminInfo?.adminEmail || '')
  const isAdminUser = !!(
    user?.email &&
    adminEmail &&
    normalizeEmail(user.email) === adminEmail
  )

  const canDelete =
    isAdminUser ||
    !!(user?.id && comment.authorId && user.id === comment.authorId) ||
    !!(
      user?.email &&
      comment.authorEmail &&
      normalizeEmail(user.email) === normalizeEmail(comment.authorEmail)
    ) ||
    (!!user?.given_name &&
      (user.given_name === comment.authorName ||
        user.family_name === comment.authorName))

  const handleDelete = async () => {
    const ok = window.confirm('Delete this comment? This cannot be undone.')
    if (!ok) return

    setDeleted(true)
    try {
      const res = await fetch('/api/comments/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId: comment.id }),
      })
      if (!res.ok) throw new Error('Delete failed')
    } catch (err) {
      setDeleted(false)
      alert('Unable to delete comment. Please try again.')
    }
  }

  useEffect(() => {
    try {
      console.debug('CommentItem mount', { id: comment.id, depth })
    } catch (e) {
      // noop
    }
    // ...existing code...
  }, [comment.id, depth])

  // If this is a nested reply (compact mode), render a minimal chrome view to avoid duplicating the full UI
  if (compact || depth > 0) {
    return (
      <motion.div
        variants={FADE_UP_ANIMATION_VARIANTS}
        initial="hidden"
        animate="show"
        exit="exit"
        className="pl-4 border-l dark:border-green-800 border-orange-200 py-2"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            {/* Avatar for replies */}
            <div className="flex-shrink-0">
              {comment.authorImage ? (
                <Image
                  src={comment.authorImage}
                  alt={comment.authorName || 'User'}
                  width={avatarSize}
                  height={avatarSize}
                  className="rounded-full border-2 border-orange-200 dark:border-green-800 shadow-sm ring-2 ring-orange-100 dark:ring-green-900/50"
                />
              ) : (
                <div
                  style={{ width: avatarSize, height: avatarSize }}
                  className="bg-gradient-to-br from-orange-100 to-orange-200 dark:from-green-900 dark:to-green-800 rounded-full flex items-center justify-center border-2 border-orange-300 dark:border-green-700 shadow-sm"
                >
                  <span className="text-orange-600 dark:text-green-400 font-bold text-sm">
                    {(comment.authorName || 'U')[0].toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {comment.authorName || 'Anonymous'}
                </span>
                {normalizeEmail(comment.authorEmail) === adminEmail && (
                  <Badge className="ml-2" variant="themed">
                    Admin
                  </Badge>
                )}
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {format(
                    new Date(comment.createdAt),
                    "MMM d, yyyy 'at' h:mm a",
                  )}
                </span>
              </div>

              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 whitespace-pre-wrap">
                {comment.content}
              </p>

              <div className="mt-2 flex items-center gap-3 text-sm">
                {!deleted && (
                  <>
                    <button
                      onClick={() => setShowReply((s) => !s)}
                      className="text-sm font-medium text-orange-500 dark:text-green-400 bg-transparent p-0"
                    >
                      <GrowingUnderline className="inline-block">
                        Reply
                      </GrowingUnderline>
                    </button>

                    <button
                      onClick={handleToggleLike}
                      aria-pressed={liked}
                      className={`text-sm font-medium px-2 py-0.5 rounded transition-colors ${
                        liked
                          ? 'text-white bg-orange-500 dark:bg-green-600'
                          : 'text-orange-500 dark:text-green-400 bg-transparent hover:underline'
                      }`}
                    >
                      👍 {likes}
                    </button>

                    {canDelete && (
                      <button
                        onClick={handleDelete}
                        className="text-sm font-medium text-red-600 dark:text-red-400 hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </>
                )}
              </div>

              <AnimatePresence>
                {showReply && postSlug && !deleted && (
                  <motion.div
                    variants={FADE_UP_ANIMATION_VARIANTS}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    className="mt-3"
                  >
                    <CommentForm
                      postSlug={postSlug}
                      parentId={comment.id}
                      onCancel={() => setShowReply(false)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {deleted && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                    This comment was deleted by the author.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Compact layout keeps actions inline; avatar shown to the left */}
        </div>

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2">
            {!showReplies ? (
              <button
                onClick={() => setShowReplies(true)}
                className="text-sm text-gray-600 dark:text-gray-300 hover:underline"
              >
                View {comment.replies.length}{' '}
                {comment.replies.length === 1 ? 'reply' : 'replies'}
              </button>
            ) : (
              <div className="space-y-2 mt-2">
                <button
                  onClick={() => setShowReplies(false)}
                  className="text-xs text-gray-500 dark:text-gray-400 hover:underline mb-1"
                >
                  Hide replies
                </button>
                <AnimatePresence initial={false} mode="sync">
                  {comment.replies.map((reply) => (
                    <motion.div
                      key={reply.id}
                      variants={FADE_IN_ANIMATION_VARIANTS}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                    >
                      <CommentItem
                        comment={reply}
                        postSlug={postSlug}
                        depth={depth + 1}
                        compact={true}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}
      </motion.div>
    )
  }

  // Full (root) comment rendering
  return (
    <motion.div
      variants={FADE_UP_ANIMATION_VARIANTS}
      initial="hidden"
      animate="show"
      exit="exit"
      className={`flex flex-col sm:flex-row gap-2 sm:gap-4 group transition-colors duration-200 rounded-lg p-3 md:p-4 border border-orange-300 dark:border-green-700  ${
        depth > 0 ? 'sm:pl-8' : ''
      }`}
    >
      <div className="flex-shrink-0">
        {comment.authorImage ? (
          <Image
            src={comment.authorImage}
            alt={comment.authorName || 'User'}
            width={avatarSize}
            height={avatarSize}
            className="rounded-full border-2 border-orange-200 dark:border-green-800 shadow-sm ring-2 ring-orange-100 dark:ring-green-900/50"
          />
        ) : (
          <div
            style={{ width: avatarSize, height: avatarSize }}
            className="bg-gradient-to-br from-orange-100 to-orange-200 dark:from-green-900 dark:to-green-800 rounded-full flex items-center justify-center border-2 border-orange-300 dark:border-green-700 shadow-sm"
          >
            <span className="text-orange-600 dark:text-green-400 font-bold text-lg">
              {(comment.authorName || 'U')[0].toUpperCase()}
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <span
            className={'font-semibold text-gray-900 dark:text-white text-base'}
          >
            {comment.authorName || 'Anonymous'}
          </span>
          {normalizeEmail(comment.authorEmail) === adminEmail && (
            <Badge className="ml-2" variant="themed">
              Admin
            </Badge>
          )}
          <span
            className={'text-sm text-gray-500 dark:text-gray-400 font-medium'}
          >
            {format(new Date(comment.createdAt), "MMM d, yyyy 'at' h:mm a")}
          </span>
        </div>

        <div className={'prose prose-sm dark:prose-invert max-w-none'}>
          <p
            className={
              'text-gray-700 dark:text-gray-300 leading-relaxed mb-0 whitespace-pre-wrap'
            }
          >
            {comment.content}
          </p>
        </div>

        <div className="mt-2 flex items-center gap-3">
          {!deleted && (
            <>
              <button
                onClick={() => setShowReply((s) => !s)}
                className="text-sm font-medium text-orange-500 dark:text-green-400 bg-transparent p-0"
              >
                <GrowingUnderline className="inline-block">
                  Reply
                </GrowingUnderline>
              </button>

              <button
                onClick={handleToggleLike}
                aria-pressed={liked}
                className={`text-sm font-medium px-2 py-1 rounded-lg transition-colors ${
                  liked
                    ? 'text-white bg-orange-500 dark:bg-green-600'
                    : 'text-orange-500 dark:text-green-400 bg-transparent hover:underline'
                }`}
              >
                👍 {likes}
              </button>

              {canDelete && (
                <button
                  onClick={handleDelete}
                  className="text-sm font-medium text-red-600 dark:text-red-400 hover:underline"
                >
                  Delete
                </button>
              )}
            </>
          )}
        </div>

        <AnimatePresence>
          {showReply && postSlug && !deleted && (
            <motion.div
              variants={FADE_UP_ANIMATION_VARIANTS}
              initial="hidden"
              animate="show"
              exit="exit"
              className="mt-3"
            >
              <CommentForm
                postSlug={postSlug}
                parentId={comment.id}
                onCancel={() => setShowReply(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {deleted ? (
          <div className="mt-3">
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
              This comment was deleted by the author.
            </p>
          </div>
        ) : null}

        {!deleted && comment.replies && comment.replies.length > 0 && (
          <div className="mt-2 space-y-2">
            {!showReplies ? (
              <button
                onClick={() => setShowReplies(true)}
                className="text-sm text-gray-600 dark:text-gray-300 hover:underline"
              >
                View {comment.replies.length}{' '}
                {comment.replies.length === 1 ? 'reply' : 'replies'}
              </button>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => setShowReplies(false)}
                  className="text-xs text-gray-500 dark:text-gray-400 hover:underline mb-1"
                >
                  Hide replies
                </button>
                <AnimatePresence initial={false} mode="sync">
                  {comment.replies.map((reply) => (
                    <motion.div
                      key={reply.id}
                      variants={FADE_IN_ANIMATION_VARIANTS}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                    >
                      <CommentItem
                        comment={reply}
                        postSlug={postSlug}
                        depth={depth + 1}
                        compact={true}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}
