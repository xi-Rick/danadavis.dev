import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Suspense } from 'react'
import { genPageMetadata } from '~/app/seo'
import { AutoScrollStrip } from '~/components/shop/auto-scroll-strip'
import { DealsStrip } from '~/components/shop/deals-strip'
import { Badge } from '~/components/ui/badge'
import { Container } from '~/components/ui/container'
import { GradientBorder } from '~/components/ui/gradient-border'
import { GrowingUnderline } from '~/components/ui/growing-underline'
import { PageHeader } from '~/components/ui/page-header'
import { TiltedGridBackground } from '~/components/ui/tilted-grid-background'
import { Twemoji } from '~/components/ui/twemoji'
import { getShopItems } from '~/db/queries'

export const metadata = genPageMetadata({
  title: 'Shop',
  description:
    'Welcome to Dana’s personal shop — with a twist: everything here is for me. It’s a curated list of things I love, use, or need, shared so you can treat me to something that fuels my creativity and daily life.',
})

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
  featured?: boolean
}

async function loadShopFromDatabase(): Promise<ShopItem[]> {
  try {
    const items = await getShopItems()
    return items.map((item) => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      price: item.target ? undefined : item.contributed,
      target: item.target || undefined,
      contributed: item.contributed,
      currency: item.currency,
      summary: item.summary,
      description: item.description,
      images: item.images,
      featured: item.featured,
    }))
  } catch (error) {
    console.error('Error loading shop from database:', error)
    return []
  }
}
function ProductCard({ item }: { item: ShopItem }) {
  const image = item.images?.[0] || '/static/images/shop-96.png'

  return (
    <GradientBorder
      offset={28}
      className="flex min-h-[320px] flex-col rounded-[24px] p-4 md:p-6 [box-shadow:0_8px_32px_rgba(194,194,218,.3)] transition-all duration-300 dark:bg-white/5 dark:shadow-none relative"
    >
      {item.featured && (
        <Badge className="absolute top-4 right-4 bg-orange-500 text-white dark:bg-green-500">
          Featured
        </Badge>
      )}
      <TiltedGridBackground className="inset-0 z-[-1] rounded-[24px]" />

      {/* Image Section */}
      <div className="mb-4 flex items-center justify-center">
        <div className="h-20 w-20 md:h-24 md:w-24 shrink-0">
          {item.images && item.images.length > 0 ? (
            <Image
              src={image}
              alt={item.title}
              width={96}
              height={96}
              className="h-full w-full object-contain rounded-xl"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-50 dark:from-green-900/20 dark:to-green-800/20 rounded-xl">
              <Twemoji emoji="coffee" size="3x" />
            </div>
          )}
        </div>
      </div>

      {/* Title Section */}
      <div className="mb-4 text-center">
        <h2 className="text-[20px] md:text-[24px] leading-[28px] md:leading-[32px] font-bold mb-2">
          <Link href={`/shop/${item.slug}`}>
            <GrowingUnderline>{item.title}</GrowingUnderline>
          </Link>
        </h2>
      </div>

      {/* Description */}
      <p className="mb-4 line-clamp-2 grow text-sm md:text-base text-center text-gray-700 dark:text-gray-300 leading-relaxed">
        {item.summary}
      </p>

      {/* Price and CTA Section */}
      <div className="mt-auto space-y-3">
        {item.price ? (
          <div className="flex items-center justify-center gap-2 pb-3 border-b border-gray-200 dark:border-gray-700">
            <span className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              ${item.price}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {item.currency}
            </span>
          </div>
        ) : item.target ? (
          <div className="pb-3 border-b border-gray-200 dark:border-gray-700 space-y-1">
            {/* Show the funding target prominently like a price */}
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                ${item.target}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {item.currency}
              </span>
            </div>
            {/* Secondary line: current contributed / target and progress */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <span>${item.contributed || 0} contributed</span>
              <span>•</span>
              <span>{`$${(item.target - (item.contributed || 0)).toFixed(2)} to go`}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-orange-500 to-orange-600 dark:from-green-500 dark:to-green-600 h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(((item.contributed || 0) / item.target) * 100, 100)}%`,
                }}
              />
            </div>
            {/* keep the small progress element below for visual guidance */}
          </div>
        ) : null}
        <Link
          href={`/shop/${item.slug}`}
          className="block w-full text-center py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-600 dark:from-green-500 dark:to-green-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 dark:hover:from-green-600 dark:hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg text-sm md:text-base"
        >
          {item.price ? 'View Details →' : 'Contribute →'}
        </Link>
      </div>
    </GradientBorder>
  )
}

export default async function ShopPage() {
  const products = await loadShopFromDatabase()
  const sortedProducts = products.sort(
    (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0),
  )
  const deals = sortedProducts.slice(0, 8)
  const remaining = sortedProducts.slice(8)

  return (
    <Container className="pt-4 lg:pt-12">
      <PageHeader
        title="Shop"
        description={
          <p className="text-lg">
            Simple, important things I care about — Buying them is a way to
            support me (Dana) and help keep a creative person going.
          </p>
        }
        className="border-b border-gray-200 dark:border-gray-700"
      />

      <div className="py-8">
        {/* Deals strip — a compact, horizontally scrollable list for featured/today's deals */}
        {deals.length > 0 && <DealsStrip items={deals} />}
        {/* Auto-scrolling design carousel (promotional slides) — always render so page looks lively */}
        <AutoScrollStrip />
        <Suspense
          fallback={
            <div className="text-center py-12 text-gray-600 dark:text-gray-400">
              Loading products...
            </div>
          }
        >
          {products.length === 0 ? (
            <div className="text-center py-12 text-gray-600 dark:text-gray-400">
              No products available.
            </div>
          ) : (
            remaining.length > 0 && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {remaining.map((p) => (
                  <ProductCard key={p.id} item={p} />
                ))}
              </div>
            )
          )}
        </Suspense>
      </div>
    </Container>
  )
}
