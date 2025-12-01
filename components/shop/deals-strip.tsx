'use client'

import Image from 'next/image'
import Link from 'next/link'
import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { GradientBorder } from '~/components/ui/gradient-border'
import { GrowingUnderline } from '~/components/ui/growing-underline'

export type DealItem = {
  id: string
  title: string
  slug: string
  price?: number
  currency: string
  summary?: string
  images?: string[]
  featured?: boolean
}

export const DealsStrip: React.FC<{ items: DealItem[] }> = ({ items }) => {
  const [liked, setLiked] = useState<Record<string, boolean>>({})

  const toggleLiked = (id: string) => {
    setLiked((s) => ({ ...s, [id]: !s[id] }))
  }

  const scrollerRef = useRef<HTMLDivElement | null>(null)

  const scrollByDistance = (distance: number) => {
    if (!scrollerRef.current) return
    scrollerRef.current.scrollBy({ left: distance, behavior: 'smooth' })
  }

  const scrollLeft = () =>
    scrollByDistance(-scrollerRef.current!.clientWidth / 1.8)
  const scrollRight = () =>
    scrollByDistance(scrollerRef.current!.clientWidth / 1.8)

  // Keyboard accessibility for the scroller
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      scrollLeft()
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      scrollRight()
    } else if (e.key === 'Home') {
      scrollerRef.current?.scrollTo({ left: 0, behavior: 'smooth' })
    } else if (e.key === 'End') {
      scrollerRef.current?.scrollTo({
        left: scrollerRef.current.scrollWidth,
        behavior: 'smooth',
      })
    }
  }

  // Persist favorites in localStorage so mobile/desktop see the same likes
  useEffect(() => {
    try {
      const saved = localStorage.getItem('deals-strip-liked')
      if (saved) setLiked(JSON.parse(saved))
    } catch (err) {
      // ignore
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('deals-strip-liked', JSON.stringify(liked))
    } catch (_) {
      // ignore
    }
  }, [liked])

  return (
    <section aria-labelledby="todays-deals" className="mb-10 md:mb-14">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 id="todays-deals" className="text-2xl font-bold">
            Today&apos;s Deals
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            All for purchase...<span className="italic">for me</span>
          </p>
        </div>
      </div>

      <div className="relative group">
        {/* arrows */}
        <button
          type="button"
          aria-label="Scroll left"
          onClick={scrollLeft}
          className="absolute left-2 top-1/2 z-20 -translate-y-1/2 h-9 w-9 rounded-full bg-black/40 ring-1 ring-white/10 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-orange-300 dark:focus:ring-green-300 transition-opacity duration-200 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:pointer-events-none md:group-hover:pointer-events-auto"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-orange-400 dark:text-green-400"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <button
          type="button"
          aria-label="Scroll right"
          onClick={scrollRight}
          className="absolute right-2 top-1/2 z-20 -translate-y-1/2 h-9 w-9 rounded-full bg-black/40 ring-1 ring-white/10 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-orange-300 dark:focus:ring-green-300 transition-opacity duration-200 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:pointer-events-none md:group-hover:pointer-events-auto"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-orange-400 dark:text-green-400"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        <section
          ref={scrollerRef}
          onKeyDown={handleKeyDown}
          aria-label="Today's deals — horizontal scroller. Use left and right arrows to navigate."
          className="overflow-x-auto py-3 -mx-4 px-4 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8 scrollbar-hide focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 dark:focus-visible:ring-green-300"
          style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
        >
          <div className="flex items-stretch gap-3 sm:gap-4 md:gap-6 scroll-px-4 md:scroll-px-8 scroll-smooth touch-pan-x snap-x snap-mandatory">
            {items.map((it) => {
              const firstImage = it.images?.[0] ?? null

              return (
                <GradientBorder
                  key={it.id}
                  offset={12}
                  className="w-[140px] sm:w-[180px] md:w-[220px] lg:w-[280px] rounded-xl p-0 shrink-0 snap-center md:snap-start"
                >
                  {/* Use light surface for light mode, black surfaces in dark mode - no blue/grey tints */}
                  <article className="bg-white/60 dark:bg-black/55 rounded-[12px] p-2.5 sm:p-3 md:p-5 shadow-sm flex flex-col gap-2 sm:gap-3 md:gap-4 h-full min-h-[240px] sm:min-h-[280px] md:min-h-[360px]">
                    <div className="relative">
                      {/* Image area is square — keep images centered and contained */}
                      <Link href={`/shop/${it.slug}`} className="block">
                        <div className="w-full aspect-square bg-gradient-to-br from-black/10 via-black/5 to-black/5 dark:from-black/70 dark:via-black/55 dark:to-black/45 rounded-lg flex items-center justify-center overflow-hidden relative">
                          {firstImage ? (
                            <Image
                              src={firstImage}
                              alt={it.title}
                              width={320}
                              height={320}
                              className="object-contain h-full w-full"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">
                              No image
                            </div>
                          )}
                        </div>
                      </Link>

                      {it.featured && (
                        <span className="absolute left-2 sm:left-3 top-2 sm:top-3 inline-flex items-center rounded-full bg-green-500/95 text-[10px] sm:text-xs text-white px-1.5 sm:px-2 py-0.5 font-semibold shadow-sm z-[30]">
                          featured
                        </span>
                      )}

                      <button
                        aria-label={
                          liked[it.id] ? 'Remove favorite' : 'Add favorite'
                        }
                        aria-pressed={!!liked[it.id]}
                        onClick={() => toggleLiked(it.id)}
                        className={`absolute top-2 sm:top-3 right-2 sm:right-3 inline-flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full border bg-white/95 dark:bg-black/60 shadow-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-orange-300 dark:focus:ring-green-300 ${
                          liked[it.id] ? 'opacity-100' : 'opacity-90'
                        }`}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          width="14"
                          height="14"
                          className="sm:w-4 sm:h-4"
                          fill={liked[it.id] ? '#ef4444' : 'none'}
                          stroke={liked[it.id] ? '#ef4444' : 'currentColor'}
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex-1">
                      <Link
                        href={`/shop/${it.slug}`}
                        className="text-base sm:text-lg md:text-xl font-semibold leading-snug block line-clamp-2 hover:underline text-black dark:text-white"
                      >
                        <GrowingUnderline>{it.title}</GrowingUnderline>
                      </Link>
                      <p className=" md:text-lg dark:text-white text-black mt-1 line-clamp-2">
                        {it.summary}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-baseline gap-1 sm:gap-2">
                        {typeof it.price === 'number' ? (
                          <>
                            <span className="text-xs sm:text-sm font-bold dark:text-white text-black">
                              ${it.price.toFixed(2)}
                            </span>
                            <span className="text-[10px] sm:text-xs text-gray-400">
                              {it.currency}
                            </span>
                          </>
                        ) : typeof (it as unknown as { target?: number })
                            .target === 'number' ? (
                          <>
                            <span className="text-xs sm:text-sm font-bold dark:text-white text-black">
                              {(
                                it as unknown as { target: number }
                              ).target.toFixed(2)}
                            </span>
                            <span className="text-[10px] sm:text-xs text-gray-400">
                              {it.currency}
                            </span>
                          </>
                        ) : (
                          <span className="text-xs sm:text-sm font-bold dark:text-white text-black">
                            
                          </span>
                        )}
                      </div>

                      <Link
                        href={`/shop/${it.slug}`}
                        className="text-[11px] sm:text-sm px-2 sm:px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 dark:from-green-500 dark:to-green-600 text-white font-semibold shadow-sm hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-orange-300 dark:focus:ring-green-300"
                      >
                        Buy
                      </Link>
                    </div>
                  </article>
                </GradientBorder>
              )
            })}
          </div>
        </section>
      </div>
    </section>
  )
}
