import { genPageMetadata } from 'app/seo'
import { notFound } from 'next/navigation'
import { remark } from 'remark'
import html from 'remark-html'
import Comments from '~/components/blog/comments'
import { ScrollButtons } from '~/components/blog/scroll-buttons'
import { Badge } from '~/components/ui/badge'
import { Container } from '~/components/ui/container'
import { GradientDivider } from '~/components/ui/gradient-divider'
import { Link } from '~/components/ui/link'
import { MacbookScroll } from '~/components/ui/macbook-scroll'
import { PageHeader } from '~/components/ui/page-header'
import { PROJECTS } from '~/data/projects'
import { SITE_METADATA } from '~/data/site-metadata'
import { prisma } from '~/db'
import { getCommentsBySlug } from '~/db/queries'

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

  // Try to find project in database first
  let dbProject: Awaited<ReturnType<typeof prisma.project.findUnique>> = null
  try {
    dbProject = await prisma.project.findUnique({
      where: { slug: params.slug },
    })

    // If not found by slug, try to find by matching the title-based slug
    if (!dbProject) {
      const allProjects = await prisma.project.findMany()
      dbProject =
        allProjects.find(
          (p) =>
            p.title
              .toLowerCase()
              .replace(/[^\w\s-]/g, '')
              .replace(/\s+/g, '-') === params.slug,
        ) || null
    }
  } catch {
    // Database unavailable during build - fall back to static data
    console.warn('Database unavailable, using static project data')
  }

  // Fallback to static PROJECTS data if not in database
  const staticProject = PROJECTS.find(
    (p) =>
      p.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-') === params.slug,
  )

  if (!dbProject && !staticProject) {
    notFound()
  }

  // Use database project if available, otherwise use static
  const project = dbProject || staticProject

  // Convert Markdown content to HTML if it exists
  let htmlContent = ''
  if (dbProject?.content) {
    const processedContent = await remark()
      .use(html, { sanitize: false })
      .process(dbProject.content)
    htmlContent = processedContent.toString()
  } else if (staticProject?.content) {
    htmlContent = staticProject.content
  }

  const { title, description, imgSrc, builtWith, links, type, color } =
    project as {
      title: string
      description: string
      imgSrc: string
      builtWith: string[]
      links: Array<{ title: string; url: string }>
      type: string
      color?: 'orange' | 'green'
    }

  const comments = await getCommentsBySlug(`project-${params.slug}`)

  return (
    <Container className="pt-4 lg:pt-12">
      <ScrollButtons color={color || 'orange'} />
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
              <div className="prose sm:prose-base lg:prose-lg max-w-none project-content break-words">
                {htmlContent ? (
                  <div
                    className="overflow-x-auto"
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
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
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold border-2 border-black dark:border-white rounded-lg bg-white dark:bg-black text-black dark:text-white hover:bg-orange-50 dark:hover:bg-green-900/20 transition-all"
                  >
                    {linkTitle}
                  </Link>
                ))}
              </div>
            </div>

            {/* Project Details */}
            <div className="lg:sticky lg:top-24 space-y-6">
              <div className="p-6 bg-orange-50 dark:bg-black rounded-xl border-2 border-black dark:border-white">
                <h3 className="text-lg font-semibold mb-4 text-orange-600 dark:text-green-500">
                  Project Details
                </h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Type
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-black dark:text-white capitalize">
                      {type}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Tech Stack
                    </dt>
                    <dd className="mt-1">
                      <div className="flex flex-wrap gap-2">
                        {builtWith?.map((tech) => (
                          <Badge
                            key={tech}
                            variant="outline"
                            className="capitalize border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white hover:bg-orange-100 dark:hover:bg-green-900/20"
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
              postSlug={`project-${params.slug}`}
              comments={comments}
            />
          </div>
        </div>
      </div>
    </Container>
  )
}
