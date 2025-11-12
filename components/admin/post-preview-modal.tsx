'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'
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
        className="text-lg font-semibold underline-offset-4 transition-colors hover:text-gray-900 dark:hover:text-gray-200"
      >
        <GrowingUnderline data-umami-event="preview-post">
          Preview Post
        </GrowingUnderline>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="!w-[95vw] !max-w-[2000px] h-[92vh] !max-h-[1000px] overflow-hidden p-0 bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-700 sm:!w-[92vw] lg:!w-[90vw] xl:!w-[92vw] 2xl:!w-[95vw]">
          <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-black sticky top-0 z-10">
            <DialogTitle className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
              Post Preview
            </DialogTitle>
          </DialogHeader>

          <div className="overflow-y-auto h-[calc(100%-4rem)] sm:h-[calc(100%-5rem)] bg-white dark:bg-black">
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
                  className="pb-8 sm:pb-12"
                >
                  {/* Preview Container matching live page structure */}
                  <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-3 sm:pt-4 lg:pt-8">
                    <article className="pt-4 sm:pt-6">
                      <div className="space-y-3 sm:space-y-4">
                        {/* Tags */}
                        {tagsArray.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {tagsArray.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full border border-gray-200 dark:border-gray-700"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Title */}
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                          {title || 'Untitled Post'}
                        </h1>

                        {/* Banner Image */}
                        {bannerImage && (
                          <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4 md:pt-8">
                            <div className="relative w-full aspect-video overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                              <Image
                                src={bannerImage}
                                alt={title}
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
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 pb-3 sm:pb-4 lg:pt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-4">
                            <time dateTime={date}>
                              {new Date(date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </time>
                            <span>•</span>
                            <span>{readingTime.text}</span>
                          </div>
                        </div>

                        {/* Summary */}
                        {summary && (
                          <div className="text-base sm:text-lg text-gray-700 dark:text-gray-300 italic border-l-4 border-orange-500 pl-3 sm:pl-4 py-2 bg-gray-50 dark:bg-gray-900 rounded-r-lg">
                            {summary}
                          </div>
                        )}
                      </div>

                      {/* Divider */}
                      <div className="mt-4 sm:mt-6 mb-6 sm:mb-8 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent" />

                      {/* Content */}
                      <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:gap-12 pt-4 sm:pt-6 lg:pt-8 pb-6 sm:pb-8 lg:pb-10 lg:grid-cols-12">
                        <div className="lg:col-span-8 xl:col-span-9">
                          <div className="prose prose-sm sm:prose dark:prose-invert lg:prose-lg max-w-none lg:pb-8 blog-content">
                            {previewHtml ? (
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: previewHtml,
                                }}
                              />
                            ) : (
                              <div className="text-gray-500 dark:text-gray-400 text-center py-8 sm:py-12">
                                No content to preview
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Sidebar - Placeholder */}
                        <div className="hidden lg:col-span-4 lg:block xl:col-span-3">
                          <div className="space-y-3 sm:space-y-4 lg:sticky lg:top-24">
                            <div className="p-3 sm:p-4 bg-gray-100 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                              <h3 className="font-semibold text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                                Table of Contents
                              </h3>
                              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                                Will appear on live page
                              </p>
                            </div>
                            <div className="p-3 sm:p-4 bg-gray-100 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                              <h3 className="font-semibold text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                                Reactions
                              </h3>
                              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                                Will appear on live page
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Divider */}
                      <div className="h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent" />

                      {/* Footer Placeholder */}
                      <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
                        <div className="p-4 sm:p-6 bg-gray-100 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            Navigation, Comments, and other sections will appear
                            on the live page
                          </p>
                        </div>
                      </div>
                    </article>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
