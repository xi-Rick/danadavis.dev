'use client'

import Image from 'next/image'
import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { GradientBorder } from '~/components/ui/gradient-border'
import { Twemoji } from '~/components/ui/twemoji'

export type AutoSlide = {
  id: string
  title: string
  subtitle?: string
  cta?: string
  image?: string
  thumbnails?: string[]
}

const DEFAULT_SLIDES: AutoSlide[] = [
  {
    id: 'promo-1',
    title: 'Treat Dana to a little delight 🎁',
    subtitle: 'A tiny gift for me goes a long way — 20% off my favorite pick.',
    cta: 'Buy for Dana',
    // Use a twemoji name here so the big image uses a twemoji instead of the ugly shop bitmap
    image: 'wrapped-gift',
    thumbnails: ['wrapped-gift', 'party-popper', 'sparkles'],
  },
  {
    id: 'promo-2',
    title: 'Fuel my mornings ☕',
    subtitle:
      'Hand-roasted coffee I sip every day — chip in so I can keep caffeinated.',
    cta: 'Buy me coffee',
    image: 'coffee',
    thumbnails: ['coffee', 'sparkles', 'party-popper'],
  },
  {
    id: 'promo-3',
    title: 'Surprise me with something small ✨',
    subtitle:
      'Perfect for when you want to say hi — pick a tiny treat and make Dana smile.',
    cta: 'Surprise Dana',
    image: 'sparkles',
    thumbnails: ['sparkles', 'wrapped-gift', 'party-popper'],
  },
]

export const AutoScrollStrip: React.FC<{ slides?: AutoSlide[] }> = ({
  slides = DEFAULT_SLIDES,
}) => {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(true)
  const timer = useRef<number | null>(null)

  const length = slides.length

  useEffect(() => {
    if (!playing) return
    timer.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % length)
    }, 4500)
    return () => {
      if (timer.current) window.clearInterval(timer.current)
      timer.current = null
    }
  }, [playing, length])

  const goPrev = () => setIndex((i) => (i - 1 + length) % length)
  const goNext = () => setIndex((i) => (i + 1) % length)

  return (
    <section aria-labelledby="promo-strip" className="mb-10 md:mb-14">
      <GradientBorder offset={28} className="rounded-3xl p-0">
        <article className="relative bg-gradient-to-br from-white/70 to-white/50 dark:from-black/60 dark:to-black/40 rounded-3xl text-black dark:text-white p-6 md:p-10 shadow-xl overflow-hidden">
          {/* Animated background gradient accent */}
          <div className="absolute -right-20 -top-20 w-40 h-40 bg-orange-200/20 dark:bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 bottom-0 w-32 h-32 bg-orange-100/10 dark:bg-green-400/5 rounded-full blur-3xl pointer-events-none" />

          {/* Desktop layout: side by side */}
          <div className="hidden md:flex gap-8 items-center relative z-10">
            {/* Left content section */}
            <div className="flex-1 min-w-0">
              <h3
                id="promo-strip"
                className="text-4xl lg:text-5xl font-extrabold leading-tight mb-4 text-gray-900 dark:text-white"
              >
                {slides[index].title}
              </h3>
              {slides[index].subtitle && (
                <p className="text-base lg:text-lg text-gray-700 dark:text-gray-200 mb-6 leading-relaxed max-w-lg">
                  {slides[index].subtitle}
                </p>
              )}

              <button className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 dark:from-green-500 dark:to-green-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 active:scale-95">
                {slides[index].cta ?? 'Learn more'} →
              </button>
            </div>

            {/* Right visual section */}
            <div className="flex-1 flex items-center justify-end gap-4">
              {/* Main image display */}
              <div className="relative">
                <div className="w-56 h-56 rounded-2xl flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-100 to-orange-50 dark:from-green-900/30 dark:to-green-800/20 border border-orange-200/50 dark:border-green-700/30 shadow-lg">
                  {slides[index].image ? (
                    slides[index].image.startsWith('/') ||
                    slides[index].image.startsWith('http') ||
                    slides[index].image.includes('.') ? (
                      <Image
                        src={slides[index].image}
                        alt={slides[index].title}
                        width={224}
                        height={224}
                        className="object-contain"
                      />
                    ) : (
                      <Twemoji emoji={slides[index].image} size="5x" />
                    )
                  ) : (
                    <Twemoji emoji="sparkles" size="4x" />
                  )}
                </div>
              </div>

              {/* Thumbnail stack */}
              {slides[index].thumbnails &&
                slides[index].thumbnails.length > 0 && (
                  <div className="flex flex-col gap-2">
                    {slides[index].thumbnails?.slice(0, 3).map((t, i) => (
                      <div
                        key={i}
                        className="h-20 w-20 rounded-xl flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-green-900/20 dark:to-green-800/10 border border-orange-200/50 dark:border-green-700/30 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                      >
                        {t ? (
                          t.startsWith('/') ||
                          t.startsWith('http') ||
                          t.includes('.') ? (
                            <Image
                              src={t}
                              alt={`thumb-${i}`}
                              width={80}
                              height={80}
                              className="object-contain"
                            />
                          ) : (
                            <Twemoji emoji={t} size="2x" />
                          )
                        ) : null}
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </div>

          {/* Mobile layout: stacked */}
          <div className="md:hidden flex flex-col gap-6 relative z-10">
            {/* Image section - top */}
            <div className="flex justify-center pt-4">
              <div className="w-40 h-40 rounded-2xl flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-100 to-orange-50 dark:from-green-900/30 dark:to-green-800/20 border border-orange-200/50 dark:border-green-700/30 shadow-md">
                {slides[index].image ? (
                  slides[index].image.startsWith('/') ||
                  slides[index].image.startsWith('http') ||
                  slides[index].image.includes('.') ? (
                    <Image
                      src={slides[index].image}
                      alt={slides[index].title}
                      width={160}
                      height={160}
                      className="object-contain"
                    />
                  ) : (
                    <Twemoji emoji={slides[index].image} size="4x" />
                  )
                ) : (
                  <Twemoji emoji="sparkles" size="3x" />
                )}
              </div>
            </div>

            {/* Thumbnails - centered below image */}
            {slides[index].thumbnails &&
              slides[index].thumbnails.length > 0 && (
                <div className="flex justify-center gap-2">
                  {slides[index].thumbnails?.slice(0, 3).map((t, i) => (
                    <div
                      key={i}
                      className="h-14 w-14 rounded-lg flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-green-900/20 dark:to-green-800/10 border border-orange-200/50 dark:border-green-700/30 shadow-sm"
                    >
                      {t ? (
                        t.startsWith('/') ||
                        t.startsWith('http') ||
                        t.includes('.') ? (
                          <Image
                            src={t}
                            alt={`thumb-${i}`}
                            width={56}
                            height={56}
                            className="object-contain"
                          />
                        ) : (
                          <Twemoji emoji={t} size="lg" />
                        )
                      ) : null}
                    </div>
                  ))}
                </div>
              )}

            {/* Content section - bottom */}
            <div className="text-center">
              <h3
                id="promo-strip"
                className="text-2xl font-extrabold leading-tight mb-3 text-gray-900 dark:text-white"
              >
                {slides[index].title}
              </h3>
              {slides[index].subtitle && (
                <p className="text-sm text-gray-700 dark:text-gray-200 mb-4 leading-relaxed">
                  {slides[index].subtitle}
                </p>
              )}

              <button className="w-full inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 dark:from-green-500 dark:to-green-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95">
                {slides[index].cta ?? 'Learn more'} →
              </button>
            </div>
          </div>

          {/* Controls - bottom */}
          <div className="mt-8 flex items-center justify-between gap-4 pt-6 border-t border-gray-200/50 dark:border-gray-700/50 relative z-10">
            {/* Left: Navigation arrows */}
            <div className="flex gap-2 items-center">
              <button
                onClick={goPrev}
                aria-label="Previous slide"
                className="h-10 w-10 inline-flex items-center justify-center rounded-full bg-orange-100/60 dark:bg-green-900/40 hover:bg-orange-200/80 dark:hover:bg-green-800/60 text-orange-600 dark:text-green-400 focus:ring-2 focus:ring-orange-400 dark:focus:ring-green-500 transition-all duration-150"
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
                  className="text-current"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                onClick={goNext}
                aria-label="Next slide"
                className="h-10 w-10 inline-flex items-center justify-center rounded-full bg-orange-100/60 dark:bg-green-900/40 hover:bg-orange-200/80 dark:hover:bg-green-800/60 text-orange-600 dark:text-green-400 focus:ring-2 focus:ring-orange-400 dark:focus:ring-green-500 transition-all duration-150"
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
                  className="text-current"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>

            {/* Center: Dot indicators */}
            <div className="flex gap-2 items-center">
              {slides.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`rounded-full transition-all duration-200 ${
                    i === index
                      ? 'h-3 w-8 bg-orange-500 dark:bg-green-500'
                      : 'h-2.5 w-2.5 bg-orange-300/50 dark:bg-green-500/40 hover:bg-orange-400/70 dark:hover:bg-green-500/60'
                  }`}
                />
              ))}
            </div>

            {/* Right: Play/Pause button */}
            <button
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? 'Pause autoplay' : 'Play autoplay'}
              className="h-10 w-10 inline-flex items-center justify-center rounded-full bg-orange-100/60 dark:bg-green-900/40 hover:bg-orange-200/80 dark:hover:bg-green-800/60 text-orange-600 dark:text-green-400 focus:ring-2 focus:ring-orange-400 dark:focus:ring-green-500 transition-all duration-150"
            >
              {playing ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-current"
                >
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-current"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              )}
            </button>
          </div>
        </article>
      </GradientBorder>
    </section>
  )
}
