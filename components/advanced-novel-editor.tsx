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

interface AdvancedNovelEditorProps {
  initialContent?: string
  onChange?: (content: string) => void
  className?: string
  placeholder?: string
}

/**
 * Advanced Novel.sh Editor with full features
 * Properly converts between Markdown and JSONContent formats
 * Includes slash commands, bubble menu, proper TypeScript types, and enhanced image support
 */
export default function AdvancedNovelEditor({
  initialContent = '',
  onChange,
  className = '',
  placeholder = 'Start writing or type "/" for commands...',
}: AdvancedNovelEditorProps) {
  const [content, setContent] = useState<JSONContent | undefined>(undefined)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (initialContent) {
      try {
        // Try parsing as JSON first
        const parsed = JSON.parse(initialContent)
        if (parsed.type === 'doc' && parsed.content) {
          setContent(parsed)
        } else {
          // If it's JSON but not valid JSONContent, treat as markdown
          setContent(markdownToJSON(initialContent))
        }
      } catch {
        // If not valid JSON, treat as markdown
        setContent(markdownToJSON(initialContent))
      }
    }
  }, [initialContent])

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
        className={`min-h-[500px] rounded-lg border border-black bg-white p-4 dark:border-white dark:bg-black ${className}`}
      >
        <div className="animate-pulse text-black/50 dark:text-white/50">
          Loading editor...
        </div>
      </div>
    )
  }

  return (
    <div className={`editor-container ${className}`}>
      <EditorRoot>
        <EditorContent
          initialContent={content}
          extensions={typedExtensions}
          className="editor-content-wrapper relative min-h-[500px] w-full border border-black bg-white text-black dark:border-white dark:bg-black dark:text-white sm:rounded-lg sm:shadow-lg overflow-hidden"
          editorProps={{
            attributes: {
              class: 'focus:outline-none max-w-full',
              'data-placeholder': placeholder,
            },
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
