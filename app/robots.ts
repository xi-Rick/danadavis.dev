import type { MetadataRoute } from 'next'
import { SITE_METADATA } from '~/data/site-metadata'

const AI_CRAWLERS_DISALLOW = [
  '/api/',
  '/admin/',
  '/_next/',
  '/books/',
  '/movies/',
]
const AI_CRAWLERS_ALLOW = ['/', '/blog/', '/snippets/', '/projects/', '/about/']
const AI_BOT_AGENTS = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'anthropic-ai',
  'Claude-Web',
  'ClaudeBot',
  'Google-Extended',
  'PerplexityBot',
  'Bytespider',
  'CCBot',
  'cohere-ai',
  'FacebookBot',
  'Applebot-Extended',
  'YouBot',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/', '/*.json', '/*.xml'],
      },
      ...AI_BOT_AGENTS.map((userAgent) => ({
        userAgent,
        allow: AI_CRAWLERS_ALLOW,
        disallow: AI_CRAWLERS_DISALLOW,
      })),
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/'],
      },
    ],
    sitemap: `${SITE_METADATA.siteUrl}/sitemap.xml`,
    host: SITE_METADATA.siteUrl,
  }
}
