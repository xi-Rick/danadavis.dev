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
      <GradientBorder offset={28} className="rounded-2xl p-0">
        <article className="bg-white/60 dark:bg-black/55 rounded-2xl text-black dark:text-white p-6 md:p-8 shadow-lg overflow-hidden">
          <div className="flex gap-6 items-center min-h-[220px] md:min-h-[220px]">
            {/* Left content */}
            <div className="flex-1 max-w-[54%] pr-6">
              <h3
                id="promo-strip"
                className="text-3xl md:text-4xl font-extrabold leading-tight mb-3"
              >
                {slides[index].title}
              </h3>
              {slides[index].subtitle && (
                <p className="text-sm md:text-base dark:text-white text-black mb-5">
                  {slides[index].subtitle}
                </p>
              )}

              <div className="flex gap-3 items-center">
                <button className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 dark:from-green-500 dark:to-green-600 text-white font-semibold shadow-md hover:opacity-95 transition-all duration-150">
                  {slides[index].cta ?? 'Learn more'}
                </button>
              </div>
            </div>

            {/* Right visual area */}
            <div className="w-[46%] flex items-center justify-end relative">
              <div className="w-[52%] h-[140px] md:h-[160px] rounded-lg flex items-center justify-center overflow-hidden border border-white/5 shadow-inner md:mr-4 bg-transparent">
                {slides[index].image ? (
                  // If image looks like a URL/path, render Image. Otherwise treat as twemoji name and render the emoji bigger.
                  slides[index].image.startsWith('/') ||
                  slides[index].image.startsWith('http') ||
                  slides[index].image.includes('.') ? (
                    <Image
                      src={slides[index].image}
                      alt={slides[index].title}
                      width={280}
                      height={160}
                      className="object-contain"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full">
                      <Twemoji emoji={slides[index].image} size="4x" />
                    </div>
                  )
                ) : (
                  <div className="flex items-center gap-2 text-gray-300">
                    <Twemoji emoji="sparkles" />
                    <span className="text-sm">Featured</span>
                  </div>
                )}
              </div>

              {/* thumbnails stacked to the right */}
              <div className="flex flex-col gap-3">
                {slides[index].thumbnails?.slice(0, 3).map((t, i) => (
                  <div
                    key={i}
                    className="h-[56px] w-[56px] rounded-lg flex items-center justify-center overflow-hidden border border-white/5 shadow-sm bg-transparent"
                  >
                    {t ? (
                      // If thumbnail looks like a path/URL (contains "." or starts with "/"), render an image, otherwise treat as a twemoji name
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
                        <div className="h-full w-full flex items-center justify-center text-gray-300 text-xs">
                          <Twemoji emoji={t} size="2x" />
                        </div>
                      )
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-300 text-xs">
                        No image
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Controls overlay: arrows and small dots */}
          </div>
          <div className="mt-6 flex items-center justify-between">
            <div className="flex gap-3 items-center">
              <div className="flex gap-2 items-center">
                <button
                  onClick={goPrev}
                  aria-label="Previous"
                  className="h-9 w-9 inline-flex items-center justify-center rounded-full bg-white/8 hover:bg-white/10 text-orange-400 dark:text-green-400 focus:ring-2 focus:ring-orange-300 dark:focus:ring-green-300"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-current"
                  >
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button
                  onClick={goNext}
                  aria-label="Next"
                  className="h-9 w-9 inline-flex items-center justify-center rounded-full bg-white/8 hover:bg-white/10 text-orange-400 dark:text-green-400 focus:ring-2 focus:ring-orange-300 dark:focus:ring-green-300"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-current"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex gap-2 items-center">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => setIndex(i)}
                    className={`h-2.5 w-2.5 rounded-full ${i === index ? 'bg-orange-500 dark:bg-green-500' : 'bg-orange-400/30 dark:bg-green-400/30'}`}
                  />
                ))}
              </div>

              <button
                onClick={() => setPlaying((p) => !p)}
                aria-label={playing ? 'Pause' : 'Play'}
                className="h-9 w-9 inline-flex items-center justify-center rounded-full bg-white/6 hover:bg-white/10 text-orange-400 dark:text-green-400 focus:ring-2 focus:ring-orange-300 dark:focus:ring-green-300"
              >
                {playing ? (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-current"
                  >
                    <path d="M6 19h4V5H6v14zM14 5v14h4V5h-4z" />
                  </svg>
                ) : (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-current"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </article>
      </GradientBorder>
    </section>
  )
}
