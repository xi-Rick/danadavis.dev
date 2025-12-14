'use client'

import Image from 'next/image'
import Link from 'next/link'
import type React from 'react'
import { useEffect, useState } from 'react'
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
  const [activeTab, setActiveTab] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const toggleLiked = (id: string) => {
    setLiked((s) => ({ ...s, [id]: !s[id] }))
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    setTouchEnd(e.changedTouches[0].clientX)
    handleSwipe()
  }

  const handleSwipe = () => {
    if (touchStart - touchEnd > 50) {
      setActiveTab((prev) => (prev + 1) % items.length)
    }
    if (touchEnd - touchStart > 50) {
      setActiveTab((prev) => (prev - 1 + items.length) % items.length)
    }
  }

  // Persist favorites in localStorage
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8">
        <div>
          <h3
            id="todays-deals"
            className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white"
          >
            Today&apos;s Deals
          </h3>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
            Handpicked{' '}
            <span className="text-orange-500 dark:text-green-500 font-semibold">
              favorites
            </span>{' '}
            just for you
          </p>
        </div>
      </div>

      {/* Desktop: Grid Layout (4+ items) */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
        {items.map((it) => (
          <DealCard
            key={it.id}
            item={it}
            liked={liked[it.id] || false}
            onToggleLike={() => toggleLiked(it.id)}
          />
        ))}
      </div>

      {/* Mobile: Tab-based Carousel */}
      <div className="md:hidden">
        <div
          className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-white/70 to-white/50 dark:from-black/60 dark:to-black/40 border border-orange-200/30 dark:border-green-700/30"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Carousel content */}
          <div className="p-4 pb-6 sm:p-6 min-h-[500px] sm:min-h-[420px] flex flex-col">
            {/* Product image and featured badge */}
            <div className="relative mb-6 flex-shrink-0">
              <div className="w-full aspect-square bg-gradient-to-br from-orange-100/50 to-orange-50/30 dark:from-green-900/20 dark:to-green-800/10 rounded-2xl flex items-center justify-center overflow-hidden border border-orange-200/40 dark:border-green-700/40 shadow-sm">
                {items[activeTab]?.images?.[0] ? (
                  <Image
                    src={items[activeTab].images[0]}
                    alt={items[activeTab].title}
                    width={400}
                    height={400}
                    className="object-contain w-full h-full"
                  />
                ) : (
                  <div className="text-gray-400 text-sm">No image</div>
                )}
              </div>

              {items[activeTab]?.featured && (
                <span className="absolute top-4 left-4 inline-flex items-center rounded-full bg-gradient-to-r from-orange-500 to-orange-600 dark:from-green-500 dark:to-green-600 text-white text-xs font-semibold px-3 py-1 shadow-md">
                  ⭐ Featured
                </span>
              )}

              {/* Like button */}
              <button
                aria-label={
                  liked[items[activeTab]?.id]
                    ? 'Remove favorite'
                    : 'Add favorite'
                }
                aria-pressed={!!liked[items[activeTab]?.id]}
                onClick={() => toggleLiked(items[activeTab].id)}
                className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/90 dark:bg-black/60 border border-orange-200/50 dark:border-green-700/50 flex items-center justify-center shadow-md hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 dark:focus:ring-green-500"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill={liked[items[activeTab]?.id] ? '#ef4444' : 'none'}
                  stroke={
                    liked[items[activeTab]?.id] ? '#ef4444' : 'currentColor'
                  }
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-current"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col text-center">
              <h4 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                <Link href={`/shop/${items[activeTab].slug}`}>
                  <GrowingUnderline>{items[activeTab].title}</GrowingUnderline>
                </Link>
              </h4>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
                {items[activeTab].summary}
              </p>

              {/* Price */}
              {items[activeTab].price ||
              (items[activeTab] as unknown as { target?: number }).target ? (
                <div className="mb-4 flex items-center justify-center gap-2">
                  <span className="text-3xl font-bold text-orange-600 dark:text-green-400">
                    $
                    {(
                      items[activeTab].price ||
                      (items[activeTab] as unknown as { target: number }).target
                    ).toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {items[activeTab].currency}
                  </span>
                </div>
              ) : null}

              {/* CTA Button */}
              <Link
                href={`/shop/${items[activeTab].slug}`}
                className="mt-auto w-full inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 dark:from-green-500 dark:to-green-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 active:scale-95"
              >
                View Details →
              </Link>
            </div>
          </div>

          {/* Navigation Arrows (optional on mobile, hidden on very small screens) */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-between px-2">
            <button
              onClick={() =>
                setActiveTab((prev) => (prev - 1 + items.length) % items.length)
              }
              className="pointer-events-auto h-10 w-10 rounded-full bg-white/70 dark:bg-black/70 flex items-center justify-center text-orange-600 dark:text-green-400 hover:bg-white/90 dark:hover:bg-black/90 transition-all shadow-md"
              aria-label="Previous deal"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <button
              onClick={() => setActiveTab((prev) => (prev + 1) % items.length)}
              className="pointer-events-auto h-10 w-10 rounded-full bg-white/70 dark:bg-black/70 flex items-center justify-center text-orange-600 dark:text-green-400 hover:bg-white/90 dark:hover:bg-black/90 transition-all shadow-md"
              aria-label="Next deal"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tab indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`transition-all duration-300 rounded-full ${
                idx === activeTab
                  ? 'h-3 w-8 bg-orange-500 dark:bg-green-500'
                  : 'h-2.5 w-2.5 bg-orange-300/50 dark:bg-green-600/50 hover:bg-orange-400/70 dark:hover:bg-green-500/70'
              }`}
              aria-label={`Go to deal ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * Individual deal card for desktop grid
 */
const DealCard: React.FC<{
  item: DealItem
  liked: boolean
  onToggleLike: () => void
}> = ({ item, liked, onToggleLike }) => {
  const firstImage = item.images?.[0] ?? null

  return (
    <GradientBorder
      offset={16}
      className="rounded-2xl p-0 overflow-hidden h-full flex flex-col group"
    >
      <article className="bg-gradient-to-br from-white/70 to-white/40 dark:from-black/60 dark:to-black/40 rounded-2xl flex flex-col h-full shadow-sm hover:shadow-md transition-all duration-300">
        {/* Image Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-orange-100/40 to-orange-50/20 dark:from-green-900/30 dark:to-green-800/20 aspect-square flex items-center justify-center border-b border-orange-200/30 dark:border-green-700/30">
          <Link
            href={`/shop/${item.slug}`}
            className="w-full h-full flex items-center justify-center"
          >
            {firstImage ? (
              <Image
                src={firstImage}
                alt={item.title}
                width={320}
                height={320}
                className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-gray-400 text-sm">
                No image
              </div>
            )}
          </Link>

          {/* Featured badge */}
          {item.featured && (
            <span className="absolute top-3 right-3 inline-flex items-center rounded-full bg-gradient-to-r from-orange-500 to-orange-600 dark:from-green-500 dark:to-green-600 text-white text-xs font-bold px-3 py-1.5 shadow-lg">
              ⭐
            </span>
          )}

          {/* Like button */}
          <button
            aria-label={liked ? 'Remove favorite' : 'Add favorite'}
            aria-pressed={liked}
            onClick={onToggleLike}
            className={`absolute top-3 left-3 h-9 w-9 rounded-full border shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-0 focus:ring-orange-400 dark:focus:ring-green-500 ${
              liked
                ? 'bg-red-100/90 dark:bg-red-950/60 border-red-200 dark:border-red-900'
                : 'bg-white/90 dark:bg-black/60 border-orange-200/50 dark:border-green-700/50'
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill={liked ? '#ef4444' : 'none'}
              stroke={liked ? '#ef4444' : 'currentColor'}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-current"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>

        {/* Content Section */}
        <div className="p-4 flex flex-col flex-1 text-center">
          {/* Title */}
          <Link href={`/shop/${item.slug}`} className="mb-2 group/link">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 group-hover/link:text-orange-600 dark:group-hover/link:text-green-400 transition-colors">
              <GrowingUnderline>{item.title}</GrowingUnderline>
            </h4>
          </Link>

          {/* Summary */}
          {item.summary && (
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 line-clamp-1 mb-3">
              {item.summary}
            </p>
          )}

          {/* Price - flexible layout */}
          <div className="mb-3 flex-1 flex items-center justify-center">
            {item.price || (item as unknown as { target?: number }).target ? (
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-orange-600 dark:text-green-400">
                  $
                  {(
                    item.price || (item as unknown as { target: number }).target
                  ).toFixed(2)}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-500">
                  {item.currency}
                </span>
              </div>
            ) : null}
          </div>

          {/* CTA Button */}
          <Link
            href={`/shop/${item.slug}`}
            className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 dark:from-green-500 dark:to-green-600 text-white text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 active:scale-95"
          >
            View →
          </Link>
        </div>
      </article>
    </GradientBorder>
  )
}
