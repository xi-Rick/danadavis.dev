import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import clsx from 'clsx'
import 'css/tailwind.css'
import 'css/twemoji.css'
import type { Metadata } from 'next'
import {
  Geist_Mono,
  JetBrains_Mono,
  Nunito,
  Playpen_Sans,
} from 'next/font/google'
import { PersonJsonLd, WebsiteJsonLd } from '~/components/structured-data'
import 'react-medium-image-zoom/dist/styles.css'
import 'remark-github-blockquote-alert/alert.css'
import { UmamiAnalytics } from '~/components/analytics/umami'
import { Footer } from '~/components/footer'
import { Header } from '~/components/header'
import { KBarSearchProvider } from '~/components/search/kbar-provider'
import Ascii from '~/components/ui/ascii'
import AutoPlayAudio from '~/components/ui/autoplay'
import PageTransitionWrapper from '~/components/ui/page-transition-wrapper'
import { TiltedGridBackground } from '~/components/ui/tilted-grid-background'
import { SITE_METADATA } from '~/data/site-metadata'
import { AuthProvider } from './auth-provider'
import { ThemeProviders } from './theme-providers'

const FONT_PLAYPEN_SANS = Playpen_Sans({
  subsets: ['latin'],
  display: 'swap',
  weight: ['800'],
  variable: '--font-playpen-sans',
  preload: false,
})

const FONT_NUNITO = Nunito({
  subsets: ['latin'],
  display: 'swap',
  style: ['normal', 'italic'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-nunito',
  preload: false,
})

const FONT_GEIST = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  style: ['normal'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-geist',
  preload: false,
})

const FONT_JETBRAINS_MONO = JetBrains_Mono({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
  preload: false,
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_METADATA.siteUrl),
  title: {
    default: SITE_METADATA.title,
    template: `%s | ${SITE_METADATA.title}`,
  },
  description: SITE_METADATA.description,
  authors: [{ name: SITE_METADATA.author, url: SITE_METADATA.siteUrl }],
  creator: SITE_METADATA.author,
  publisher: SITE_METADATA.author,
  openGraph: {
    title: SITE_METADATA.title,
    description: SITE_METADATA.description,
    url: './',
    siteName: SITE_METADATA.title,
    images: [
      {
        url: SITE_METADATA.socialBanner,
        width: 1200,
        height: 630,
        alt: `${SITE_METADATA.title} - Banner Image`,
      },
    ],
    locale: SITE_METADATA.locale,
    type: 'website',
    countryName: 'United States',
  },
  alternates: {
    canonical: './',
    types: {
      'application/rss+xml': `${SITE_METADATA.siteUrl}/feed.xml`,
    },
    languages: {
      'en-US': '/',
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
      noimageindex: false,
    },
  },
  twitter: {
    title: SITE_METADATA.title,
    card: 'summary_large_image',
    images: [SITE_METADATA.socialBanner],
    creator: '@cortrale',
    site: '@cortrale',
    description: SITE_METADATA.description,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || '',
    other: {
      'msvalidate.01': process.env.NEXT_PUBLIC_MS_VALIDATE || '',
    },
  },
  keywords: [
    'Dana Davis',
    'Software Development',
    'Web Development',
    'Programming',
    'Tech Blog',
    'JavaScript',
    'TypeScript',
    'React',
    'Next.js',
    'Developer Portfolio',
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const basePath = process.env.BASE_PATH || ''

  return (
    <html
      lang={SITE_METADATA.language}
      className={clsx(
        'w-full overflow-x-hidden scroll-smooth antialiased lowercase',
        FONT_NUNITO.variable,
        FONT_JETBRAINS_MONO.variable,
        FONT_PLAYPEN_SANS.variable,
        FONT_GEIST.variable,
      )}
      suppressHydrationWarning
    >
      <head>
        <WebsiteJsonLd />
        <PersonJsonLd />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href={`${basePath}/static/favicons/favicon.ico`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={`${basePath}/static/favicons/favicon.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={`${basePath}/static/favicons/favicon.png`}
        />
        <link
          rel="manifest"
          href={`${basePath}/static/favicons/site.webmanifest`}
        />
        <link
          rel="mask-icon"
          href={`${basePath}/static/favicons/safari-pinned-tab.svg`}
          color="#5bbad5"
        />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: light)"
          content="#fff"
        />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: dark)"
          content="#000"
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          href={`${basePath}/feed.xml`}
        />
      </head>
      <body
        className={clsx([
          'antialiased',
          'relative min-h-screen pl-[calc(100vw-100%)]',
          'flex flex-col',
          'bg-white text-neutral-900',
          'dark:bg-dark dark:text-gray-100',
        ])}
      >
        <TiltedGridBackground className="inset-x-0 top-0 z-[-1] h-[50vh]" />
        <ThemeProviders>
          <AuthProvider>
            <AutoPlayAudio />
            <Ascii />
            <Analytics />
            <UmamiAnalytics
              websiteId={SITE_METADATA.analytics.umamiAnalytics.websiteId}
            />
            <KBarSearchProvider configs={SITE_METADATA.search.kbarConfigs}>
              <Header />
              <main className="mb-auto grow">
                <PageTransitionWrapper>{children}</PageTransitionWrapper>
              </main>
            </KBarSearchProvider>
            <Footer />
          </AuthProvider>
        </ThemeProviders>
        <SpeedInsights />
      </body>
    </html>
  )
}
