'use client'

import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import Link from 'next/link'
import useSWR from 'swr'
import { Container } from '~/components/ui/container'
import { PageHeader } from '~/components/ui/page-header'
import { RadiantCard } from '~/components/ui/radiant-card'
import { fetcher } from '~/utils/misc'

export default function AdminPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isLoading, isAuthenticated: _isAuthenticated } =
    useKindeBrowserClient()

  const { data: postsData, isLoading: postsLoading } = useSWR(
    '/api/posts',
    fetcher,
  )
  const totalPosts = postsData?.posts?.length || 0
  const publishedPosts = postsData?.posts?.filter((p) => !p.draft).length || 0
  const draftPosts = postsData?.posts?.filter((p) => p.draft).length || 0

  if (isLoading) return <div />

  return (
    <Container className="pt-4 lg:pt-12 pb-12">
      <PageHeader
        title="Admin Dashboard"
        description="Manage your blog posts, projects, and site settings from this central control panel."
        className="border-b border-gray-200 dark:border-gray-700"
      />

      {/* Quick Actions */}
      <div className="py-8 md:py-12">
        <h2 className="mb-8 text-2xl font-bold tracking-tight text-gray-900 md:text-3xl dark:text-gray-100">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Create Post */}
          <RadiantCard className="p-6">
            <div className="space-y-4">
              <div className="text-4xl">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Create Post
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Write and publish new blog posts with the full MDX editor.
              </p>
              <Link
                href="/admin/add-post"
                className="inline-block w-full text-center px-4 py-2 accent-bg text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
              >
                Add New Post
              </Link>
            </div>
          </RadiantCard>

          {/* Manage Posts */}
          <RadiantCard className="p-6">
            <div className="space-y-4">
              <div className="text-4xl">📋</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Manage Posts
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                View, edit, and organize your existing blog posts.
              </p>
              <Link
                href="/admin/manage-posts"
                className="inline-block w-full text-center px-4 py-2 accent-bg text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
              >
                Manage Posts
              </Link>
            </div>
          </RadiantCard>

          {/* Analytics */}
          <RadiantCard className="p-6">
            <div className="space-y-4">
              <div className="text-4xl">📊</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Analytics
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                View detailed statistics and performance metrics.
              </p>
              <button
                type="button"
                disabled
                className="w-full px-4 py-2 bg-gray-400 text-white font-semibold rounded-lg cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>
          </RadiantCard>

          {/* Projects */}
          <RadiantCard className="p-6">
            <div className="space-y-4">
              <div className="text-4xl">🚀</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Projects
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Manage and showcase your projects portfolio.
              </p>
              <button
                type="button"
                disabled
                className="w-full px-4 py-2 bg-gray-400 text-white font-semibold rounded-lg cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>
          </RadiantCard>

          {/* Settings */}
          <RadiantCard className="p-6">
            <div className="space-y-4">
              <div className="text-4xl">⚙️</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Settings
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Configure blog settings and preferences.
              </p>
              <button
                type="button"
                disabled
                className="w-full px-4 py-2 bg-gray-400 text-white font-semibold rounded-lg cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>
          </RadiantCard>

          {/* Back to Blog */}
          <RadiantCard className="p-6">
            <div className="space-y-4">
              <div className="text-4xl">📖</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                View Blog
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Return to the public blog to see your posts.
              </p>
              <Link
                href="/blog"
                className="inline-block w-full text-center px-4 py-2 accent-green-bg text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
              >
                View Blog
              </Link>
            </div>
          </RadiantCard>
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-t border-gray-200 py-8 md:py-12 dark:border-gray-700">
        <h2 className="mb-8 text-2xl font-bold tracking-tight text-gray-900 md:text-3xl dark:text-gray-100">
          Blog Statistics
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <RadiantCard className="p-6 text-center">
            <div className="text-4xl font-bold accent mb-2">
              {postsLoading ? '--' : totalPosts}
            </div>
            <div className="text-gray-600 dark:text-gray-300 font-medium">
              Total Posts
            </div>
          </RadiantCard>
          <RadiantCard className="p-6 text-center">
            <div className="text-4xl font-bold accent-green mb-2">
              {postsLoading ? '--' : publishedPosts}
            </div>
            <div className="text-gray-600 dark:text-gray-300 font-medium">
              Published Posts
            </div>
          </RadiantCard>
          <RadiantCard className="p-6 text-center">
            <div className="text-4xl font-bold text-orange-500 mb-2">
              {postsLoading ? '--' : draftPosts}
            </div>
            <div className="text-gray-600 dark:text-gray-300 font-medium">
              Draft Posts
            </div>
          </RadiantCard>
        </div>
      </div>
    </Container>
  )
}
