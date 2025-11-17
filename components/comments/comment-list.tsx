'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import {
  FADE_UP_ANIMATION_VARIANTS,
  PAGE_TRANSITION_VARIANTS,
} from '~/lib/animations'
import { CommentItem } from './comment-item'

interface Comment {
  id: string
  content: string
  createdAt: Date
  authorName: string | null
  authorImage: string | null
  authorId?: string | null
  authorEmail?: string | null
}

interface CommentListProps {
  postSlug?: string
  comments: Comment[]
}

export function CommentList({ comments, postSlug }: CommentListProps) {
  useEffect(() => {
    try {
      console.debug('CommentList mounted', {
        count: comments.length,
        postSlug,
      })
    } catch (e) {
      // noop
    }
  }, [comments.length, postSlug])
  if (comments.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="space-y-4">
          <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-green-900 dark:to-green-800 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-7 h-7 text-orange-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              No comments yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
              Be the first to share your thoughts and start the conversation!
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      variants={PAGE_TRANSITION_VARIANTS}
      initial="hidden"
      animate="show"
      className="space-y-3"
    >
      <AnimatePresence initial={false} mode="sync">
        {comments.map((comment) => (
          <motion.div
            key={comment.id}
            variants={FADE_UP_ANIMATION_VARIANTS}
            initial="hidden"
            animate="show"
          >
            <CommentItem comment={comment} postSlug={postSlug} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}
