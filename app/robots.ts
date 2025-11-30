import type { MetadataRoute } from 'next'
import { SITE_METADATA } from '~/data/site-metadata'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/', '/*.json', '/*.xml'],
      },
      {
        userAgent: 'GPTBot',
        allow: ['/', '/blog/', '/snippets/', '/projects/', '/about/'],
        disallow: ['/api/', '/admin/', '/_next/', '/books/', '/movies/'],
      },
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
