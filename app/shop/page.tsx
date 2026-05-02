import Image from 'next/image'
import Link from 'next/link'
import { genPageMetadata } from '~/app/seo'
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
    "Welcome to Dana's personal shop — with a twist: everything here is for me. It's a curated list of things I love, use, or need, shared so you can treat me to something that fuels my creativity and daily life.",
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

function ShopItemCard({ item }: { item: ShopItem }) {
  const image = item.images?.[0] || '/static/images/shop-96.png'
  const isFundingGoal = !!item.target
  const progress = isFundingGoal
    ? Math.min(((item.contributed || 0) / item.target!) * 100, 100)
    : 0

  return (
    <GradientBorder
      offset={28}
      className="flex min-h-[400px] flex-col rounded-[40px] p-6 md:p-8 [box-shadow:0_8px_32px_rgba(194,194,218,.3)] dark:bg-white/5 dark:shadow-none"
    >
      <TiltedGridBackground className="inset-0 z-[-1] rounded-[40px]" />
      <div className="mb-6 flex items-center gap-4">
        <div className="h-14 w-14 shrink-0">
          {item.images && item.images.length > 0 ? (
            <Image
              src={image}
              alt={item.title}
              width={56}
              height={56}
              className="h-full w-full object-contain rounded-xl"
            />
          ) : (
            <Twemoji emoji="coffee" size="3x" />
          )}
        </div>
        <div className="flex flex-col items-start gap-1 pt-1">
          <h2 className="text-[22px] leading-[30px] font-bold">
            <Link
              href={`/shop/${item.slug}`}
              aria-label={`View details for ${item.title}`}
            >
              <GrowingUnderline>{item.title}</GrowingUnderline>
            </Link>
          </h2>
          {item.featured && (
            <Badge className="bg-orange-500 text-white dark:bg-green-500 dark:text-black">
              Featured
            </Badge>
          )}
        </div>
      </div>

      <p className="mb-8 line-clamp-3 grow text-lg text-gray-700 dark:text-gray-300">
        {item.summary}
      </p>

      <div className="mt-auto space-y-3">
        {isFundingGoal ? (
          <>
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>${item.contributed || 0} contributed</span>
              <span>
                Goal: ${item.target} {item.currency}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-orange-500 to-orange-600 dark:from-green-500 dark:to-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </>
        ) : (
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            ${item.price}
            <span className="ml-1.5 text-sm font-normal text-gray-500 dark:text-gray-400">
              {item.currency}
            </span>
          </div>
        )}
      </div>
    </GradientBorder>
  )
}

export default async function ShopPage() {
  const products = await loadShopFromDatabase()
  const sortedProducts = products.sort(
    (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0),
  )

  return (
    <Container className="pt-4 lg:pt-12">
      <PageHeader
        title="Shop"
        description="Simple, important things I care about — buying them is a way to support me and help keep a creative person going."
        className="border-b border-gray-200 dark:border-gray-700"
      />
      <div className="py-8 md:py-12">
        {sortedProducts.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400">
            No products available.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {sortedProducts.map((item) => (
              <ShopItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </Container>
  )
}
