import { useMemo } from 'react'
import type { Blog, Snippet } from '~/.contentlayer/generated'
import { Container } from '~/components/ui/container'
import { HeroParallax } from '~/components/ui/hero-parallax'
import { PROJECTS } from '~/data/projects'
import { SITE_METADATA } from '~/data/site-metadata'
import type { CoreContent } from '~/types/data'
import { ActivitiesFeed } from './activities/feed'
import { LatestPosts } from './latest-posts'

export function Home({
  posts,
  snippets,
  projects = [],
}: {
  posts: CoreContent<Blog>[]
  snippets: CoreContent<Snippet>[]
  projects?: {
    title: string
    link: string
    thumbnail: string
    type?: 'project' | 'blog'
  }[]
}) {
  // Prepare projects for HeroParallax
  const projectsForParallax = useMemo(() => {
    const projectList = projects.length
      ? projects
      : PROJECTS.slice(0, 10)
          .filter((project) => project.repo)
          .map((project) => {
            const slug = project.title
              .toLowerCase()
              .replace(/[^\w\s-]/g, '')
              .replace(/\s+/g, '-')

            return {
              title: project.title,
              link: `/projects/${slug}`,
              thumbnail: project.imgSrc,
              type: 'project' as const,
            }
          })

    const postList = posts.slice(0, 5).map((post) => ({
      title: post.title,
      link: `/blog/${post.slug}`,
      thumbnail: post.images?.[0] || SITE_METADATA.socialBanner,
      type: 'blog' as const,
    }))

    return [...projectList, ...postList]
  }, [posts, projects])

  const admin = useMemo(
    () => ({
      name: SITE_METADATA.author,
      introduction:
        'A web dev based in the US. Turning ideas into reality through efficient and creative coding.',
    }),
    [],
  )

  return (
    <>
      <HeroParallax projects={projectsForParallax} admin={admin} />
      <Container as="div" className="space-y-6 pt-4 md:space-y-24 lg:pt-12">
        <LatestPosts posts={posts} snippets={snippets} />
        <ActivitiesFeed />
      </Container>
    </>
  )
}
