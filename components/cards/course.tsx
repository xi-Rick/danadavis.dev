'use client'
import { Brand, resolveBrandKey } from '~/components/ui/brand'
import { GradientBorder } from '~/components/ui/gradient-border'
import { GrowingUnderline } from '~/components/ui/growing-underline'
import { Image } from '~/components/ui/image'
import { Link } from '~/components/ui/link'
import type { Course } from '~/types/data'

export function CourseCard({ course }: { course: Course }) {
  const { title, summary, imgSrc, demo, slug, playlist, curriculum } = course
  const imageSrc =
    imgSrc ||
    (course?.images?.length
      ? course.images[0]
      : '/static/images/twitter-card.jpeg')

  // Resolve a brand key from the course's technologies using the shared helper
  const brandKey = resolveBrandKey(course.technologies || [])

  return (
    <GradientBorder className="rounded-3xl p-6 bg-white dark:bg-black relative">
      {/* Technology icon badge with themed accent dot */}
      <div className="flex flex-col gap-4">
        {/* Centered Image */}
        <div className="w-full h-48 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-900 shadow-sm">
          <Image
            src={imageSrc}
            alt={title}
            width={400}
            height={240}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Title Section */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 leading-tight">
            <Link
              href={`/courses/${slug}`}
              className="text-gray-900 dark:text-gray-100"
              aria-label={`Open course ${title}`}
            >
              <GrowingUnderline data-umami-event="latest-course-title">
                {title}
              </GrowingUnderline>
            </Link>
          </h3>

          {Array.isArray(curriculum) && curriculum.length > 0 && (
            <output
              className="flex items-center gap-2"
              aria-label={`${curriculum.length} lessons`}
            >
              <span
                className="course-accent-dot w-1.5 h-1.5 rounded-full"
                aria-hidden="true"
              />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                {curriculum.length} lesson{curriculum.length > 1 ? 's' : ''}
              </span>
            </output>
          )}
        </div>

        {/* Summary with inline icon */}
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 shrink-0 overflow-hidden p-2 rounded-full relative flex items-center justify-center"
            style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))' }}
          >
            <div className="absolute inset-0 opacity-20" />
            {/* Use Brand icon components from the repo-root `icons/` folder */}
            <Brand
              name={brandKey}
              as="icon"
              className="w-full h-full object-contain relative z-10"
            />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2 flex-1">
            {summary}
          </p>
        </div>

        {/* Action Button with themed styling */}
        {(playlist || demo) && (
          <div className="pt-2">
            {playlist ? (
              <Link
                href={playlist}
                className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300"
                target="_blank"
                rel="noreferrer"
                aria-label={`Open playlist for ${title}`}
              >
                <GrowingUnderline>Open playlist →</GrowingUnderline>
              </Link>
            ) : demo ? (
              <Link
                href={demo}
                className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300"
                target="_blank"
                rel="noreferrer"
                aria-label={`Watch ${title} on YouTube`}
              >
                <GrowingUnderline>Watch on YouTube →</GrowingUnderline>
              </Link>
            ) : null}
          </div>
        )}
      </div>
    </GradientBorder>
  )
}

export default CourseCard
