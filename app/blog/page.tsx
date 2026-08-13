import { genPageMetadata } from 'app/seo'
import { allBlogs } from 'contentlayer/generated'
import { prisma } from '~/db'
import { ListLayout } from '~/layouts/list-layout'
import { isDbEnabled } from '~/lib/data-source'
import { POSTS_PER_PAGE } from '~/utils/const'
import { sortPosts } from '~/utils/misc'

export const dynamic = 'force-dynamic'

export const metadata = genPageMetadata({
  title: 'Blog',
  description:
    "I like to write about stuff I'm into. You'll find a mix of web dev articles, tech news, and random thoughts from my life. Use the search below to filter by title.",
})

export default async function BlogPage() {
  // Cross-reference Prisma for draft status — DB wins over MDX frontmatter
  const dbDraftMap = new Map<string, boolean>()
  if (isDbEnabled()) {
    try {
      const dbPosts = await prisma.post.findMany({
        select: { slug: true, draft: true },
      })
      for (const p of dbPosts) {
        dbDraftMap.set(p.slug, p.draft)
      }
    } catch {}
  }

  let posts = allBlogs.filter((post) => {
    const dbDraft = dbDraftMap.get(post.slug)
    return dbDraft !== undefined ? !dbDraft : post.draft !== true
  })
  posts = sortPosts(posts)
  const pageNumber = 1
  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber,
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  }

  return (
    <ListLayout
      posts={posts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title="All posts"
    />
  )
}
