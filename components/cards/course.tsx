'use client'

import { GradientBorder } from '~/components/ui/gradient-border'
import { Image } from '~/components/ui/image'
import { Link } from '~/components/ui/link'
import type { Course } from '~/types/data'

export function CourseCard({ course }: { course: Course }) {
  const { title, summary, imgSrc, demo, slug, playlist, curriculum } = course

  // make sure we always pass a valid src to Next/Image — prefer imgSrc, then images[0], then a safe site fallback
  // prefer imgSrc, then the first image from the images array if present, else a site fallback
  const imageSrc =
    imgSrc ||
    (course?.images?.length
      ? course.images[0]
      : '/static/images/twitter-card.jpeg')

  // Use project theme variables so accents follow the site's light/dark swap.
  // We intentionally do not introduce new hues — map any non-primary colors back
  // to the primary accent variables used across the site.
  const COLOR_MAP: Record<string, string> = {
    orange: 'var(--color-accent-orange)',
    green: 'var(--color-accent-green)',
  }

  // If you want to use the accent for UI styling later, keep the constant around.
  // const accent = course?.color ? COLOR_MAP[course.color] ?? COLOR_MAP.orange : COLOR_MAP.orange

  return (
    <GradientBorder className="rounded-3xl p-6 dark:bg-white/5 relative">
      <div
        className="course-accent-dot"
        style={{
          position: 'absolute',
          right: 18,
          top: 18,
          width: 12,
          height: 12,
          borderRadius: 8,
          boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
        }}
      />
      <div className="flex items-start gap-4">
        <div className="h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={imageSrc}
            alt={title}
            width={280}
            height={160}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">
            <Link href={`/courses/${slug}`}>{title}</Link>
          </h3>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
            {summary}
          </p>

          <div className="mt-4 flex items-center gap-3">
            {playlist ? (
              <Link
                href={playlist}
                className="rounded-md px-3 py-1.5 border-2 border-black dark:border-white text-sm bg-white dark:bg-black text-black dark:text-white"
              >
                Open Playlist
              </Link>
            ) : demo ? (
              <Link
                href={demo}
                className="rounded-md px-3 py-1.5 border-2 border-black dark:border-white text-sm bg-white dark:bg-black text-black dark:text-white"
              >
                Watch on YouTube
              </Link>
            ) : null}

            {Array.isArray(curriculum) && curriculum.length > 0 && (
              <div className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                {curriculum.length} lesson{curriculum.length > 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
      </div>
    </GradientBorder>
  )
}

export default CourseCard
