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
    "Small shop — Dana's daily brew is the one product I can't live without.",
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
      className="flex min-h-[400px] flex-col rounded-[40px] p-6 [box-shadow:0_8px_32px_rgba(194,194,218,.3)] md:p-8 dark:bg-white/5 dark:shadow-none"
    >
      <TiltedGridBackground className="inset-0 z-[-1] rounded-[40px]" />
      <div className="mb-6 flex items-center gap-4">
        <div className="h-15 w-15 shrink-0">
          {item.images && item.images.length > 0 ? (
            <Image
              src={image}
              alt={item.title}
              width={100}
              height={100}
              className="h-full w-full object-contain rounded-lg"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <Twemoji emoji="coffee" size="3x" />
            </div>
          )}
        </div>
        <div className="flex flex-col items-start gap-1 pt-1">
          <h2 className="text-[22px] leading-[30px] font-bold">
            <Link href={`/shop/${item.slug}`}>
              <GrowingUnderline>{item.title}</GrowingUnderline>
            </Link>
          </h2>
        </div>
      </div>
      <p className="mb-16 line-clamp-3 grow text-lg">{item.summary}</p>
      <div className="mt-auto flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            ${item.price}
          </span>
          <span className="text-sm text-gray-500">{item.currency}</span>
        </div>
        <Link
          href={`/shop/${item.slug}`}
          className="text-sm text-orange-600 dark:text-green-400 hover:underline"
        >
          <GrowingUnderline>View details →</GrowingUnderline>
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
