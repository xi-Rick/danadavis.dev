'use client'

import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import Link from 'next/link'
import useSWR from 'swr'
import { Container } from '~/components/ui/container'
import { GrowingUnderline } from '~/components/ui/growing-underline'
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

  const { data: captainsLogData, isLoading: captainsLogLoading } = useSWR(
    '/api/captains-log?showPrivate=true&limit=1000',
    fetcher,
  )
  const totalLogEntries = captainsLogData?.logEntries?.length || 0
  const privateEntries =
    captainsLogData?.logEntries?.filter((e) => e.isPrivate).length || 0
  const blogPotentialEntries =
    captainsLogData?.logEntries?.filter((e) => e.blogPotential).length || 0

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
          <RadiantCard className="p-6 flex flex-col min-h-80">
            <div className="space-y-4 flex flex-col h-full">
              <div className="text-4xl">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Create Post
              </h3>
              <p className="text-gray-600 dark:text-gray-300 flex-grow">
                Write and publish new blog posts with the full MDX editor.
              </p>
              <Link
                href="/admin/add-post"
                className="inline-block w-full text-center text-base font-semibold underline-offset-4 transition-colors hover:text-gray-900 dark:hover:text-gray-200"
              >
                <GrowingUnderline data-umami-event="admin-add-post">
                  Add New Post
                </GrowingUnderline>
              </Link>
            </div>
          </RadiantCard>

          {/* Manage Posts */}
          <RadiantCard className="p-6 flex flex-col min-h-80">
            <div className="space-y-4 flex flex-col h-full">
              <div className="text-4xl">📋</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Manage Posts
              </h3>
              <p className="text-gray-600 dark:text-gray-300 flex-grow">
                View, edit, and organize your existing blog posts.
              </p>
              <Link
                href="/admin/manage-posts"
                className="inline-block w-full text-center text-base font-semibold underline-offset-4 transition-colors hover:text-gray-900 dark:hover:text-gray-200"
              >
                <GrowingUnderline data-umami-event="admin-manage-posts">
                  Manage Posts
                </GrowingUnderline>
              </Link>
            </div>
          </RadiantCard>

          {/* Captain's Log */}
          <RadiantCard className="p-6 flex flex-col min-h-80">
            <div className="space-y-4 flex flex-col h-full">
              <div className="text-4xl">🎙️</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Captain&apos;s Log
              </h3>
              <p className="text-gray-600 dark:text-gray-300 flex-grow">
                Voice-to-text notes with AI analysis for blog and project ideas.
              </p>
              <Link
                href="/admin/captains-log"
                className="inline-block w-full text-center text-base font-semibold underline-offset-4 transition-colors hover:text-gray-900 dark:hover:text-gray-200"
              >
                <GrowingUnderline data-umami-event="admin-captains-log">
                  Open Captain&apos;s Log
                </GrowingUnderline>
              </Link>
            </div>
          </RadiantCard>

          {/* Projects */}
          <RadiantCard className="p-6 flex flex-col min-h-80">
            <div className="space-y-4 flex flex-col h-full">
              <div className="text-4xl">🚀</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Projects
              </h3>
              <p className="text-gray-600 dark:text-gray-300 flex-grow">
                Manage and showcase your projects portfolio.
              </p>
              <Link
                href="/admin/manage-projects"
                className="inline-block w-full text-center text-base font-semibold underline-offset-4 transition-colors hover:text-gray-900 dark:hover:text-gray-200"
              >
                <GrowingUnderline data-umami-event="admin-manage-projects">
                  Manage Projects
                </GrowingUnderline>
              </Link>
            </div>
          </RadiantCard>

          {/* Site Settings */}
          <RadiantCard className="p-6 flex flex-col min-h-80">
            <div className="space-y-4 flex flex-col h-full">
              <div className="text-4xl">⚙️</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Site Settings
              </h3>
              <p className="text-gray-600 dark:text-gray-300 flex-grow">
                Configure site metadata, social links, and favicon.
              </p>
              <Link
                href="/admin/site-settings"
                className="inline-block w-full text-center text-base font-semibold underline-offset-4 transition-colors hover:text-gray-900 dark:hover:text-gray-200"
              >
                <GrowingUnderline data-umami-event="admin-site-settings">
                  Manage Settings
                </GrowingUnderline>
              </Link>
            </div>
          </RadiantCard>

          {/* Back to Blog */}
          <RadiantCard className="p-6 flex flex-col min-h-80">
            <div className="space-y-4 flex flex-col h-full">
              <div className="text-4xl">📖</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                View Blog
              </h3>
              <p className="text-gray-600 dark:text-gray-300 flex-grow">
                Return to the public blog to see your posts.
              </p>
              <Link
                href="/blog"
                className="inline-block w-full text-center text-base font-semibold underline-offset-4 transition-colors hover:text-gray-900 dark:hover:text-gray-200"
              >
                <GrowingUnderline data-umami-event="admin-view-blog">
                  View Blog
                </GrowingUnderline>
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
          <RadiantCard className="p-6 text-center flex flex-col min-h-48 justify-center">
            <div className="text-4xl font-bold accent mb-2">
              {postsLoading ? '--' : totalPosts}
            </div>
            <div className="text-gray-600 dark:text-gray-300 font-medium">
              Total Posts
            </div>
          </RadiantCard>
          <RadiantCard className="p-6 text-center flex flex-col min-h-48 justify-center">
            <div className="text-4xl font-bold accent-green mb-2">
              {postsLoading ? '--' : publishedPosts}
            </div>
            <div className="text-gray-600 dark:text-gray-300 font-medium">
              Published Posts
            </div>
          </RadiantCard>
          <RadiantCard className="p-6 text-center flex flex-col min-h-48 justify-center">
            <div className="text-4xl font-bold text-orange-500 mb-2">
              {postsLoading ? '--' : draftPosts}
            </div>
            <div className="text-gray-600 dark:text-gray-300 font-medium">
              Draft Posts
            </div>
          </RadiantCard>
        </div>
      </div>

      {/* Captain's Log Stats Section */}
      <div className="border-t border-gray-200 py-8 md:py-12 dark:border-gray-700">
        <h2 className="mb-8 text-2xl font-bold tracking-tight text-gray-900 md:text-3xl dark:text-gray-100">
          Captain&apos;s Log Statistics
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <RadiantCard className="p-6 text-center flex flex-col min-h-48 justify-center">
            <div className="text-4xl font-bold accent mb-2">
              {captainsLogLoading ? '--' : totalLogEntries}
            </div>
            <div className="text-gray-600 dark:text-gray-300 font-medium">
              Total Entries
            </div>
          </RadiantCard>
          <RadiantCard className="p-6 text-center flex flex-col min-h-48 justify-center">
            <div className="text-4xl font-bold accent-green mb-2">
              {captainsLogLoading ? '--' : privateEntries}
            </div>
            <div className="text-gray-600 dark:text-gray-300 font-medium">
              Private Entries
            </div>
          </RadiantCard>
          <RadiantCard className="p-6 text-center flex flex-col min-h-48 justify-center">
            <div className="text-4xl font-bold text-orange-500 mb-2">
              {captainsLogLoading ? '--' : blogPotentialEntries}
            </div>
            <div className="text-gray-600 dark:text-gray-300 font-medium">
              Blog Potential
            </div>
          </RadiantCard>
        </div>
      </div>
    </Container>
  )
}
