'use client'

import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import { LoginLink } from '@kinde-oss/kinde-auth-nextjs/components'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Container } from '~/components/ui/container'
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
        <div className="text-center">Loading...</div>
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
            className="px-6 py-2 accent-bg text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            Add New Post
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
                className="inline-block px-6 py-3 accent-bg text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
              >
                Create Your First Post
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
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {post.title}
                        </h3>
                        {post.draft && (
                          <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 rounded-full">
                            Draft
                          </span>
                        )}
                        {post.featured && (
                          <span className="px-2 py-1 text-xs accent-green-bg text-white rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-2">
                        {post.summary}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            +{post.tags.length - 3} more
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(post.date).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/edit-post/${post.slug}`}
                        className="px-4 py-2 accent-bg text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(post.slug)}
                        className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
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
