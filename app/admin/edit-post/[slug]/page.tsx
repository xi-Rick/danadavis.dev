'use client'

import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import { LoginLink } from '@kinde-oss/kinde-auth-nextjs/components'
import type { MDXEditorMethods } from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { ForwardRefEditor } from '~/components/forward-ref-editor'
import { Container } from '~/components/ui/container'
import { PageHeader } from '~/components/ui/page-header'

// MDXEditor dark mode styles - only for text content
const mdxEditorDarkStyles = `
  .dark .mdxeditor-wrapper .cm-editor {
    color: var(--color-text);
  }

  .dark .mdxeditor-wrapper .cm-content {
    color: var(--color-text);
  }

  .dark .mdxeditor-wrapper .cm-line {
    color: var(--color-text);
  }
`

interface EditPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const { isAuthenticated, isLoading } = useKindeBrowserClient()
  const router = useRouter()
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
  const [loading, setLoading] = useState(true)
  const editorRef = useRef<MDXEditorMethods>(null)

  const { slug } = React.use(params)

  useEffect(() => {
    if (!slug) {
      router.push('/admin')
      return
    }

    // Load existing post data
    const loadPost = async () => {
      try {
        const response = await fetch(`/api/posts/${slug}`)
        if (response.ok) {
          const post = await response.json()
          setTitle(post.title || '')
          setSummary(post.summary || '')
          setTags(post.tags?.join(', ') || '')
          setCategories(post.categories?.join(', ') || '')
          setImages(post.images?.join(', ') || '')
          setCanonicalUrl(post.canonicalUrl || '')
          setLayout(post.layout || '')
          setBibliography(post.bibliography || '')
          setDraft(post.draft || false)
          setFeatured(post.featured || false)
          setContent(post.content || '')
        } else {
          alert('Post not found')
          router.push('/admin')
        }
      } catch (error) {
        console.error('Error loading post:', error)
        alert('Error loading post')
        router.push('/admin')
      } finally {
        setLoading(false)
      }
    }

    loadPost()
  }, [slug, router])

  if (isLoading || loading)
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

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/save-post', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug,
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
        alert('Post updated successfully!')
        router.push('/admin')
      } else {
        const error = await response.json()
        alert(`Error updating post: ${error.error}`)
      }
    } catch (error) {
      alert(`Error updating post: ${error.message}`)
    }
    setSaving(false)
  }

  return (
    <Container className="pt-4 lg:pt-12 pb-12">
      <style dangerouslySetInnerHTML={{ __html: mdxEditorDarkStyles }} />
      <PageHeader
        title="Edit Post"
        description={`Editing: ${title || 'Untitled Post'}`}
        className="border-b border-gray-200 dark:border-gray-700"
      />

      <div className="py-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter post title"
            />
          </div>

          <div>
            <label
              htmlFor="tags"
              className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100"
            >
              Tags (comma-separated)
            </label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="javascript, react, tutorial"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="summary"
            className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100"
          >
            Summary
          </label>
          <textarea
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            rows={3}
            placeholder="Brief summary of the post"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="categories"
              className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100"
            >
              Categories (comma-separated)
            </label>
            <input
              id="categories"
              type="text"
              value={categories}
              onChange={(e) => setCategories(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="web-development, tutorials"
            />
          </div>

          <div>
            <label
              htmlFor="images"
              className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100"
            >
              Images (comma-separated URLs)
            </label>
            <input
              id="images"
              type="text"
              value={images}
              onChange={(e) => setImages(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label
              htmlFor="canonicalUrl"
              className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100"
            >
              Canonical URL (optional)
            </label>
            <input
              id="canonicalUrl"
              type="url"
              value={canonicalUrl}
              onChange={(e) => setCanonicalUrl(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="https://example.com/canonical-post"
            />
          </div>

          <div>
            <label
              htmlFor="layout"
              className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100"
            >
              Layout (optional)
            </label>
            <input
              id="layout"
              type="text"
              value={layout}
              onChange={(e) => setLayout(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="post-layout"
            />
          </div>

          <div>
            <label
              htmlFor="bibliography"
              className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100"
            >
              Bibliography (optional)
            </label>
            <input
              id="bibliography"
              type="text"
              value={bibliography}
              onChange={(e) => setBibliography(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Bibliography content..."
            />
          </div>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={draft}
              onChange={(e) => setDraft(e.target.checked)}
              className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 dark:focus:ring-orange-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Draft
            </span>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 dark:focus:ring-orange-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Featured
            </span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
            Content
          </label>
          <ForwardRefEditor
            ref={editorRef}
            markdown={content}
            onChange={setContent}
            className="border border-gray-300 dark:border-gray-600 rounded-lg min-h-[600px] focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-transparent"
          />
        </div>

        <div className="flex gap-4 pt-6">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !title.trim() || !content.trim()}
            className="px-8 py-3 accent-bg text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Updating...' : 'Update Post'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin')}
            className="px-8 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </Container>
  )
}
