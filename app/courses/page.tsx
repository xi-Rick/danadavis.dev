import { genPageMetadata } from 'app/seo'
import CourseCard from '~/components/cards/course'
import { Container } from '~/components/ui/container'
import { PageHeader } from '~/components/ui/page-header'
import { COURSES } from '~/data/courses'

export const metadata = genPageMetadata({
  title: 'Courses',
  description:
    'Curated web development courses and video series — all hosted on YouTube.',
})

export default async function CoursesPage() {
  const courses = COURSES

  return (
    <Container className="pt-4 lg:pt-12">
      <PageHeader
        title="Courses"
        description="A small curated list of course series and tutorials — all hosted on YouTube. Browse and click through to watch the videos."
        className="border-b border-gray-200 dark:border-gray-700"
      />

      <div className="py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {courses.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      </div>
    </Container>
  )
}
