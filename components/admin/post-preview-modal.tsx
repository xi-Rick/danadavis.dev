'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { GrowingUnderline } from '~/components/ui/growing-underline'

interface PostPreviewModalProps {
  title: string
  summary: string
  content: string
  tags: string
  images: string
  date?: string
  readingTime?: { text: string }
}

export function PostPreviewModal({
  title,
  summary,
  content,
  tags,
  images,
  date = new Date().toISOString(),
  readingTime = { text: '5 min read' },
}: PostPreviewModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [previewHtml, setPreviewHtml] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const handlePreview = async () => {
    setIsLoading(true)
    setIsOpen(true)

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
      setIsLoading(false)
    }
  }

  // Reset scroll position when modal opens
  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  const tagsArray = tags
    .split(',')
    .map((t) => t.trim())
    .filter((t) => t)
  const imagesArray = images
    .split(',')
    .map((i) => i.trim())
    .filter((i) => i)
  const bannerImage = imagesArray[0] || '/static/images/twitter-card.jpeg'

  return (
    <>
      <button
        type="button"
        onClick={handlePreview}
        className="text-base sm:text-lg font-semibold underline-offset-4 transition-colors hover:text-gray-900 dark:hover:text-gray-200 text-left"
        aria-label="Preview post content"
      >
        <GrowingUnderline data-umami-event="preview-post">
          Preview Post
        </GrowingUnderline>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="!w-[96vw] sm:!w-[92vw] lg:!w-[88vw] xl:!w-[85vw] !max-w-[1400px] h-[94vh] sm:h-[90vh] max-h-[900px] overflow-hidden p-0 bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-700 [&>button]:text-gray-900 [&>button]:dark:text-gray-100 [&>button]:hover:bg-gray-100 [&>button]:dark:hover:bg-gray-800 [&>button]:top-3 [&>button]:right-3 [&>button]:sm:top-4 [&>button]:sm:right-4 [&>button]:z-20"
          aria-describedby="preview-description"
        >
          <DialogHeader className="px-3 sm:px-4 lg:px-6 pt-3 sm:pt-4 lg:pt-6 pb-2 sm:pb-3 lg:pb-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-black sticky top-0 z-10">
            <div>
              <DialogTitle className="text-base normal-case sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-gray-100">
                Live Post Preview
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
            aria-label="Post preview content"
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
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
                      className="w-12 h-12 border-4 border-t-transparent rounded-full border-orange-500 dark:border-green-600"
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
                  {/* Preview Container matching live page structure */}
                  <article className="pt-2 sm:pt-3 lg:pt-4 w-full">
                    <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                      {/* Tags */}
                      {tagsArray.length > 0 && (
                        <div className="flex flex-wrap gap-1 sm:gap-1.5 lg:gap-2">
                          {tagsArray.map((tag) => (
                            <span
                              key={tag}
                              className="px-1.5 sm:px-2 lg:px-3 py-0.5 sm:py-0.5 lg:py-1 text-[10px] sm:text-xs lg:text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full border border-gray-200 dark:border-gray-700"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Title */}
                      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                        {title || 'Untitled Post'}
                      </h1>

                      {/* Banner Image */}
                      {bannerImage && (
                        <div className="space-y-2 sm:space-y-3 lg:space-y-4 pt-2 sm:pt-3 lg:pt-6">
                          <div className="relative w-full aspect-video overflow-hidden rounded-md sm:rounded-lg border border-gray-200 dark:border-gray-700">
                            <Image
                              src={bannerImage}
                              alt={title || 'Post banner'}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                e.currentTarget.src =
                                  '/static/images/twitter-card.jpeg'
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Meta Information */}
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 lg:gap-3 pb-2 sm:pb-3 lg:pb-4 text-[10px] sm:text-xs lg:text-sm text-gray-600 dark:text-gray-400">
                        <time dateTime={date}>
                          {new Date(date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </time>
                        <span>•</span>
                        <span>{readingTime.text}</span>
                      </div>

                      {/* Summary */}
                      {summary && (
                        <div className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 italic border-l-2 sm:border-l-4 border-orange-500 dark:border-green-600 pl-2 sm:pl-3 lg:pl-4 py-1.5 sm:py-2 bg-gray-50 dark:bg-gray-900 rounded-r-md sm:rounded-r-lg">
                          {summary}
                        </div>
                      )}
                    </div>

                    {/* Divider */}
                    <div className="mt-3 sm:mt-4 lg:mt-6 mb-4 sm:mb-6 lg:mb-8 h-px bg-gradient-to-r from-transparent via-orange-500 dark:via-green-600 to-transparent" />

                    {/* Content */}
                    <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8 pt-2 sm:pt-4 lg:pt-6 pb-4 sm:pb-6 lg:pb-8 lg:grid-cols-12">
                      <div className="lg:col-span-12">
                        <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none blog-content">
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
                      </div>
                    </div>

                    {/* Bottom Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-orange-500 dark:via-green-600 to-transparent" />

                    {/* Footer Placeholder */}
                    <div className="mt-4 sm:mt-6 lg:mt-8 space-y-2 sm:space-y-3 lg:space-y-4">
                      <div className="p-3 sm:p-4 lg:p-6 bg-gray-100 dark:bg-gray-900 rounded-md sm:rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                        <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600 dark:text-gray-400">
                          Navigation, Comments, and other sections will appear
                          on the live page
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
    </>
  )
}
