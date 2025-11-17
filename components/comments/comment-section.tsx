'use client'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { FADE_UP_ANIMATION_VARIANTS } from '~/lib/animations'
import { RadiantCard } from '../ui/radiant-card'
import { CommentForm } from './comment-form'
import { CommentList } from './comment-list'

interface Comment {
  id: string
  content: string
  createdAt: Date
  authorName: string | null
  authorImage: string | null
}

interface CommentsSectionProps {
  postSlug: string
  comments: Comment[]
}

export function CommentsSection({ postSlug, comments }: CommentsSectionProps) {
  useEffect(() => {
    try {
      // Simple client-side debug: log when the comments section mounts for a slug
      if (typeof window !== 'undefined') {
        // console.debug is fine for local debugging and won't affect UI
        console.debug('CommentsSection mount', {
          postSlug,
          count: comments.length,
        })
      }
    } catch (e) {
      // noop
    }
  }, [postSlug, comments.length])

  return (
    <motion.div
      variants={FADE_UP_ANIMATION_VARIANTS}
      initial="hidden"
      animate="show"
      // add a dedicated class so other UI can reliably target the comments area
      className="comments-section mt-12 space-y-8"
      id="comment"
    >
      <div>
        <motion.div
          variants={FADE_UP_ANIMATION_VARIANTS}
          initial={false}
          animate="show"
          className="w-full"
        >
          <CommentForm postSlug={postSlug} />
        </motion.div>
      </div>

      {comments.length > 0 && (
        <motion.div
          variants={FADE_UP_ANIMATION_VARIANTS}
          initial={false}
          animate="show"
        >
          <RadiantCard className="p-6 md:p-10">
            <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
              {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
            </h3>
            <CommentList postSlug={postSlug} comments={comments} />
          </RadiantCard>
        </motion.div>
      )}
    </motion.div>
  )
}
