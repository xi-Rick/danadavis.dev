import type { Blog, Snippet } from 'contentlayer/generated'
import type { ReactNode } from 'react'
import { BlogMeta } from '~/components/blog/blog-meta'
import { PostTitle } from '~/components/blog/post-title'
import { ScrollButtons } from '~/components/blog/scroll-buttons'
import { TagsList } from '~/components/blog/tags'
import Comments from '~/components/comments/giscus'
import { Brand, resolveBrandKey } from '~/components/ui/brand'
import { Container } from '~/components/ui/container'
import { GradientDivider } from '~/components/ui/gradient-divider'
import { SITE_METADATA } from '~/data/site-metadata'
import type { StatsType } from '~/db/schema'
import { getGiscusConfig } from '~/lib/giscus'
import type { CoreContent } from '~/types/data'

interface PostSimpleProps {
  content: CoreContent<Blog | Snippet>
  children: ReactNode
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
}

export async function PostSimple({ content, children }: PostSimpleProps) {
  const {
    slug,
    date,
    lastmod,
    title,
    type,
    tags,
    readingTime,
    icon,
    language,
    framework,
  } = content as any
  const postUrl = `${SITE_METADATA.siteUrl}/${type.toLowerCase()}/${slug}`
  const giscusConfig = getGiscusConfig()

  return (
    <Container className="pt-4 lg:pt-12">
      <ScrollButtons />
      <article className="space-y-6 pt-6 lg:space-y-12">
        <div className="space-y-4">
          <TagsList tags={tags} />
          <div className="flex items-center gap-3">
            {type.toLowerCase() === 'snippet' && (
              <Brand
                name={resolveBrandKey([icon, framework, language, tags?.[0]])}
                as="icon"
                className="h-8 w-8 text-gray-900 dark:text-white"
                iconClassName="h-8 w-8"
                aria-hidden="true"
              />
            )}
            <PostTitle>{title}</PostTitle>
          </div>
          <dl>
            <div>
              <dt className="sr-only">Published on</dt>
              <BlogMeta
                date={date}
                lastmod={lastmod}
                type={type.toLowerCase() as StatsType}
                slug={slug}
                readingTime={readingTime}
              />
            </div>
          </dl>
        </div>
        <GradientDivider />
        <div className="prose prose-lg max-w-none dark:prose-invert blog-content">
          {children}
        </div>
        <GradientDivider className="mt-1 mb-10" />
        <div className="space-y-8">
          {/* <div className="flex justify-between gap-4">
            <div className="flex items-center gap-2">
              <DiscussOnX postUrl={postUrl} />
              <span className="text-gray-500">/</span>
              <EditOnGithub filePath={filePath} />
            </div>
            <SocialShare postUrl={postUrl} filePath={filePath} title={title} />
          </div> */}
          {giscusConfig && <Comments config={giscusConfig} />}
        </div>
      </article>
    </Container>
  )
}
