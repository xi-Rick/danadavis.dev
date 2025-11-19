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

interface Project {
  id: string
  type: 'work' | 'self'
  title: string
  slug: string
  description?: string
  imgSrc: string
  url?: string
  repo?: string
  builtWith: string[]
  links?: { title: string; url: string }[]
  content?: string
  draft: boolean
  featured: boolean
}

export default function ManageProjectsPage() {
  const { isAuthenticated, isLoading } = useKindeBrowserClient()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects()
    }
  }, [isAuthenticated])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/projects')
      if (response.ok) {
        const data = await response.json()
        setProjects(data.projects || [])
      } else {
        setError('Failed to load projects')
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      setError('Error loading projects')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      const response = await fetch(`/api/projects/${slug}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setProjects(projects.filter((project) => project.slug !== slug))
        alert('Project deleted successfully!')
      } else {
        const error = await response.json()
        alert(`Error deleting project: ${error.error}`)
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      alert('Error deleting project')
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
      <AdminNavigation currentPage="Manage Projects" />

      <PageHeader
        title="Manage Projects"
        description="View and edit your portfolio projects."
        className="border-b border-gray-200 dark:border-gray-700"
      />

      <div className="py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {projects.length} project{projects.length !== 1 ? 's' : ''} found
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12" />
        ) : error ? (
          <div className="text-center py-12 text-red-600 dark:text-red-400">
            {error}
          </div>
        ) : projects.length === 0 ? (
          <motion.div
            initial="hidden"
            animate="show"
            variants={FADE_UP_ANIMATION_VARIANTS}
          >
            <RadiantCard className="p-8 text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                No projects yet
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Add your first project to showcase your work.
              </p>
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
            {projects.map((project) => (
              <motion.div
                key={project.slug}
                variants={FADE_UP_ANIMATION_VARIANTS}
              >
                <RadiantCard className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Project Image */}
                    <div className="w-full md:w-48 h-32 flex-shrink-0">
                      <Image
                        width={198}
                        height={128}
                        src={project.imgSrc}
                        alt={project.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    {/* Project Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                              {project.title}
                            </h3>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                project.type === 'work'
                                  ? 'bg-orange-500 text-white dark:bg-green-600'
                                  : 'bg-orange-100 text-orange-800 dark:bg-green-900 dark:text-green-200'
                              }`}
                            >
                              {project.type === 'work' ? 'Work' : 'Personal'}
                            </span>
                            {project.draft && (
                              <span className="px-2 py-1 text-xs bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-full">
                                Draft
                              </span>
                            )}
                            {project.featured && (
                              <span className="px-2 py-1 text-xs bg-orange-500 text-white dark:bg-green-600 rounded-full">
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                            {project.description}
                          </p>
                        </div>
                      </div>

                      {/* Built With Tags */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.builtWith?.slice(0, 5).map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 rounded"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.builtWith && project.builtWith.length > 5 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            +{project.builtWith.length - 5} more
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-4 items-center">
                        {project.links &&
                          project.links.length > 0 &&
                          project.links[0].url && (
                            <>
                              <a
                                href={project.links[0].url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-semibold underline-offset-4 transition-colors text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                              >
                                <GrowingUnderline data-umami-event="view-project-demo">
                                  View Demo
                                </GrowingUnderline>
                              </a>
                              <span className="text-gray-300 dark:text-gray-600">
                                /
                              </span>
                            </>
                          )}
                        {project.repo && (
                          <>
                            <a
                              href={project.repo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-semibold underline-offset-4 transition-colors text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                              <GrowingUnderline data-umami-event="view-project-repo">
                                View Repo
                              </GrowingUnderline>
                            </a>
                            <span className="text-gray-300 dark:text-gray-600">
                              /
                            </span>
                          </>
                        )}
                        <Link
                          href={`/admin/edit-project/${project.slug}`}
                          className="text-sm font-semibold underline-offset-4 transition-colors hover:text-gray-900 dark:hover:text-gray-200"
                        >
                          <GrowingUnderline data-umami-event="edit-project">
                            Edit
                          </GrowingUnderline>
                        </Link>
                        <span className="text-gray-300 dark:text-gray-600">
                          /
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDelete(project.slug)}
                          className="text-sm font-semibold underline-offset-4 transition-colors text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <GrowingUnderline data-umami-event="delete-project">
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
