import { genPageMetadata } from 'app/seo'
import { ExternalLink, Github } from 'lucide-react'
import { notFound } from 'next/navigation'
import { remark } from 'remark'
import html from 'remark-html'
import { ScrollButtons } from '~/components/blog/scroll-buttons'
import Comments from '~/components/comments/giscus'
import { Badge } from '~/components/ui/badge'
import { Container } from '~/components/ui/container'
import { GradientDivider } from '~/components/ui/gradient-divider'
import { Link } from '~/components/ui/link'
import { MacbookScroll } from '~/components/ui/macbook-scroll'
import { PageHeader } from '~/components/ui/page-header'
import { PROJECTS } from '~/data/projects'
import { SITE_METADATA } from '~/data/site-metadata'
import { prisma } from '~/db'
import { isDbEnabled } from '~/lib/data-source'
import { getGiscusConfig } from '~/lib/giscus'
import { jsonToMarkdown } from '~/lib/markdown-to-json'

export async function generateStaticParams() {
  return PROJECTS.map((project) => ({
    slug: project.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-'),
  }))
}
export const dynamic = 'force-dynamic'

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params

  // Try to find project in database first so metadata reflects DB header image
  let dbProject: Awaited<ReturnType<typeof prisma.project.findUnique>> = null
  if (isDbEnabled()) {
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
      console.warn(
        'Database unavailable during build - using static project data',
      )
    }
  }

  // Fallback to static PROJECTS data if not in database
  const staticProject = PROJECTS.find(
    (p) =>
      p.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-') === params.slug,
  )

  const project = dbProject || staticProject

  if (!project) {
    return {}
  }

  // Prefer DB imgSrc if available, otherwise use static project's imgSrc
  const projectImg = (project as { imgSrc?: string }).imgSrc
  const image = projectImg
    ? projectImg.includes('http')
      ? projectImg
      : SITE_METADATA.siteUrl + projectImg
    : undefined

  return genPageMetadata({
    title: project.title,
    description: project.description ?? undefined,
    image,
  })
}

export default async function ProjectPage(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params

  // Try to find project in database first
  let dbProject: Awaited<ReturnType<typeof prisma.project.findUnique>> = null
  if (isDbEnabled()) {
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

  // Convert content to markdown if it's JSON, then to HTML
  let htmlContent = ''
  let markdownContent = ''

  if (dbProject?.content) {
    try {
      // Try to parse as JSON
      const parsed = JSON.parse(dbProject.content)
      if (parsed && parsed.type === 'doc' && Array.isArray(parsed.content)) {
        // It's JSONContent, convert to markdown
        markdownContent = jsonToMarkdown(parsed)
      } else {
        // Not valid JSON, treat as markdown
        markdownContent = dbProject.content
      }
    } catch {
      // Not JSON, treat as markdown
      markdownContent = dbProject.content
    }

    const processedContent = await remark()
      .use(html, { sanitize: false })
      .process(markdownContent)
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

  const demoUrl = dbProject?.url ?? staticProject?.links?.[0]?.url ?? null
  const repoUrl = dbProject?.repo ?? staticProject?.repo ?? null

  const giscusConfig = getGiscusConfig()

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
            <div className="space-y-4 lg:col-span-2 lg:space-y-6">
              <div className="prose sm:prose-base lg:prose-lg max-w-none project-content break-words">
                {htmlContent ? (
                  <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
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
              {(demoUrl || repoUrl) && (
                <div className="flex flex-wrap gap-3 mt-8">
                  {demoUrl && (
                    <Link
                      href={demoUrl}
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-lg bg-orange-500 text-white hover:bg-orange-600 dark:bg-green-500 dark:text-black dark:hover:bg-green-400 transition-all shadow-md"
                    >
                      <ExternalLink size={15} />
                      Visit Live Site
                    </Link>
                  )}
                  {repoUrl && (
                    <Link
                      href={repoUrl}
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold border-2 border-black dark:border-white rounded-lg bg-white dark:bg-black text-black dark:text-white hover:border-orange-500 hover:text-orange-500 dark:hover:border-green-500 dark:hover:text-green-500 transition-all"
                    >
                      <Github size={15} />
                      View Source
                    </Link>
                  )}
                </div>
              )}
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
                            className="capitalize inline-block rounded-lg border-2 font-semibold transition-all duration-200 border-black bg-white text-black hover:border-orange-500 hover:bg-orange-500 hover:text-white dark:border-white dark:bg-black dark:text-white dark:hover:border-green-500 dark:hover:bg-green-500 dark:hover:text-white"
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
            {giscusConfig && <Comments config={giscusConfig} />}
          </div>
        </div>
      </div>
    </Container>
  )
}
