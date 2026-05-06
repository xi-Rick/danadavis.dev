import { allBlogs, allSnippets } from 'contentlayer/generated'
import { Home } from '~/components/home-page'
import { prisma } from '~/db'
import { allCoreContent } from '~/utils/contentlayer'
import { sortPosts } from '~/utils/misc'

export const dynamic = 'force-dynamic'

const MAX_POSTS_DISPLAY = 3
const MAX_SNIPPETS_DISPLAY = 4

export default async function HomePage() {
  // Cross-reference Prisma for draft status — DB wins over MDX frontmatter
  const dbDraftMap = new Map<string, boolean>()
  try {
    const dbPosts = await prisma.post.findMany({
      select: { slug: true, draft: true },
    })
    for (const p of dbPosts) {
      dbDraftMap.set(p.slug, p.draft)
    }
  } catch {}

  const publishedPosts = allCoreContent(sortPosts(allBlogs)).filter((post) => {
    const dbDraft = dbDraftMap.get(post.slug)
    return dbDraft !== undefined ? !dbDraft : !post.draft
  })
  const publishedSnippets = allCoreContent(sortPosts(allSnippets)).filter(
    (snippet) => !snippet.draft,
  )

  // Fetch projects from the database (server side)
  // If prisma is unavailable, the component will fallback to the static PROJECTS array
  // in Home
  let projects: Array<{
    title: string
    slug: string
    imgSrc: string
  }> = []
  try {
    projects = await prisma.project.findMany({ orderBy: { date: 'desc' } })
  } catch (err) {
    console.warn('Failed to fetch projects from DB:', err)
  }

  return (
    <Home
      posts={publishedPosts.slice(0, MAX_POSTS_DISPLAY)}
      snippets={publishedSnippets.slice(0, MAX_SNIPPETS_DISPLAY)}
      projects={projects.map((p) => ({
        title: p.title,
        link: `/projects/${p.slug}`,
        thumbnail: p.imgSrc,
        type: 'project' as const,
      }))}
    />
  )
}
