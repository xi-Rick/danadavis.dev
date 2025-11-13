import { SITE_METADATA } from '~/data/site-metadata'
import { prisma } from '~/db'

export interface SiteSettings {
  id: string
  title: string
  author: string
  headerTitle: string
  description: string
  language: string
  locale: string
  siteUrl: string
  siteRepo: string
  siteLogo: string
  socialBanner: string
  faviconPath: string
  email: string
  github: string
  x: string
  youtube: string
  linkedin: string
  threads: string
  instagram: string
  buyMeACoffee: string
  paypal: string | null
  kofi: string
  goodreadsBookshelf: string | null
  imdbRatingsList: string | null
  umamiWebsiteId: string | null
  umamiShareUrl: string | null
  disqusShortname: string | null
}

let cachedSettings: SiteSettings | null = null
let cacheTime = 0
const CACHE_DURATION = 60000 // 1 minute

export async function getSiteSettings(): Promise<SiteSettings> {
  const now = Date.now()

  // Return cached settings if still valid
  if (cachedSettings && now - cacheTime < CACHE_DURATION) {
    return cachedSettings
  }

  // Skip database connection during build time
  const isBuildTime =
    process.env.NEXT_PHASE === 'phase-production-build' ||
    (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL)

  if (!isBuildTime) {
    try {
      const settings = await prisma.siteSettings.findUnique({
        where: { id: 'default' },
      })

      if (settings) {
        cachedSettings = settings
        cacheTime = now
        return settings
      }
    } catch (error) {
      // Only log database errors in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching site settings from database:', error)
      }
      // In production/build, silently fall back to static metadata
    }
  }

  // Fallback to static metadata
  return {
    id: 'default',
    title: SITE_METADATA.title,
    author: SITE_METADATA.author,
    headerTitle: SITE_METADATA.headerTitle,
    description: SITE_METADATA.description,
    language: SITE_METADATA.language,
    locale: SITE_METADATA.locale,
    siteUrl: SITE_METADATA.siteUrl,
    siteRepo: SITE_METADATA.siteRepo,
    siteLogo: SITE_METADATA.siteLogo,
    socialBanner: SITE_METADATA.socialBanner,
    faviconPath: '/favicon.ico',
    email: SITE_METADATA.email,
    github: SITE_METADATA.github,
    x: SITE_METADATA.x,
    youtube: SITE_METADATA.youtube,
    linkedin: SITE_METADATA.linkedin,
    threads: SITE_METADATA.threads,
    instagram: SITE_METADATA.instagram,
    buyMeACoffee: SITE_METADATA.support.buyMeACoffee,
    paypal: SITE_METADATA.support.paypal,
    kofi: SITE_METADATA.support.kofi,
    goodreadsBookshelf: SITE_METADATA.goodreadsBookshelfUrl,
    imdbRatingsList: SITE_METADATA.imdbRatingsList,
    umamiWebsiteId: SITE_METADATA.analytics.umamiAnalytics.websiteId || null,
    umamiShareUrl: SITE_METADATA.analytics.umamiAnalytics.shareUrl || null,
    disqusShortname: SITE_METADATA.comments.disqus.shortname || null,
  }
}

export function invalidateSiteSettingsCache() {
  cachedSettings = null
  cacheTime = 0
}
