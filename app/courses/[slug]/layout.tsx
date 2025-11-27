import { notFound } from 'next/navigation'
import { COURSES } from '~/data/courses'
import type { Course } from '~/types/data'

// use theme variables so the course accent follows the site's color swap
const COLOR_MAP: Record<string, string> = {
  orange: 'var(--color-accent-orange)',
  green: 'var(--color-accent-green)',
  purple: 'var(--color-accent-orange)',
  blue: 'var(--color-accent-orange)',
}

export default async function CourseSlugLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const course = COURSES.find((c) => c.slug === slug) as Course | undefined

  if (!course) {
    notFound()
  }

  const accent = course?.color
    ? (COLOR_MAP[course.color] ?? '#f97316')
    : '#f97316'

  // expose the course accent for inner pages but don't add extra vertical spacing
  // so the page's own Container controls header padding.
  // Use a typed style object instead of casting to `any` so ESLint/TS won't fail.
  const style = { '--course-accent': accent } as React.CSSProperties &
    Record<string, string>

  return <div style={style}>{children}</div>
}
