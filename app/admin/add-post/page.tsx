'use client'

import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import { LoginLink } from '@kinde-oss/kinde-auth-nextjs/components'
import type { MDXEditorMethods } from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import { useRef, useState } from 'react'
import { ForwardRefEditor } from '~/components/forward-ref-editor'
import { Container } from '~/components/ui/container'
import { PageHeader } from '~/components/ui/page-header'

// MDXEditor dark mode styles - use MDXEditor's public classes and CSS variables
// to reliably set editor text to pure white in dark mode.
const mdxEditorDarkStyles = `
  /* Set MDXEditor semantic color variables for dark mode */
  .dark .mdxeditor {
    --baseText: #ffffff;
    --baseTextContrast: #ffffff;
    --basePageBg: #000000;
    /* toolbar / UI variables */
    --accentBg: #0f1724; /* darker toolbar background */
    --accentBgHover: #0b1220;
    --accentLine: rgba(255,255,255,0.04);
    --accentText: #e6e6e6;
    --baseBg: #0b0b0b; /* editor background */
    --baseSolid: #0f1724;
    --baseBorder: rgba(255,255,255,0.03);
    color: var(--baseText);
  }

  /* Target the contentEditable root and rich text root to ensure text is white */
  .dark .mdxeditor-root-contenteditable,
  .dark .mdxeditor-rich-text-editor,
  .dark .mdxeditor-source-editor,
  .dark .mdxeditor-diff-editor {
    color: #ffffff !important;
  }

  /* Make rich text, diff and source editor roots have dark backgrounds */
  .dark .mdxeditor-rich-text-editor,
  .dark .mdxeditor-diff-editor,
  .dark .mdxeditor-source-editor {
    background: var(--baseBg) !important;
    color: #ffffff !important;
  }

  /* CodeMirror / source editor specifics (source/diff modes) */
  .dark .cm-editor,
  .dark .cm-content,
  .dark .cm-line {
    background: var(--baseBg) !important;
    color: #ffffff !important;
  }

  /* Ensure diff view wrappers match dark theme */
  .dark .mdxeditor-diff-editor .mdxeditor-diff-source-wrapper,
  .dark .mdxeditor-diff-editor .mdxeditor-diff-editor {
    background: var(--baseBg) !important;
    color: #ffffff !important;
  }

  /* Make sure nested spans and lines inherit the white color */
  .dark .mdxeditor-root-contenteditable *,
  .dark .mdxeditor-rich-text-editor * {
    color: #ffffff !important;
  }

  /* Also ensure plain textareas on the page are white in dark mode */
  .dark textarea,
  .dark textarea:focus {
    color: #ffffff !important;
  }

  /* Make the toolbar dark background with readable icons/text */
  .dark .mdxeditor-toolbar {
    background: var(--accentBg) !important;
    color: #e6e6e6 !important;
    border-bottom: 1px solid rgba(255,255,255,0.04) !important;
  }

  .dark .mdxeditor-toolbar button,
  .dark .mdxeditor-toolbar [role="button"] {
    color: var(--accentText) !important;
    background: transparent !important;
  }

  .dark .mdxeditor-toolbar button:hover,
  .dark .mdxeditor-toolbar [role="button"]:hover {
    background: rgba(255,255,255,0.03) !important;
  }

  /* Force SVG icon fills/strokes inside toolbar to light color */
  .dark .mdxeditor-toolbar svg {
    fill: var(--accentText) !important;
    stroke: var(--accentText) !important;
  }

  /* Placeholder styling */
  .dark ::placeholder,
  .dark ::-webkit-input-placeholder,
  .dark ::-moz-placeholder {
    color: #ffffff !important;
    opacity: 0.9;
  }
`

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
  const editorRef = useRef<MDXEditorMethods>(null)

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

  const handleSave = async () => {
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
        editorRef.current?.setMarkdown('')
      } else {
        const error = await response.json()
        alert(`Error saving post: ${error.error}`)
      }
    } catch (error) {
      alert(`Error saving post: ${error.message}`)
    }
    setSaving(false)
  }

  return (
    <Container className="pt-4 lg:pt-12 pb-12">
      <style dangerouslySetInnerHTML={{ __html: mdxEditorDarkStyles }} />
      <PageHeader
        title="Add New Post"
        description="Create a new blog post with the full MDX editor and comprehensive metadata."
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
            {saving ? 'Saving...' : 'Save Post'}
          </button>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-8 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </Container>
  )
}
