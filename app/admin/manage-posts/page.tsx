'use client'

import { AdminNavigation } from '@/components/admin/admin-navigation'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import { LoginLink } from '@kinde-oss/kinde-auth-nextjs/components'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Container } from '~/components/ui/container'
import { GrowingUnderline } from '~/components/ui/growing-underline'
import { PageHeader } from '~/components/ui/page-header'
import { RadiantCard } from '~/components/ui/radiant-card'
import { FADE_UP_ANIMATION_VARIANTS } from '~/lib/animations'

interface Post {
  slug: string
  title: string
  summary: string
  tags: string[]
  draft: boolean
  featured: boolean
  date: string
  images: string[]
}

export default function ManagePostsPage() {
  const { isAuthenticated, isLoading } = useKindeBrowserClient()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthenticated) {
      fetchPosts()
    }
  }, [isAuthenticated])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/posts')
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts || [])
      } else {
        setError('Failed to load posts')
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      setError('Error loading posts')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const response = await fetch(`/api/posts/${slug}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setPosts(posts.filter((post) => post.slug !== slug))
        alert('Post deleted successfully!')
      } else {
        const error = await response.json()
        alert(`Error deleting post: ${error.error}`)
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      alert('Error deleting post')
    }
  }

  if (isLoading)
    return (
      <Container className="pt-4 lg:pt-12 pb-12">
        <div className="text-center" />
      </Container>
    )

  if (!isAuthenticated) {
    return (
      <Container className="pt-4 lg:pt-12 pb-12">
        <div className="text-center">
          <PageHeader
            title="Admin Access Required"
            description="You need to be logged in to access the admin area."
            className="border-b border-gray-200 dark:border-gray-700"
          />
          <div className="mt-8">
            <LoginLink className="inline-block px-8 py-3 accent-bg text-white font-semibold rounded-lg hover:opacity-90 transition-opacity">
              Login to Admin
            </LoginLink>
          </div>
        </div>
      </Container>
    )
  }

  return (
    <Container className="pt-4 lg:pt-12 pb-12">
      <AdminNavigation currentPage="Manage Posts" />

      <PageHeader
        title="Manage Posts"
        description="View, edit, and delete your existing blog posts."
        className="border-b border-gray-200 dark:border-gray-700"
      />

      <div className="py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {posts.length} post{posts.length !== 1 ? 's' : ''} found
          </div>
          <Link
            href="/admin/add-post"
            className="text-base font-semibold underline-offset-4 transition-colors hover:text-gray-900 dark:hover:text-gray-200"
          >
            <GrowingUnderline data-umami-event="add-new-post">
              Add New Post
            </GrowingUnderline>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12" />
        ) : error ? (
          <div className="text-center py-12 text-red-600 dark:text-red-400">
            {error}
          </div>
        ) : posts.length === 0 ? (
          <motion.div
            initial="hidden"
            animate="show"
            variants={FADE_UP_ANIMATION_VARIANTS}
          >
            <RadiantCard className="p-8 text-center">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                No posts yet
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Get started by creating your first blog post.
              </p>
              <Link
                href="/admin/add-post"
                className="inline-block text-lg font-semibold underline-offset-4 transition-colors hover:text-gray-900 dark:hover:text-gray-200"
              >
                <GrowingUnderline data-umami-event="create-first-post">
                  Create Your First Post
                </GrowingUnderline>
              </Link>
            </RadiantCard>
          </motion.div>
        ) : (
          <motion.div
            className="space-y-4"
            initial="hidden"
            animate="show"
            variants={{
              show: {
                transition: {
                  staggerChildren: 0.08,
                },
              },
            }}
          >
            {posts.map((post) => (
              <motion.div key={post.slug} variants={FADE_UP_ANIMATION_VARIANTS}>
                <RadiantCard className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Post Image */}
                    <div className="w-full md:w-48 h-32 flex-shrink-0">
                      <Image
                        width={198}
                        height={128}
                        src={
                          post.images?.[0] || '/static/images/twitter-card.jpeg'
                        }
                        alt={post.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    {/* Post Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                              {post.title}
                            </h3>
                            {post.draft && (
                              <span className="px-2 py-1 text-xs bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-full">
                                Draft
                              </span>
                            )}
                            {post.featured && (
                              <span className="px-2 py-1 text-xs bg-orange-500 text-white dark:bg-green-600 rounded-full">
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                            {post.summary}
                          </p>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags?.slice(0, 5).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {post.tags && post.tags.length > 5 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            +{post.tags.length - 5} more
                          </span>
                        )}
                      </div>

                      {/* Date */}
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                        {new Date(post.date).toLocaleDateString()}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-4 items-center">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-sm font-semibold underline-offset-4 transition-colors text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          <GrowingUnderline data-umami-event="view-post">
                            View
                          </GrowingUnderline>
                        </Link>
                        <span className="text-gray-300 dark:text-gray-600">
                          /
                        </span>
                        <Link
                          href={`/admin/edit-post/${post.slug}`}
                          className="text-sm font-semibold underline-offset-4 transition-colors hover:text-gray-900 dark:hover:text-gray-200"
                        >
                          <GrowingUnderline data-umami-event="edit-post">
                            Edit
                          </GrowingUnderline>
                        </Link>
                        <span className="text-gray-300 dark:text-gray-600">
                          /
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDelete(post.slug)}
                          className="text-sm font-semibold underline-offset-4 transition-colors text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <GrowingUnderline data-umami-event="delete-post">
                            Delete
                          </GrowingUnderline>
                        </button>
                      </div>
                    </div>
                  </div>
                </RadiantCard>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </Container>
  )
}
