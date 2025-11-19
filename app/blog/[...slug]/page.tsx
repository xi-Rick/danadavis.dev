import type { Author, Blog } from 'contentlayer/generated'
import { allAuthors, allBlogs } from 'contentlayer/generated'
import { prisma } from '~/db'
type DBPost = {
  slug: string
  title: string
  summary?: string | null
  images?: string[] | string
  canonicalUrl?: string | null
  layout?: string | null
  bibliography?: string | null
  draft?: boolean
  featured?: boolean
  content?: string | null
  date: Date
  lastmod?: Date | null
  authors?: string[]
}
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDX_COMPONENTS } from '~/components/mdx'
import { MDXLayoutRenderer } from '~/components/mdx/layout-renderer'
import { SITE_METADATA } from '~/data/site-metadata'
import { PostBanner } from '~/layouts/post-banner'
import { PostLayout } from '~/layouts/post-layout'
import { PostSimple } from '~/layouts/post-simple'
import { allCoreContent, coreContent } from '~/utils/contentlayer'
import { sortPosts } from '~/utils/misc'

const DEFAULT_LAYOUT = 'PostLayout'
const LAYOUTS = {
  PostSimple,
  PostLayout,
  PostBanner,
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata | undefined> {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))
  // Try to load post from DB (admin edits) first
  let dbPost: DBPost | null = null
  try {
    dbPost = (await prisma.post.findUnique({
      where: { slug },
    })) as DBPost | null
  } catch (e) {
    // ignore
  }
  const post = dbPost || allBlogs.find((p) => p.slug === slug)
  const authorList = post?.authors || ['default']
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author)
    return coreContent(authorResults as Author)
  })
  if (!post) {
    return
  }

  const publishedAt = new Date(post.date).toISOString()
  const modifiedAt = new Date(post.lastmod || post.date).toISOString()
  const authors = authorDetails.map((author) => author.name)
  let imageList = [SITE_METADATA.socialBanner]
  if (post.images) {
    imageList = typeof post.images === 'string' ? [post.images] : post.images
  }
  const ogImages = imageList.map((img) => {
    return {
      url: img.includes('http') ? img : SITE_METADATA.siteUrl + img,
    }
  })

  return {
    title: post.title,
    description: post.summary ?? undefined,
    openGraph: {
      title: post.title,
      description: post.summary ?? undefined,
      siteName: SITE_METADATA.title,
      locale: 'en_US',
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      url: './',
      images: ogImages,
      authors: authors.length > 0 ? authors : [SITE_METADATA.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary ?? undefined,
      images: imageList,
    },
  }
}

export const generateStaticParams = async () => {
  return allBlogs.map((p) => ({
    slug: p.slug.split('/').map((name) => decodeURI(name)),
  }))
}

export const dynamic = 'force-dynamic'

export default async function Page(props: {
  params: Promise<{ slug: string[] }>
}) {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))
  // Filter out drafts in production - prefer DB posts first for dynamic updates
  let dbPost: DBPost | null = null
  try {
    dbPost = await prisma.post.findUnique({ where: { slug } })
  } catch (e) {
    // ignore
  }

  const sortedCoreContents = allCoreContent(sortPosts(allBlogs))
  const postFromStatic = allBlogs.find((p) => p.slug === slug) as
    | Blog
    | undefined
  const post: DBPost | Blog | undefined = dbPost || postFromStatic

  // Determine prev/next from static posts when available. If the post is only in
  // DB and not present in static `allBlogs`, prev/next will remain undefined.
  const staticIndex = postFromStatic
    ? sortedCoreContents.findIndex((p) => p.slug === slug)
    : -1
  const prev =
    staticIndex >= 0 ? sortedCoreContents[staticIndex + 1] : undefined
  const next =
    staticIndex >= 0 ? sortedCoreContents[staticIndex - 1] : undefined

  if (!post) {
    return notFound()
  }
  const authorList = post?.authors || ['default']
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author)
    return coreContent(authorResults as Author)
  })
  const mainContent = dbPost
    ? {
        title: dbPost.title,
        slug: dbPost.slug,
        summary: dbPost.summary || '',
        images:
          typeof dbPost.images === 'string'
            ? [dbPost.images]
            : dbPost.images || [],
        date: dbPost.date.toISOString(),
        lastmod: (dbPost.lastmod ?? dbPost.date).toISOString(),
        authors: dbPost.authors || [],
      }
    : coreContent(post as Blog)
  let jsonLd: Record<string, unknown> = {}
  if (dbPost) {
    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: dbPost.title,
      description: dbPost.summary || '',
      datePublished: dbPost.date.toISOString(),
      dateModified: (dbPost.lastmod ?? dbPost.date).toISOString(),
    }
  } else {
    jsonLd = (post as Blog).structuredData
  }
  jsonLd.author = authorDetails.map((author) => ({
    '@type': 'Person',
    name: author.name,
  }))
  const layoutStr = dbPost ? dbPost.layout : (post as Blog).layout
  const Layout = LAYOUTS[(layoutStr as string) || DEFAULT_LAYOUT]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Layout
        content={mainContent}
        authorDetails={authorDetails}
        next={next}
        prev={prev}
      >
        {dbPost ? (
          <div
            className="prose sm:prose-base lg:prose-lg max-w-none project-content break-words"
            dangerouslySetInnerHTML={{ __html: dbPost.content || '' }}
          />
        ) : (
          <MDXLayoutRenderer
            code={(post as Blog).body.code}
            components={MDX_COMPONENTS}
            toc={(post as Blog).toc}
          />
        )}
      </Layout>
    </>
  )
}
