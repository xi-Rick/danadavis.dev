import { allBlogs, allSnippets } from 'contentlayer/generated'
import type { MetadataRoute } from 'next'
import { SITE_METADATA } from '~/data/site-metadata'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = SITE_METADATA.siteUrl
  const currentDate = new Date().toISOString()

  // Blog routes with priority and change frequency
  const blogRoutes = allBlogs
    .filter((p) => !p.draft)
    .map(({ path, lastmod, date }) => ({
      url: `${siteUrl}/${path}`,
      lastModified: lastmod || date,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

  // Snippet routes with priority and change frequency
  const snippetRoutes = allSnippets
    .filter((s) => !s.draft)
    .map(({ path, lastmod, date }) => ({
      url: `${siteUrl}/snippets/${path}`,
      lastModified: lastmod || date,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

  // Static routes with different priorities based on importance
  const staticRoutes = [
    {
      route: '',
      priority: 1.0,
      changeFrequency: 'daily' as const,
    },
    {
      route: 'blog',
      priority: 0.9,
      changeFrequency: 'daily' as const,
    },
    {
      route: 'snippets',
      priority: 0.8,
      changeFrequency: 'weekly' as const,
    },
    {
      route: 'projects',
      priority: 0.7,
      changeFrequency: 'monthly' as const,
    },
    {
      route: 'about',
      priority: 0.6,
      changeFrequency: 'monthly' as const,
    },
    {
      route: 'books',
      priority: 0.5,
      changeFrequency: 'weekly' as const,
    },
    {
      route: 'movies',
      priority: 0.5,
      changeFrequency: 'weekly' as const,
    },
    {
      route: 'tags',
      priority: 0.4,
      changeFrequency: 'weekly' as const,
    },
  ].map(({ route, priority, changeFrequency }) => ({
    url: `${siteUrl}/${route}`,
    lastModified: currentDate,
    changeFrequency,
    priority,
  }))

  return [...staticRoutes, ...blogRoutes, ...snippetRoutes]
}
