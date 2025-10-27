import { SITE_METADATA } from '~/data/site-metadata'

type BlogPostStructuredData = {
  title: string
  description: string
  date: string
  lastmod?: string
  url: string
  images?: string[]
  authors?: { name: string; url: string }[]
}

export function BlogJsonLd({
  title,
  description,
  date,
  lastmod,
  url,
  images = [],
  authors = [{ name: SITE_METADATA.author, url: SITE_METADATA.siteUrl }],
}: BlogPostStructuredData) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    author: authors.map((author) => ({
      '@type': 'Person',
      name: author.name,
      url: author.url,
    })),
    datePublished: date,
    dateModified: lastmod || date,
    image: images.length > 0 ? images : [SITE_METADATA.socialBanner],
    url: url,
    publisher: {
      '@type': 'Person',
      name: SITE_METADATA.author,
      url: SITE_METADATA.siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: SITE_METADATA.siteLogo,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

export function WebsiteJsonLd() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_METADATA.title,
    description: SITE_METADATA.description,
    url: SITE_METADATA.siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_METADATA.siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
    author: {
      '@type': 'Person',
      name: SITE_METADATA.author,
      url: SITE_METADATA.siteUrl,
      sameAs: [
        SITE_METADATA.github,
        SITE_METADATA.x,
        SITE_METADATA.linkedin,
        SITE_METADATA.instagram,
      ],
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

export function PersonJsonLd() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE_METADATA.author,
    url: SITE_METADATA.siteUrl,
    sameAs: [
      SITE_METADATA.github,
      SITE_METADATA.x,
      SITE_METADATA.linkedin,
      SITE_METADATA.instagram,
    ],
    jobTitle: 'Software Developer',
    worksFor: {
      '@type': 'Organization',
      name: 'Independent',
    },
    image: SITE_METADATA.siteLogo,
    description: `${SITE_METADATA.author} is a software developer and technical writer focusing on web development, JavaScript, TypeScript, and modern web frameworks.`,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
