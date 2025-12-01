import Link from 'next/link'
import { genPageMetadata } from '~/app/seo'
import Comments from '~/components/blog/comments'
import BuyButton from '~/components/shop/buy-button'
import { Badge } from '~/components/ui/badge'
import { CometCard } from '~/components/ui/comet-card'
import { Container } from '~/components/ui/container'
import { GradientBorder } from '~/components/ui/gradient-border'
import { GrowingUnderline } from '~/components/ui/growing-underline'
import { Image } from '~/components/ui/image'
import { PageHeader } from '~/components/ui/page-header'
import { TiltedGridBackground } from '~/components/ui/tilted-grid-background'
import { Twemoji } from '~/components/ui/twemoji'
import { SITE_METADATA } from '~/data/site-metadata'
import { getShopItemBySlug } from '~/db/queries'
import { getCommentsBySlug } from '~/db/queries'

type ShopItem = {
  id: string
  title: string
  slug: string
  price?: number
  target?: number
  contributed?: number
  currency: string
  summary: string
  description: string
  images?: string[]
}

async function loadShopBySlugFromDatabase(
  slug: string,
): Promise<ShopItem | null> {
  try {
    const item = await getShopItemBySlug(slug)
    if (!item) return null

    return {
      id: item.id,
      title: item.title,
      slug: item.slug,
      // Prefer explicit price, but fall back to contributed for older rows
      price: item.target ? undefined : item.contributed,
      target: item.target || undefined,
      contributed: item.contributed,
      currency: item.currency,
      summary: item.summary,
      description: item.description,
      images: item.images,
    }
  } catch (error) {
    console.error('Error loading shop item by slug:', error)
    return null
  }
}

export async function generateMetadata({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const item = await loadShopBySlugFromDatabase(slug)

  return genPageMetadata({
    title: item?.title || 'Shop item',
    description: item?.summary || item?.description || '',
    image: item?.images?.[0] || undefined,
  })
}

export default async function ProductDetail({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const item = await loadShopBySlugFromDatabase(slug)

  if (!item) {
    return (
      <Container className="pt-4 lg:pt-12">
        <PageHeader title="Not Found" description="Product not found" />
      </Container>
    )
  }

  const image = item.images?.[0] || '/static/images/shop-96.png'
  const postUrl = `${SITE_METADATA.siteUrl}/shop/${slug}`
  const comments = await getCommentsBySlug(`shop-${slug}`)

  return (
    <Container className="pt-4 lg:pt-12">
      {/* Back Button */}
      <GrowingUnderline>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-green-400 transition-colors mb-6"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Shop
        </Link>
      </GrowingUnderline>

      <PageHeader
        title={item.title}
        description={item.summary}
        className="border-b border-gray-200 dark:border-gray-700"
      />

      <div className="mx-auto max-w-[95vw] sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-6xl">
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Product Image Section (no border) */}
          <div className="rounded-3xl p-8 bg-white dark:bg-transparent flex items-center justify-center min-h-[400px] overflow-hidden relative">
            {item.images && item.images.length > 0 ? (
              <Image
                src={image}
                alt={item.title}
                width={720}
                height={540}
                className="w-full rounded-lg object-cover"
              />
            ) : item.slug.includes('coffee') || /coffee/i.test(item.title) ? (
              <Twemoji emoji="coffee" size="5x" />
            ) : (
              <div className="p-12 text-gray-700 dark:text-gray-300">
                <Twemoji emoji="package" size="5x" />
              </div>
            )}
          </div>

          {/* Product Details Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="prose max-w-none dark:prose-invert text-gray-700 dark:text-gray-300">
              <p>{item.description}</p>
            </div>

            {/* Price and Purchase */}
            <GradientBorder className="rounded-3xl p-6 bg-white dark:bg-black relative">
              {item.price ? (
                <>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      ${item.price}
                    </div>
                    <Badge
                      variant="outline"
                      className="border-orange-200 text-orange-600 dark:border-green-700 dark:text-green-500"
                    >
                      Available
                    </Badge>
                  </div>
                  <BuyButton
                    slug={item.slug}
                    title={item.title}
                    price={item.price}
                  />
                </>
              ) : item.target ? (
                <>
                  <div className="mb-6 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">
                        ${item.contributed || 0} / ${item.target}
                      </div>
                      <Badge
                        variant="outline"
                        className="border-orange-200 text-orange-600 dark:border-green-700 dark:text-green-500"
                      >
                        {(item.contributed || 0) >= item.target
                          ? 'Completed'
                          : 'Contributing'}
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-orange-500 to-orange-600 dark:from-green-500 dark:to-green-600 h-3 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(((item.contributed || 0) / item.target) * 100, 100)}%`,
                        }}
                      />
                    </div>
                    <p className="text-center text-lg text-gray-600 dark:text-gray-400">
                      ${(item.target - (item.contributed || 0)).toFixed(2)}{' '}
                      remaining
                    </p>
                  </div>
                  <BuyButton
                    slug={item.slug}
                    title={item.title}
                    target={item.target}
                    contributed={item.contributed || 0}
                  />
                </>
              ) : null}

              <p className="mt-4 text-xs text-center text-gray-600 dark:text-gray-400">
                Secure checkout powered by Stripe.
              </p>
            </GradientBorder>

            {/* Additional Info */}
            <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
              <div className="flex items-start gap-3">
                <span className="text-orange-500 dark:text-green-500">→</span>
                <span>One-time purchase, no subscription</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-orange-500 dark:text-green-500">→</span>
                <span>
                  Helps support my work on this site and open source projects
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-orange-500 dark:text-green-500">→</span>
                <span>Questions? Reach out at dana@danadavis.dev</span>
              </div>
            </div>
          </div>
        </div>

        {/* Comments */}
        <Comments
          url={postUrl}
          identifier={`shop-${slug}`}
          title={item.title}
          postSlug={`shop-${slug}`}
          comments={comments}
        />
      </div>
    </Container>
  )
}
