import { genPageMetadata } from 'app/seo'
import { notFound } from 'next/navigation'
import Comments from '~/components/blog/comments'
import { Badge } from '~/components/ui/badge'
import { Container } from '~/components/ui/container'
import { GradientDivider } from '~/components/ui/gradient-divider'
import { Link } from '~/components/ui/link'
import { MacbookScroll } from '~/components/ui/macbook-scroll'
import { PageHeader } from '~/components/ui/page-header'
import { PROJECTS } from '~/data/projects'
import { SITE_METADATA } from '~/data/site-metadata'

export async function generateStaticParams() {
  return PROJECTS.map((project) => ({
    slug: project.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-'),
  }))
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params
  const project = PROJECTS.find(
    (p) =>
      p.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-') === params.slug,
  )

  if (!project) {
    return {}
  }

  return genPageMetadata({
    title: project.title,
    description: project.description,
  })
}

export default async function ProjectPage(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params
  const project = PROJECTS.find(
    (p) =>
      p.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-') === params.slug,
  )

  if (!project) {
    notFound()
  }

  const { title, description, imgSrc, builtWith, links, type } = project

  return (
    <Container className="pt-4 lg:pt-12">
      <PageHeader
        title={title}
        description={description}
        className="border-b border-gray-200 dark:border-gray-700"
      />
      <div className="mx-auto max-w-[95vw] sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-7xl">
        {/* MacBook Scroll Section */}
        <div className="relative overflow-hidden">
          <MacbookScroll
            src={imgSrc}
            title={
              <div className="space-y-2">
                <p className="text-sm uppercase tracking-wide text-gray-400">
                  {type === 'work' ? 'Work Project' : 'Side Project'}
                </p>
              </div>
            }
          />
        </div>

        {/* Project Content Section */}
        <div className="container px-4 sm:px-6 md:px-8 mt-16">
          <div className="grid max-w-6xl gap-8 mx-auto items-start md:grid-cols-1 lg:grid-cols-3 lg:gap-12">
            {/* Main Content */}
            <div className="space-y-4 lg:col-span-2 lg:space-y-6 overflow-x-hidden">
              <div className="prose dark:prose-invert sm:prose-base lg:prose-lg max-w-none project-content break-words">
                {project.content ? (
                  <div
                    className="overflow-x-auto"
                    dangerouslySetInnerHTML={{ __html: project.content }}
                  />
                ) : (
                  <>
                    {/* Technical Details Section */}
                    <h2 className="text-xl sm:text-2xl font-bold mt-6 sm:mt-8 mb-4">
                      Technical Implementation
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      This project was built using modern development practices
                      and technologies to ensure scalability, maintainability,
                      and optimal performance.
                    </p>
                  </>
                )}
              </div>

              {/* Project Links */}
              <div className="flex flex-wrap gap-4 mt-8">
                {links?.map(({ title: linkTitle, url }) => (
                  <Link
                    key={url}
                    href={url}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    {linkTitle}
                  </Link>
                ))}
              </div>
            </div>

            {/* Project Details */}
            <div className="lg:sticky lg:top-24 space-y-6">
              <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-primary-200 dark:border-green-800">
                <h3 className="text-lg font-semibold mb-4 text-primary-600 dark:text-green-500">
                  Project Details
                </h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Type
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-green-100">
                      {type}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Tech Stack
                    </dt>
                    <dd className="mt-1">
                      <div className="flex flex-wrap gap-2">
                        {builtWith?.map((tech) => (
                          <Badge
                            key={tech}
                            variant="outline"
                            className="capitalize"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          {/* Comments Section - Full Width */}
          <div className="col-span-full mt-12">
            <GradientDivider className="mb-8" />
            <Comments
              url={`${SITE_METADATA.siteUrl}/projects/${params.slug}`}
              identifier={`project-${params.slug}`}
              title={title}
              className="max-w-none"
            />
          </div>
        </div>
      </div>
    </Container>
  )
}
