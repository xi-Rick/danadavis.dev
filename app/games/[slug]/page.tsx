import { genPageMetadata } from '~/app/seo'
import { Badge } from '~/components/ui/badge'
import { Container } from '~/components/ui/container'
import { Image } from '~/components/ui/image'
import { Link } from '~/components/ui/link'
import { PageHeader } from '~/components/ui/page-header'
import { loadGameBySlugFromJson } from '../load-games'
// Keep aside styling in-line and consistent with other pages —
// avoid using heavyweight visual components like CometCard/GritBackground.

export async function generateMetadata({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const game = await loadGameBySlugFromJson(slug)
  return genPageMetadata({
    title: game?.title || 'Game',
    description: game?.summary || '',
    image: game?.images?.[0] || undefined,
  })
}

export default async function GameDetail({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const game = (await loadGameBySlugFromJson(slug)) || null

  if (!game) {
    return (
      <Container className="pt-4 lg:pt-12">
        <PageHeader title="Not Found" description="Game not found" />
      </Container>
    )
  }

  return (
    <Container className="pt-4 lg:pt-12">
      <PageHeader
        title={game.title}
        description={game.summary}
        className="border-b border-gray-200 dark:border-gray-700"
      />
      <div className="mx-auto max-w-[95vw] sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-7xl">
        <div className="relative overflow-hidden">
          {game.images && game.images.length > 0 && (
            <div className="mb-6">
              <div className="mt-4 p-1 rounded-2xl bg-gradient-to-br from-orange-300/40 to-green-400/40 shadow-inner">
                <Image
                  src={game.images[0]}
                  alt={game.title}
                  width={1600}
                  height={900}
                  loading="eager"
                  className="w-full rounded-2xl shadow-2xl object-cover"
                />
              </div>
            </div>
          )}

          <div className="container px-4 sm:px-6 md:px-8 mt-10">
            <div className="grid max-w-6xl gap-8 mx-auto items-start md:grid-cols-1 lg:grid-cols-3 lg:gap-12">
              <div className="space-y-4 lg:col-span-2 lg:space-y-6 overflow-x-hidden">
                {game.review && (
                  <div className="prose sm:prose-base lg:prose-lg max-w-none dark:prose-invert">
                    <blockquote className="border-l-4 pl-4 italic text-lg text-gray-700 dark:text-gray-300">
                      {game.review}
                    </blockquote>
                  </div>
                )}
              </div>

              <aside className="lg:sticky lg:top-24 space-y-6">
                <div className="w-full">
                  <div className="relative overflow-hidden rounded-xl border-2 border-black dark:border-white bg-white dark:bg-black">
                    <div className="relative z-10 p-6 rounded-xl">
                      <h3 className="text-lg font-semibold mb-4 text-orange-600 dark:text-green-500">
                        Game Details
                      </h3>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 flex items-center justify-center rounded-full bg-orange-500 dark:bg-green-500 ring-2 ring-orange-200 dark:ring-green-900">
                            <span className="text-white font-bold text-lg">
                              {game.rating?.toFixed(1)}
                            </span>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-300">
                              Rating
                            </p>
                            <p className="text-sm font-semibold text-black dark:text-white">
                              {game.rating ? `${game.rating}/10` : '—'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Released
                          </p>
                          <p className="text-sm font-semibold text-black dark:text-white">
                            {game.releaseDate}
                          </p>
                        </div>
                      </div>

                      <dl className="space-y-4 mt-4">
                        <div>
                          <dt className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            Platforms
                          </dt>
                          <dd className="mt-1 text-sm text-black dark:text-white">
                            {game.platforms?.join(', ')}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            Developer
                          </dt>
                          <dd className="mt-1 text-sm text-black dark:text-white">
                            {game.developers?.join(', ')}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            Tags
                          </dt>
                          <dd className="mt-2">
                            <div className="flex flex-wrap gap-2">
                              {game.tags?.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="capitalize border-orange-200 text-orange-600 dark:border-green-700 dark:text-green-500 bg-white dark:bg-black"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </dd>
                        </div>
                      </dl>

                      <div className="mt-6 flex flex-col gap-3">
                        {game.storeUrl && (
                          <Link
                            href={game.storeUrl}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg text-white bg-orange-500 dark:bg-green-500 hover:opacity-90 transition-all"
                          >
                            Store
                          </Link>
                        )}

                        {game.demo && (
                          <Link
                            href={game.demo}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg text-black dark:text-white bg-white dark:bg-black border-2 border-black dark:border-white hover:bg-orange-50 dark:hover:bg-green-900/20 transition-all"
                          >
                            Demo
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}
