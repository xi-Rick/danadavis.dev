'use client'

import { AdminNavigation } from '@/components/admin/admin-navigation'
import NovelEditor from '@/components/novel-editor'
import { LoginLink, useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import TurndownService from 'turndown'
import { Badge } from '~/components/ui/badge'
import { Container } from '~/components/ui/container'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { GrowingUnderline } from '~/components/ui/growing-underline'
import { PageHeader } from '~/components/ui/page-header'
import { RadiantCard } from '~/components/ui/radiant-card'
import { FADE_UP_ANIMATION_VARIANTS } from '~/lib/animations'

export default function EditProjectPage() {
  const { isAuthenticated, isLoading } = useKindeBrowserClient()
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [loading, setLoading] = useState(true)
  const [type, setType] = useState<'work' | 'self'>('self')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imgSrc, setImgSrc] = useState('')
  const [repo, setRepo] = useState('')
  const [builtWith, setBuiltWith] = useState('')
  const [demoUrl, setDemoUrl] = useState('')
  const [content, setContent] = useState('')
  const [draft, setDraft] = useState(false)
  const [featured, setFeatured] = useState(false)
  const [saving, setSaving] = useState(false)
  const [projectNotFound, setProjectNotFound] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isPreviewLoading, setIsPreviewLoading] = useState(false)
  const [previewHtml, setPreviewHtml] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isAuthenticated && slug) {
      fetchProject()
    }
  }, [isAuthenticated, slug])

  const fetchProject = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/projects/${slug}`)
      if (response.ok) {
        const project = await response.json()
        console.log('📦 Fetched project:', {
          title: project.title,
          contentLength: project.content?.length,
          contentPreview: project.content?.substring(0, 100),
        })

        // Convert HTML content to Markdown for the editor
        let editorContent = project.content || ''
        if (editorContent?.trim().startsWith('<')) {
          // Content is HTML, convert to Markdown
          const turndownService = new TurndownService({
            headingStyle: 'atx',
            codeBlockStyle: 'fenced',
          })
          editorContent = turndownService.turndown(editorContent)
          console.log('🔄 Converted HTML to Markdown:', {
            markdownLength: editorContent.length,
            markdownPreview: editorContent.substring(0, 100),
          })
        }

        setType(project.type)
        setTitle(project.title)
        setDescription(project.description || '')
        setImgSrc(project.imgSrc)
        setRepo(project.repo || '')
        setBuiltWith(project.builtWith.join(', '))
        setDemoUrl(project.links?.[0]?.url || project.url || '')
        setContent(editorContent)
        setDraft(project.draft)
        setFeatured(project.featured)
      } else {
        setProjectNotFound(true)
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      setProjectNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  const handlePreview = async () => {
    setIsPreviewLoading(true)
    setIsPreviewOpen(true)

    try {
      // Convert markdown to HTML
      const response = await fetch('/api/mdx/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      })

      if (response.ok) {
        const { html } = await response.json()
        setPreviewHtml(html)
      } else {
        setPreviewHtml(
          '<div class="text-red-500">Error rendering preview. Check your markdown syntax.</div>',
        )
      }
    } catch (error) {
      console.error('Preview error:', error)
      setPreviewHtml(
        '<div class="text-red-500">Failed to load preview. Please try again.</div>',
      )
    } finally {
      setIsPreviewLoading(false)
    }
  }

  // Reset scroll position when modal opens
  useEffect(() => {
    if (isPreviewOpen && scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
  }, [isPreviewOpen])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPreviewOpen) {
        setIsPreviewOpen(false)
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isPreviewOpen])

  const handleSave = useCallback(async () => {
    setSaving(true)
    try {
      const links = demoUrl ? [{ title: 'Demo', url: demoUrl }] : undefined

      const response = await fetch(`/api/projects/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          title,
          description,
          imgSrc,
          url: demoUrl,
          repo,
          builtWith: builtWith
            .split(',')
            .map((t) => t.trim())
            .filter((t) => t),
          links,
          content,
          draft,
          featured,
        }),
      })

      if (response.ok) {
        alert('Project updated successfully!')
        router.push('/admin/manage-projects')
      } else {
        const error = await response.json()
        alert(`Error updating project: ${error.error}`)
      }
    } catch (error) {
      alert(
        `Error updating project: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
    setSaving(false)
  }, [
    type,
    title,
    description,
    imgSrc,
    repo,
    builtWith,
    demoUrl,
    content,
    draft,
    featured,
    slug,
    router,
  ])

  if (isLoading)
    return (
      <Container className="pt-4 lg:pt-12">
        <div className="text-center" />
      </Container>
    )

  if (!isAuthenticated) {
    return (
      <Container className="pt-4 lg:pt-12">
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

  if (loading) {
    return (
      <Container className="pt-4 lg:pt-12">
        <div className="text-center py-12" />
      </Container>
    )
  }

  if (projectNotFound) {
    return (
      <Container className="pt-4 lg:pt-12 pb-12">
        <PageHeader
          title="Project Not Found"
          description="The project you're looking for doesn't exist."
          className="border-b border-gray-200 dark:border-gray-700"
        />
        <div className="py-8 text-center">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-base font-semibold underline-offset-4 transition-colors hover:text-gray-900 dark:hover:text-gray-200"
          >
            <GrowingUnderline>Go Back</GrowingUnderline>
          </button>
        </div>
      </Container>
    )
  }

  return (
    <Container className="pt-4 lg:pt-12 pb-12">
      <AdminNavigation currentPage="Edit Project" />

      <PageHeader
        title={`Edit Project: ${title}`}
        description="Update project information and content."
        className="border-b border-gray-200 dark:border-gray-700"
      />

      <motion.div
        className="py-8 space-y-6"
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
        <motion.div variants={FADE_UP_ANIMATION_VARIANTS}>
          <RadiantCard>
            <div className="p-6">
              <label htmlFor="type" className="themed-label">
                Project Type
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value as 'work' | 'self')}
                className="themed-input"
              >
                <option value="self">Personal</option>
                <option value="work">Work</option>
              </select>
            </div>
          </RadiantCard>
        </motion.div>

        <motion.div variants={FADE_UP_ANIMATION_VARIANTS}>
          <RadiantCard>
            <div className="p-6">
              <label htmlFor="title" className="themed-label">
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="themed-input"
                placeholder="Enter project title"
              />
            </div>
          </RadiantCard>
        </motion.div>

        <motion.div variants={FADE_UP_ANIMATION_VARIANTS}>
          <RadiantCard>
            <div className="p-6">
              <label htmlFor="description" className="themed-label">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="themed-textarea"
                rows={3}
                placeholder="Brief description of the project"
              />
            </div>
          </RadiantCard>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={FADE_UP_ANIMATION_VARIANTS}
        >
          <RadiantCard>
            <div className="p-6">
              <label htmlFor="imgSrc" className="themed-label">
                Image URL
              </label>
              <input
                id="imgSrc"
                type="url"
                value={imgSrc}
                onChange={(e) => setImgSrc(e.target.value)}
                className="themed-input"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </RadiantCard>

          <RadiantCard>
            <div className="p-6">
              <label htmlFor="repo" className="themed-label">
                Repository URL
              </label>
              <input
                id="repo"
                type="url"
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                className="themed-input"
                placeholder="https://github.com/username/repo"
              />
            </div>
          </RadiantCard>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={FADE_UP_ANIMATION_VARIANTS}
        >
          <RadiantCard>
            <div className="p-6">
              <label htmlFor="demoUrl" className="themed-label">
                Demo URL (optional)
              </label>
              <input
                id="demoUrl"
                type="url"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                className="themed-input"
                placeholder="https://demo.example.com"
              />
            </div>
          </RadiantCard>

          <RadiantCard>
            <div className="p-6">
              <label htmlFor="builtWith" className="themed-label">
                Built With (comma-separated)
              </label>
              <input
                id="builtWith"
                type="text"
                value={builtWith}
                onChange={(e) => setBuiltWith(e.target.value)}
                className="themed-input"
                placeholder="Next.js, TypeScript, Tailwind CSS"
              />
            </div>
          </RadiantCard>
        </motion.div>

        <motion.div
          className="flex gap-6"
          variants={FADE_UP_ANIMATION_VARIANTS}
        >
          <RadiantCard>
            <div className="p-6">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={draft}
                  onChange={(e) => setDraft(e.target.checked)}
                  className="themed-checkbox"
                />
                <span className="themed-label mb-0">Save as Draft</span>
              </label>
            </div>
          </RadiantCard>

          <RadiantCard>
            <div className="p-6">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="themed-checkbox"
                />
                <span className="themed-label mb-0">Featured Project</span>
              </label>
            </div>
          </RadiantCard>
        </motion.div>

        <motion.div variants={FADE_UP_ANIMATION_VARIANTS}>
          <RadiantCard>
            <div className="p-6">
              <label className="themed-label">Content (HTML/MDX)</label>
              <div>
                <NovelEditor markdown={content} onChange={setContent} />
              </div>
            </div>
          </RadiantCard>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-3 sm:gap-6 pt-6 sm:items-center"
          variants={FADE_UP_ANIMATION_VARIANTS}
        >
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !title.trim()}
            className="text-base sm:text-lg font-semibold underline-offset-4 transition-colors hover:text-gray-900 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-current text-left"
          >
            <GrowingUnderline data-umami-event="save-project">
              {saving ? 'Saving...' : 'Save Project'}
            </GrowingUnderline>
          </button>
          <span className="hidden sm:inline text-gray-300 dark:text-gray-600">
            /
          </span>
          <button
            type="button"
            onClick={handlePreview}
            className="text-base sm:text-lg font-semibold underline-offset-4 transition-colors hover:text-gray-900 dark:hover:text-gray-200 text-left"
          >
            <GrowingUnderline data-umami-event="preview-project">
              Preview Project
            </GrowingUnderline>
          </button>
          <span className="hidden sm:inline text-gray-300 dark:text-gray-600">
            /
          </span>
          <button
            type="button"
            onClick={() => router.back()}
            className="text-base sm:text-lg font-semibold underline-offset-4 transition-colors text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 text-left"
          >
            <GrowingUnderline data-umami-event="cancel-edit-project">
              Back to Projects
            </GrowingUnderline>
          </button>
        </motion.div>
      </motion.div>

      {/* Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent
          className="!w-[96vw] sm:!w-[92vw] lg:!w-[88vw] xl:!w-[85vw] !max-w-[1400px] h-[94vh] sm:h-[90vh] max-h-[900px] overflow-hidden p-0 bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-700 [&>button]:text-gray-900 [&>button]:dark:text-gray-100 [&>button]:hover:bg-gray-100 [&>button]:dark:hover:bg-gray-800 [&>button]:top-3 [&>button]:right-3 [&>button]:sm:top-4 [&>button]:sm:right-4 [&>button]:z-20"
          aria-describedby="preview-description"
        >
          <DialogHeader className="px-3 sm:px-4 lg:px-6 pt-3 sm:pt-4 lg:pt-6 pb-2 sm:pb-3 lg:pb-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-black sticky top-0 z-10">
            <div>
              <DialogTitle className="text-base normal-case sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-gray-100">
                Live Project Preview
              </DialogTitle>
              <p
                id="preview-description"
                className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1"
              >
                Press ESC or click the X button to close
              </p>
            </div>
          </DialogHeader>

          <section
            ref={scrollRef}
            className="overflow-y-auto h-[calc(100%-3.5rem)] sm:h-[calc(100%-4.5rem)] lg:h-[calc(100%-5.5rem)] bg-white dark:bg-black"
            aria-label="Project preview content"
          >
            <AnimatePresence mode="wait">
              {isPreviewLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center h-full"
                >
                  <div className="flex flex-col items-center gap-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: 'linear',
                      }}
                      className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full"
                    />
                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                      Rendering preview...
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="pb-6 sm:pb-8 lg:pb-12 px-2 sm:px-3 md:px-4 lg:px-6 pt-2 sm:pt-3 lg:pt-6"
                >
                  <article className="pt-2 sm:pt-3 lg:pt-4 w-full">
                    <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                      {/* Project Type Badge */}
                      <div className="inline-flex items-center px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full border border-gray-200 dark:border-gray-700 capitalize">
                        {type === 'work' ? 'Work Project' : 'Side Project'}
                      </div>

                      {/* Title */}
                      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                        {title || 'Untitled Project'}
                      </h1>

                      {/* Description */}
                      {description && (
                        <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300">
                          {description}
                        </p>
                      )}

                      {/* Project Image */}
                      {imgSrc && (
                        <div className="relative w-full aspect-video overflow-hidden rounded-md sm:rounded-lg border border-gray-200 dark:border-gray-700 mt-4">
                          <Image
                            src={imgSrc}
                            alt={title || 'Project image'}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              e.currentTarget.src =
                                '/static/images/twitter-card.jpeg'
                            }}
                          />
                        </div>
                      )}

                      {/* Tech Stack */}
                      {builtWith && (
                        <div className="pt-2">
                          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                            Built With:
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {builtWith
                              .split(',')
                              .map((tech) => tech.trim())
                              .filter((tech) => tech)
                              .map((tech) => (
                                <Badge
                                  key={tech}
                                  variant="outline"
                                  className="capitalize border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white"
                                >
                                  {tech}
                                </Badge>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Divider */}
                    <div className="mt-4 sm:mt-6 lg:mt-8 mb-4 sm:mb-6 lg:mb-8 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent" />

                    {/* Content */}
                    <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none project-content">
                      {previewHtml ? (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: previewHtml,
                          }}
                        />
                      ) : (
                        <div className="text-gray-500 dark:text-gray-400 text-center py-6 sm:py-8 lg:py-12">
                          No content to preview
                        </div>
                      )}
                    </div>

                    {/* Bottom Divider */}
                    <div className="mt-4 sm:mt-6 lg:mt-8 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent" />

                    {/* Footer Placeholder */}
                    <div className="mt-4 sm:mt-6 lg:mt-8">
                      <div className="p-3 sm:p-4 lg:p-6 bg-gray-100 dark:bg-gray-900 rounded-md sm:rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          Links, comments, and other sections will appear on the
                          live page
                        </p>
                      </div>
                    </div>
                  </article>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </DialogContent>
      </Dialog>
    </Container>
  )
}
