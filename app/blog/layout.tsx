import type { Metadata } from 'next'
import { SITE_METADATA } from '~/data/site-metadata'

export const metadata: Metadata = {
  title: `Blog – ${SITE_METADATA.headerTitle}`,
  description: SITE_METADATA.description,
  openGraph: {
    title: `Blog – ${SITE_METADATA.headerTitle}`,
    description: SITE_METADATA.description,
    url: `${SITE_METADATA.siteUrl}/blog`,
    siteName: SITE_METADATA.title,
    images: [SITE_METADATA.socialBanner],
    locale: SITE_METADATA.locale,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Blog – ${SITE_METADATA.headerTitle}`,
    description: SITE_METADATA.description,
    images: [SITE_METADATA.socialBanner],
  },
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
