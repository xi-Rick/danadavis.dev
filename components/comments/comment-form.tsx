'use client'

import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { submitComment } from '~/app/actions/comments'
import { SignInButton } from '~/components/comments/signin-button'
import { GrowingUnderline } from '~/components/ui/growing-underline'
import { RadiantCard } from '~/components/ui/radiant-card'
import { FADE_UP_ANIMATION_VARIANTS } from '~/lib/animations'
import { Link } from '../ui/link'
import { Twemoji } from '../ui/twemoji'

interface CommentFormProps {
  postSlug: string
  parentId?: string | null
  isReply?: boolean
  onCancel?: () => void
}

export function CommentForm({
  postSlug,
  parentId,
  isReply = false,
  onCancel,
}: CommentFormProps) {
  const { user, isAuthenticated, isLoading } = useKindeBrowserClient()
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const wrapperRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // Only register handlers for reply/inline forms
    if (!parentId && !isReply) return

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (wrapperRef.current && !wrapperRef.current.contains(target)) {
        if (!onCancel) return
        if (content.trim()) {
          if (!window.confirm('Discard your reply?')) return
        }
        onCancel()
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (!onCancel) return
        if (content.trim()) {
          if (!window.confirm('Discard your reply?')) return
        }
        onCancel()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [content, onCancel, parentId, isReply])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsSubmitting(true)
    setError('')

    const formData = new FormData()
    formData.append('postSlug', postSlug)
    if (parentId) formData.append('parentId', parentId)
    formData.append('content', content.trim())

    const result = await submitComment(formData)

    if (result.error) {
      setError(result.error)
    } else {
      setContent('')
      // Close the inline reply form after a successful submit if a cancel handler was passed
      if (onCancel) onCancel()
      // The page will revalidate due to revalidatePath
    }

    setIsSubmitting(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-orange-500 dark:border-green-400 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <RadiantCard className="p-8 md:p-10">
        <div className="text-center space-y-6">
          <div className="space-y-3">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Join the conversation
            </h3>
          </div>
          <div className="flex justify-center">
            <SignInButton />
          </div>
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your comments help build a better community. Let&apos;s discuss!
              💬
            </p>
            <p className="pt-1 text-sm text-gray-500 dark:text-gray-400">
              Powered by&nbsp;
              <Link
                href="https://kinde.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="normal-case">
                  Kinde <Twemoji emoji="lock" />
                </span>
              </Link>
            </p>
          </div>
        </div>
      </RadiantCard>
    )
  }

  // If this is a reply (parentId provided) render a compact inline form
  // so we don't duplicate the full comment card UI for reply forms.
  if (parentId || isReply) {
    return (
      <motion.div
        ref={wrapperRef}
        variants={FADE_UP_ANIMATION_VARIANTS}
        initial={false}
        animate="show"
        exit="exit"
        className="w-full space-y-3"
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          <motion.textarea
            id="comment"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your reply..."
            className="themed-textarea w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-green-500 focus:border-orange-500 dark:focus:border-green-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200 resize-none"
            rows={5}
            maxLength={1000}
            required
            variants={FADE_UP_ANIMATION_VARIANTS}
            initial={false}
            animate="show"
            exit="exit"
          />

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-red-700 dark:text-red-300 font-medium">
                  {error}
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="px-3 py-1 text-sm font-medium text-orange-500 dark:text-green-400 bg-transparent rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Replying...
                </div>
              ) : (
                <GrowingUnderline className="inline-block">
                  Reply
                </GrowingUnderline>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={FADE_UP_ANIMATION_VARIANTS}
      initial={false}
      animate="show"
      exit="exit"
    >
      <RadiantCard className="p-8 md:p-10">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {user?.picture ? (
                <Image
                  src={user.picture}
                  alt={
                    user.given_name || user.family_name || user.email || 'User'
                  }
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full border-2 border-orange-200 dark:border-green-800"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-green-900 dark:to-green-800 rounded-full flex items-center justify-center border-2 border-orange-300 dark:border-green-700">
                  <span className="text-orange-600 dark:text-green-400 font-bold">
                    {(user?.given_name ||
                      user?.family_name ||
                      user?.email ||
                      'U')[0].toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {user?.given_name ||
                    user?.family_name ||
                    user?.email ||
                    'Anonymous'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Share your thoughts below
                </p>
              </div>
            </div>
            <button
              // The LogoutLink component handles sign out/navigation; render a standard button that wraps LogoutLink
              className="px-4 py-2 text-sm font-medium text-orange-500 dark:text-green-400 hover:underline border border-transparent rounded-lg hover:bg-orange-50 dark:hover:bg-green-900/30 transition-colors"
            >
              <LogoutLink>SignOut</LogoutLink>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="comment"
                className="block text-lg font-semibold text-gray-900 dark:text-white"
              >
                Share your thoughts
              </label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                What are your thoughts on this post?
              </p>
            </div>

            <div className="space-y-3">
              <motion.textarea
                id="comment"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your comment here..."
                className="themed-textarea w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-green-500 focus:border-orange-500 dark:focus:border-green-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200 resize-none"
                rows={5}
                maxLength={1000}
                required
                variants={FADE_UP_ANIMATION_VARIANTS}
                initial={false}
                animate="show"
                exit="exit"
              />
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  {content.length}/1000 characters
                </span>
                <span className="text-gray-400 dark:text-gray-500">
                  Markdown supported
                </span>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-red-700 dark:text-red-300 font-medium">
                    {error}
                  </span>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !content.trim()}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-orange-500 dark:text-green-400 bg-transparent rounded-lg transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Posting...
                  </div>
                ) : (
                  <GrowingUnderline className="inline-block">
                    Post Comment
                  </GrowingUnderline>
                )}
              </button>
            </div>
          </form>
        </div>
      </RadiantCard>
    </motion.div>
  )
}
