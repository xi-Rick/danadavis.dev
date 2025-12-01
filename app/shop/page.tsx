import { promises as fs } from 'node:fs'
import path from 'node:path'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import { genPageMetadata } from '~/app/seo'
import { Badge } from '~/components/ui/badge'
import { Container } from '~/components/ui/container'
import { GradientBorder } from '~/components/ui/gradient-border'
import { GradientDivider } from '~/components/ui/gradient-divider'
import { GrowingUnderline } from '~/components/ui/growing-underline'
import { PageHeader } from '~/components/ui/page-header'
import { TiltedGridBackground } from '~/components/ui/tilted-grid-background'
import { Twemoji } from '~/components/ui/twemoji'

export const metadata = genPageMetadata({
  title: 'Shop',
  description:
    'Welcome to Dana’s personal shop — with a twist: everything here is for me. It’s a curated list of things I love, use, or need, shared so you can treat me to something that fuels my creativity and daily life.',
})

type ShopItem = {
  id: string
  title: string
  slug: string
  price: number
  currency: string
  summary: string
  description: string
  images?: string[]
  featured?: boolean
}

async function loadShopFromJson(): Promise<ShopItem[]> {
  try {
    const filePath = path.join(process.cwd(), 'json', 'shop.json')
    const fileContents = await fs.readFile(filePath, 'utf8')
    const data = JSON.parse(fileContents) as ShopItem[]
    return data
  } catch (error) {
    console.error('Error loading shop JSON:', error)
    return []
  }
}
function ProductCard({ item }: { item: ShopItem }) {
  const image = item.images?.[0] || '/static/images/shop-96.png'

  return (
    <GradientBorder
      offset={28}
      className="flex min-h-[420px] flex-col rounded-[40px] p-6 md:p-8 [box-shadow:0_12px_48px_rgba(194,194,218,.4)] hover:[box-shadow:0_16px_64px_rgba(194,194,218,.5)] transition-all duration-300 dark:bg-white/5 dark:shadow-none"
    >
      <TiltedGridBackground className="inset-0 z-[-1] rounded-[40px]" />

      {/* Image Section - Now Larger */}
      <div className="mb-6 flex items-center justify-center">
        <div className="h-24 w-24 md:h-28 md:w-28 shrink-0">
          {item.images && item.images.length > 0 ? (
            <Image
              src={image}
              alt={item.title}
              width={112}
              height={112}
              className="h-full w-full object-contain rounded-2xl"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-50 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl">
              <Twemoji emoji="coffee" size="4x" />
            </div>
          )}
        </div>
      </div>

      {/* Title Section */}
      <div className="mb-6 text-center">
        <h2 className="text-[28px] md:text-[32px] leading-[36px] md:leading-[42px] font-bold mb-2">
          <Link href={`/shop/${item.slug}`}>
            <GrowingUnderline>{item.title}</GrowingUnderline>
          </Link>
        </h2>
      </div>

      {/* Description */}
      <p className="mb-6 line-clamp-3 grow text-base md:text-lg text-center text-gray-700 dark:text-gray-300 leading-relaxed">
        {item.summary}
      </p>

      {/* Price and CTA Section */}
      <div className="mt-auto space-y-4">
        <div className="flex items-center justify-center gap-2 pb-4 border-b border-gray-200 dark:border-gray-700">
          <span className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            ${item.price}
          </span>
          <span className="text-base text-gray-500 dark:text-gray-400">
            {item.currency}
          </span>
        </div>
        <Link
          href={`/shop/${item.slug}`}
          className="block w-full text-center py-4 px-6 bg-gradient-to-r from-orange-500 to-orange-600 dark:from-green-500 dark:to-green-600 text-white font-semibold rounded-2xl hover:from-orange-600 hover:to-orange-700 dark:hover:from-green-600 dark:hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          View Details →
        </Link>
      </div>
    </GradientBorder>
  )
}

export default async function ShopPage() {
  const products = await loadShopFromJson()

  return (
    <Container className="pt-4 lg:pt-12">
      <PageHeader
        title="Shop"
        description={
          <p className="text-lg">
            Simple, handcrafted things I care about — right now it&apos;s one
            small-batch coffee that I drink every day. Buying it is a way to
            support me (Dana) and help keep the site going.
          </p>
        }
        className="border-b border-gray-200 dark:border-gray-700"
      />

      <div className="py-8">
        <Suspense
          fallback={
            <div className="text-center py-12 text-gray-600 dark:text-gray-400">
              Loading products...
            </div>
          }
        >
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {products.length === 0 ? (
              <div className="text-center py-12 text-gray-600 dark:text-gray-400">
                No products available.
              </div>
            ) : (
              products.map((p) => <ProductCard key={p.id} item={p} />)
            )}
          </div>
        </Suspense>
      </div>
    </Container>
  )
}
