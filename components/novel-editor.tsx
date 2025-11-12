'use client'

import {
  applyDragHandleConstraints,
  setupDragHandlePositioning,
} from '@/lib/drag-handle-positioning'
import { markdownToJSON } from '@/lib/markdown-to-json'
import { editorExtensions, suggestionItemsArr } from '@/lib/novel-extensions'
import {
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  type EditorInstance,
  EditorRoot,
  type JSONContent,
  handleCommandNavigation,
} from 'novel'
import { useEffect, useState } from 'react'

interface NovelEditorProps {
  markdown?: string
  onChange?: (content: string) => void
  className?: string
  placeholder?: string
  editable?: boolean
}

/**
 * Basic Novel.sh Editor Wrapper with Enhanced Image Support
 * Properly converts between Markdown and JSONContent formats
 * A drop-in replacement for MDX Editor using the correct Novel.sh API
 */
export default function NovelEditor({
  markdown = '',
  onChange,
  className = '',
  placeholder = 'Start writing or type "/" for commands...',
  editable = true,
}: NovelEditorProps) {
  const [initialContent, setInitialContent] = useState<JSONContent | undefined>(
    undefined,
  )
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    try {
      setError(null)

      // Default empty content
      const defaultContent: JSONContent = {
        type: 'doc',
        content: [{ type: 'paragraph', content: [] }],
      }

      // Parse markdown or JSON if provided
      console.log('📝 NovelEditor.useEffect - markdown input:', {
        isString: typeof markdown === 'string',
        isEmpty: !markdown,
        length: markdown?.length,
        preview: markdown ? markdown.substring(0, 100) : null,
      })

      if (!markdown) {
        console.log('✓ No markdown, using default content')
        setInitialContent(defaultContent)
        return
      }

      if (typeof markdown !== 'string') {
        console.error('❌ Invalid markdown type:', typeof markdown)
        setInitialContent(defaultContent)
        return
      }

      try {
        // Try parsing as JSON first
        const parsed = JSON.parse(markdown)
        if (parsed && parsed.type === 'doc' && Array.isArray(parsed.content)) {
          console.log('✓ Input is valid JSONContent, using as-is')
          setInitialContent(parsed)
          return
        }
      } catch {
        // Not valid JSON, will try markdown conversion
        console.log('ℹ️ Not valid JSON, attempting markdown conversion...')
      }

      // Treat as markdown
      console.log('🔄 Converting markdown to JSONContent...')
      const converted = markdownToJSON(markdown)
      console.log('📊 Conversion result:', {
        isNull: converted === null,
        isUndefined: converted === undefined,
        hasContent: converted && Array.isArray(converted.content),
        contentLength: converted?.content?.length,
        type: converted?.type,
      })

      if (converted?.content && Array.isArray(converted.content)) {
        console.log('✓ Conversion successful')
        setInitialContent(converted)
      } else {
        console.warn('⚠️ Conversion failed or invalid structure, using default')
        setInitialContent(defaultContent)
      }
    } catch (err) {
      console.error('❌ Error in editor useEffect:', err)
      if (err instanceof Error) {
        console.error('Error details:', err.message, err.stack)
        setError(err.message)
      } else {
        setError('Unknown error')
      }
      setInitialContent({
        type: 'doc',
        content: [{ type: 'paragraph', content: [] }],
      })
    }
  }, [markdown])

  // Setup intelligent drag handle positioning
  useEffect(() => {
    if (!mounted) return

    // Apply CSS constraints for drag handles
    applyDragHandleConstraints()

    // Setup positioning logic
    const cleanup = setupDragHandlePositioning()

    return cleanup
  }, [mounted])

  // Type assertion for novel extensions to bypass strict typing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const typedExtensions: any = editorExtensions

  const handleUpdate = ({ editor }: { editor: EditorInstance }) => {
    if (onChange && editor) {
      const json = editor.getJSON()
      // Save as JSON content - the backend will handle it
      onChange(JSON.stringify(json))

      // Handle image loading states
      const images = editor.view.dom.querySelectorAll('img')
      for (const img of Array.from(images)) {
        const htmlImg = img as HTMLImageElement
        if (
          !htmlImg.classList.contains('loaded') &&
          !htmlImg.classList.contains('error')
        ) {
          htmlImg.classList.add('loading')
        }

        htmlImg.addEventListener(
          'load',
          () => {
            htmlImg.classList.remove('loading')
            htmlImg.classList.add('loaded')
          },
          { once: true },
        )

        htmlImg.addEventListener(
          'error',
          () => {
            htmlImg.classList.remove('loading')
            htmlImg.classList.add('error')
          },
          { once: true },
        )
      }
    }
  }

  if (!mounted) {
    return (
      <div
        className={`min-h-[400px] rounded-lg border border-black bg-white p-4 dark:border-white dark:bg-black ${className}`}
      >
        <div className="animate-pulse text-black/50 dark:text-white/50">
          Loading editor...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div
        className={`min-h-[400px] rounded-lg border border-red-500 bg-red-50 p-4 dark:border-red-600 dark:bg-red-900/20 ${className}`}
      >
        <div className="text-red-600 dark:text-red-400">
          <p className="font-semibold">Error loading editor:</p>
          <p className="text-sm">{error}</p>
          <p className="text-xs mt-2">Check browser console for details</p>
        </div>
      </div>
    )
  }

  if (!initialContent) {
    return (
      <div
        className={`min-h-[400px] rounded-lg border border-yellow-500 bg-yellow-50 p-4 dark:border-yellow-600 dark:bg-yellow-900/20 ${className}`}
      >
        <div className="text-yellow-600 dark:text-yellow-400">
          <p className="font-semibold">No content loaded</p>
          <p className="text-sm">Starting with empty editor</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`editor-container w-full ${className}`}>
      <EditorRoot>
        <EditorContent
          initialContent={initialContent}
          extensions={typedExtensions}
          className="editor-content-wrapper relative min-h-[400px] w-full border border-black bg-white text-black dark:border-white dark:bg-black dark:text-white sm:rounded-lg sm:shadow-lg overflow-hidden"
          editorProps={{
            attributes: {
              class: 'focus:outline-none max-w-full',
              'data-placeholder': placeholder,
            },
            editable: () => editable,
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event),
              paste: (view, event) => {
                // Enhanced paste handling for images
                const clipboardData = event.clipboardData
                if (clipboardData) {
                  const html = clipboardData.getData('text/html')
                  const text = clipboardData.getData('text/plain')

                  // Check if pasted content contains image URLs
                  const imageUrlRegex =
                    /(https?:\/\/[^\s]+(?:\.jpg|\.jpeg|\.png|\.gif|\.webp))/gi
                  const matches =
                    text.match(imageUrlRegex) || html.match(imageUrlRegex)

                  if (matches) {
                    for (const imageUrl of matches) {
                      view.dispatch(
                        view.state.tr.insertText(`![image](${imageUrl})`),
                      )
                    }
                    event.preventDefault()
                    return true
                  }
                }
                return false
              },
            },
          }}
          onUpdate={handleUpdate}
        >
          <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-black bg-white text-black dark:border-white dark:bg-black dark:text-white px-1 py-2 shadow-md transition-all">
            <EditorCommandEmpty className="px-2 py-1.5 text-sm text-black/50 dark:text-white/50">
              No results
            </EditorCommandEmpty>
            <EditorCommandList>
              {suggestionItemsArr.map((item) => (
                <EditorCommandItem
                  key={item.title}
                  onCommand={(val) => item.command?.(val)}
                  className="relative flex w-full items-start gap-2 cursor-default select-none rounded-md px-2 py-1.5 text-left text-sm outline-none hover:bg-orange-100 dark:hover:bg-green-900 aria-selected:bg-orange-200 dark:aria-selected:bg-green-800 transition-colors"
                  value={item.title}
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded border border-orange-500 bg-orange-50 dark:border-green-600 dark:bg-green-950">
                    {item.icon}
                  </div>
                  <div className="flex flex-col flex-1 min-w-0 gap-0.5">
                    <p className="font-medium text-black dark:text-white leading-tight">
                      {item.title}
                    </p>
                    <p className="text-xs text-black/60 dark:text-white/60 leading-snug whitespace-normal">
                      {item.description}
                    </p>
                  </div>
                </EditorCommandItem>
              ))}
            </EditorCommandList>
          </EditorCommand>
        </EditorContent>
      </EditorRoot>
    </div>
  )
}

// Export with ref for backwards compatibility
export const NovelEditorWithRef = NovelEditor
