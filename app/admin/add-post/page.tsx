'use client'

import { AdminNavigation } from '@/components/admin/admin-navigation'
import { PostPreviewModal } from '@/components/admin/post-preview-modal'
import { LazyNovelEditor } from '@/components/lazy/lazy-novel-editor'
import { LoginLink, useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import dynamic from 'next/dynamic'
import { useCallback, useState } from 'react'
import { Container } from '~/components/ui/container'
import { GrowingUnderline } from '~/components/ui/growing-underline'
import { PageHeader } from '~/components/ui/page-header'
import { FADE_UP_ANIMATION_VARIANTS } from '~/lib/animations'

const motion = {
  div: dynamic(() => import('framer-motion').then((mod) => mod.motion.div), {
    ssr: false,
  }),
}

export default function AddPostPage() {
  const { isAuthenticated, isLoading } = useKindeBrowserClient()
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [tags, setTags] = useState('')
  const [categories, setCategories] = useState('')
  const [images, setImages] = useState('')
  const [canonicalUrl, setCanonicalUrl] = useState('')
  const [layout, setLayout] = useState('')
  const [bibliography, setBibliography] = useState('')
  const [draft, setDraft] = useState(false)
  const [featured, setFeatured] = useState(false)
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = useCallback(async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/save-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          summary,
          tags: tags.split(',').map((t) => t.trim()),
          categories: categories.split(',').map((c) => c.trim()),
          images: images
            .split(',')
            .map((i) => i.trim())
            .filter((i) => i),
          canonicalUrl: canonicalUrl || null,
          layout: layout || null,
          bibliography: bibliography || null,
          draft,
          featured,
          content,
        }),
      })

      if (response.ok) {
        alert('Post saved successfully!')
        setTitle('')
        setSummary('')
        setTags('')
        setCategories('')
        setImages('')
        setCanonicalUrl('')
        setLayout('')
        setBibliography('')
        setDraft(false)
        setFeatured(false)
        setContent('')
      } else {
        const error = await response.json()
        alert(`Error saving post: ${error.error}`)
      }
    } catch (error) {
      alert(
        `Error saving post: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
    setSaving(false)
  }, [
    title,
    summary,
    tags,
    categories,
    images,
    canonicalUrl,
    layout,
    bibliography,
    draft,
    featured,
    content,
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

  return (
    <Container className="pt-4 lg:pt-12 pb-12">
      <AdminNavigation currentPage="Add New Post" />

      <PageHeader
        title="Add New Post"
        description="Create a new blog post with the full editor and comprehensive metadata."
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
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={FADE_UP_ANIMATION_VARIANTS}
        >
          <div>
            <label htmlFor="title" className="themed-label">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="themed-input"
              placeholder="Enter post title"
            />
          </div>

          <div>
            <label htmlFor="tags" className="themed-label">
              Tags (comma-separated)
            </label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="themed-input"
              placeholder="javascript, react, tutorial"
            />
          </div>
        </motion.div>
        <motion.div variants={FADE_UP_ANIMATION_VARIANTS}>
          <label htmlFor="summary" className="themed-label">
            Summary
          </label>
          <textarea
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="themed-textarea"
            rows={3}
            placeholder="Brief summary of the post"
          />
        </motion.div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={FADE_UP_ANIMATION_VARIANTS}
        >
          <div>
            <label htmlFor="categories" className="themed-label">
              Categories (comma-separated)
            </label>
            <input
              id="categories"
              type="text"
              value={categories}
              onChange={(e) => setCategories(e.target.value)}
              className="themed-input"
              placeholder="web-development, tutorials"
            />
          </div>

          <div>
            <label htmlFor="images" className="themed-label">
              Images (comma-separated URLs)
            </label>
            <input
              id="images"
              type="text"
              value={images}
              onChange={(e) => setImages(e.target.value)}
              className="themed-input"
              placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
            />
          </div>
        </motion.div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={FADE_UP_ANIMATION_VARIANTS}
        >
          <div>
            <label htmlFor="canonicalUrl" className="themed-label">
              Canonical URL (optional)
            </label>
            <input
              id="canonicalUrl"
              type="url"
              value={canonicalUrl}
              onChange={(e) => setCanonicalUrl(e.target.value)}
              className="themed-input"
              placeholder="https://example.com/canonical-post"
            />
          </div>

          <div>
            <label htmlFor="layout" className="themed-label">
              Layout (optional)
            </label>
            <input
              id="layout"
              type="text"
              value={layout}
              onChange={(e) => setLayout(e.target.value)}
              className="themed-input"
              placeholder="post-layout"
            />
          </div>

          <div>
            <label htmlFor="bibliography" className="themed-label">
              Bibliography (optional)
            </label>
            <input
              id="bibliography"
              type="text"
              value={bibliography}
              onChange={(e) => setBibliography(e.target.value)}
              className="themed-input"
              placeholder="Bibliography content..."
            />
          </div>
        </motion.div>
        <motion.div
          className="flex gap-6"
          variants={FADE_UP_ANIMATION_VARIANTS}
        >
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={draft}
              onChange={(e) => setDraft(e.target.checked)}
              className="themed-checkbox"
            />
            <span className="themed-label mb-0">Save as Draft</span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="themed-checkbox"
            />
            <span className="themed-label mb-0">Featured Post</span>
          </label>
        </motion.div>{' '}
        <motion.div variants={FADE_UP_ANIMATION_VARIANTS}>
          <label className="themed-label">Content</label>
          <div>
            <LazyNovelEditor markdown={content} onChange={setContent} />
          </div>
        </motion.div>
        <motion.div
          className="flex flex-col sm:flex-row gap-3 sm:gap-6 pt-6 sm:items-center"
          variants={FADE_UP_ANIMATION_VARIANTS}
        >
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !title.trim() || !content.trim()}
            className="text-base sm:text-lg font-semibold underline-offset-4 transition-colors hover:text-gray-900 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-current text-left"
          >
            <GrowingUnderline data-umami-event="save-post">
              {saving ? 'Saving...' : 'Save Post'}
            </GrowingUnderline>
          </button>
          <span className="hidden sm:inline text-gray-300 dark:text-gray-600">
            /
          </span>
          <PostPreviewModal
            title={title}
            summary={summary}
            content={content}
            tags={tags}
            images={images}
          />
          <span className="hidden sm:inline text-gray-300 dark:text-gray-600">
            /
          </span>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="text-base sm:text-lg font-semibold underline-offset-4 transition-colors text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 text-left"
          >
            <GrowingUnderline data-umami-event="cancel-add-post">
              Cancel
            </GrowingUnderline>
          </button>
        </motion.div>
      </motion.div>
    </Container>
  )
}
