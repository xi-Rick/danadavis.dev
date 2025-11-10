'use client'
import {
  type MotionValue,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useMemo, useState } from 'react'

export const HeroParallax = ({
  projects,
  admin,
}: {
  projects: {
    title: string
    link: string
    thumbnail: string
    type?: 'project' | 'blog'
  }[]
  admin: {
    name: string
    introduction: string
  }
}) => {
  // Ensure we have at least some items to display
  const safeProjects = useMemo(
    () => (projects?.length > 0 ? projects : []),
    [projects],
  )

  // Duplicate projects for infinite scroll effect
  const duplicatedProjects = useMemo(
    () => [...safeProjects, ...safeProjects, ...safeProjects],
    [safeProjects],
  )

  const firstRow = useMemo(
    () => duplicatedProjects?.slice(0, 15),
    [duplicatedProjects],
  )
  const secondRow = useMemo(
    () => duplicatedProjects?.slice(5, 20),
    [duplicatedProjects],
  )
  const thirdRow = useMemo(
    () => duplicatedProjects?.slice(10, 25),
    [duplicatedProjects],
  )

  const ref = React.useRef(null)
  const { scrollYProgress } = useScroll({
    offset: ['start start', 'end start'],
  })

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 }

  // Infinite scroll animation values
  const baseX = useMotionValue(0)
  const baseXReverse = useMotionValue(0)
  const baseXMobile = useMotionValue(0)
  const baseXReverseMobile = useMotionValue(0)

  // Desktop parallax values combined with infinite scroll
  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig,
  )
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig,
  )

  // Mobile parallax values combined with infinite scroll
  const translateXMobile = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 200]),
    springConfig,
  )
  const translateXReverseMobile = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -200]),
    springConfig,
  )

  // Infinite scroll animation
  useEffect(() => {
    let animationFrame: number
    let lastTime = performance.now()
    const mountedRef = { current: true }

    const speed = 0.1 // px/ms
    const cardWidth = 40 * 16 + 80 // 40rem + 20rem spacing in px (approximate)
    const cardWidthMobile = 14 * 16 + 12 // 14rem + 3rem spacing in px (approximate)

    // Calculate the total width of one set of cards (not all duplicates)
    const singleSetWidth = cardWidth * (safeProjects.length || 1)
    const singleSetWidthMobile = cardWidthMobile * (safeProjects.length || 1)

    function animate() {
      if (!mountedRef.current) return

      const now = performance.now()
      const delta = now - lastTime
      lastTime = now

      // Desktop - use modulo for seamless looping
      const nextX = baseX.get() + speed * delta
      baseX.set(nextX % singleSetWidth)

      const nextXReverse = baseXReverse.get() - speed * delta
      baseXReverse.set(
        (((nextXReverse % singleSetWidth) + singleSetWidth) % singleSetWidth) -
          singleSetWidth,
      )

      // Mobile - use modulo for seamless looping
      const nextXMobile = baseXMobile.get() + speed * 0.6 * delta
      baseXMobile.set(nextXMobile % singleSetWidthMobile)

      const nextXReverseMobile = baseXReverseMobile.get() - speed * 0.6 * delta
      baseXReverseMobile.set(
        (((nextXReverseMobile % singleSetWidthMobile) + singleSetWidthMobile) %
          singleSetWidthMobile) -
          singleSetWidthMobile,
      )

      animationFrame = requestAnimationFrame(animate)
    }

    animationFrame = requestAnimationFrame(animate)
    return () => {
      mountedRef.current = false
      cancelAnimationFrame(animationFrame)
    }
  }, [
    baseX,
    baseXReverse,
    baseXMobile,
    baseXReverseMobile,
    safeProjects.length,
  ])

  // Combine infinite scroll with parallax
  const combinedTranslateX = useTransform(
    [baseX, translateX],
    (latest: number[]) => latest[0] + latest[1],
  )
  const combinedTranslateXReverse = useTransform(
    [baseXReverse, translateXReverse],
    (latest: number[]) => latest[0] + latest[1],
  )
  const combinedTranslateXMobile = useTransform(
    [baseXMobile, translateXMobile],
    (latest: number[]) => latest[0] + latest[1],
  )
  const combinedTranslateXReverseMobile = useTransform(
    [baseXReverseMobile, translateXReverseMobile],
    (latest: number[]) => latest[0] + latest[1],
  )

  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig,
  )
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig,
  )
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig,
  )
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
    springConfig,
  )

  // Mobile translateY (reduced movement)
  const translateYMobile = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-100, 50]),
    springConfig,
  )

  return (
    <div
      ref={ref}
      className="relative flex h-auto min-h-screen w-full flex-col self-auto overflow-hidden py-10 antialiased [perspective:1000px] [transform-style:preserve-3d] sm:h-[2400px] md:h-[2800px]"
    >
      <Header name={admin.name} introduction={admin.introduction} />

      {/* Desktop version */}
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className="hidden pb-20 sm:block"
      >
        {firstRow.length > 0 && (
          <motion.div className="mb-20 flex flex-row-reverse space-x-20 space-x-reverse">
            {firstRow.map((product, index) => (
              <ProductCard
                product={product}
                translate={combinedTranslateX}
                key={`first-${product.title}-${index}`}
              />
            ))}
          </motion.div>
        )}
        {secondRow.length > 0 && (
          <motion.div className="mb-20 flex flex-row space-x-20">
            {secondRow.map((product, index) => (
              <ProductCard
                product={product}
                translate={combinedTranslateXReverse}
                key={`second-${product.title}-${index}`}
              />
            ))}
          </motion.div>
        )}
        {thirdRow.length > 0 && (
          <motion.div className="mb-20 flex flex-row-reverse space-x-20 space-x-reverse">
            {thirdRow.map((product, index) => (
              <ProductCard
                product={product}
                translate={combinedTranslateX}
                key={`third-${product.title}-${index}`}
              />
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Mobile version */}
      <motion.div
        style={{
          rotateX: useSpring(
            useTransform(scrollYProgress, [0, 0.2], [5, 0]),
            springConfig,
          ),
          rotateZ: useSpring(
            useTransform(scrollYProgress, [0, 0.2], [5, 0]),
            springConfig,
          ),
          translateY: translateYMobile,
          opacity,
        }}
        className="block pb-10 sm:hidden"
      >
        {firstRow.length > 0 && (
          <motion.div className="mb-4 flex flex-row-reverse space-x-3 space-x-reverse px-2">
            {firstRow.slice(0, 9).map((product, index) => (
              <ProductCardMobile
                product={product}
                translate={combinedTranslateXMobile}
                key={`mobile-first-${product.title}-${index}`}
              />
            ))}
          </motion.div>
        )}
        {secondRow.length > 0 && (
          <motion.div className="mb-4 flex flex-row space-x-3 px-2">
            {secondRow.slice(0, 9).map((product, index) => (
              <ProductCardMobile
                product={product}
                translate={combinedTranslateXReverseMobile}
                key={`mobile-second-${product.title}-${index}`}
              />
            ))}
          </motion.div>
        )}
        {thirdRow.length > 0 && (
          <motion.div className="flex flex-row-reverse space-x-3 space-x-reverse px-2">
            {thirdRow.slice(0, 9).map((product, index) => (
              <ProductCardMobile
                product={product}
                translate={combinedTranslateXMobile}
                key={`mobile-third-${product.title}-${index}`}
              />
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export const Header = ({
  name,
  introduction,
}: {
  name: string
  introduction: string
}) => {
  const [isHovered, setIsHovered] = useState(false)

  // Extract first name only
  const firstName = name.split(' ')[0]

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springX = useSpring(mouseX, { stiffness: 100, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 100, damping: 20 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth - 0.5)
      mouseY.set(e.clientY / window.innerHeight - 0.5)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  // Create dynamic grid of interactive elements
  const gridElements = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        delay: i * 0.1,
        x: (i % 6) * 20,
        y: Math.floor(i / 6) * 25,
      })),
    [],
  )

  return (
    <div className="relative mx-auto w-full max-w-7xl overflow-visible px-4 py-10 sm:py-20 md:py-32">
      {/* Interactive background grid */}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          x: useTransform(springX, [-0.5, 0.5], [-20, 20]),
          y: useTransform(springY, [-0.5, 0.5], [-20, 20]),
        }}
      >
        {gridElements.map((element) => (
          <motion.div
            key={element.id}
            className="bg-foreground/20 absolute h-px w-px"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
            }}
            animate={{
              opacity: [0.1, 0.6, 0.1],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 3 + (element.id % 3),
              delay: element.delay,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
          />
        ))}
      </motion.div>

      <motion.div
        className="relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Glitch-style greeting */}
        <motion.div
          className="mb-6 overflow-hidden sm:mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className="text-foreground/60 relative font-mono text-xs tracking-[0.3em] uppercase sm:text-sm"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.span
              animate={
                isHovered
                  ? {
                      x: [0, -2, 2, 0],
                      opacity: [1, 0.8, 1, 1],
                    }
                  : {}
              }
              transition={{ duration: 0.3 }}
            >
              &gt; Hello_world
            </motion.span>

            {/* Blinking cursor */}
            <motion.span
              className="text-foreground/80"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
            >
              |
            </motion.span>
          </motion.div>
        </motion.div>

        {/* Main title with kinetic typography */}
        <motion.h1 className="mb-8 text-3xl leading-[0.8] font-black tracking-tight sm:mb-12 sm:text-5xl md:text-6xl lg:text-8xl">
          {/* "I'm" with subtle animation */}
          <motion.div
            className="mb-3 block sm:mb-4"
            initial={{ opacity: 0, rotateX: -45 }}
            animate={{ opacity: 1, rotateX: 0 }}
            transition={{ duration: 1, delay: 0.6, type: 'spring' }}
          >
            <motion.span
              className="text-foreground/70 text-xl font-light sm:text-3xl md:text-4xl lg:text-5xl"
              style={{
                x: useTransform(springX, [-0.5, 0.5], [-10, 10]),
              }}
            >
              I&apos;m
            </motion.span>
          </motion.div>

          {/* Name with advanced hover effects - using first name only */}
          <motion.div
            className="relative block"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.2,
              delay: 0.8,
              type: 'spring',
              stiffness: 100,
            }}
          >
            {firstName.split('').map((letter, index) => (
              <motion.span
                key={index}
                className={`text-foreground relative inline-block ${index === 0 ? 'uppercase' : ''}`}
                initial={{ opacity: 0, y: 50, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 1.0 + index * 0.1,
                  type: 'spring',
                  stiffness: 200,
                }}
                whileHover={{
                  y: -8,
                  rotateZ: [0, 5, -5, 0],
                  transition: { duration: 0.3 },
                }}
                style={{
                  transformOrigin: 'center bottom',
                }}
              >
                {letter}

                {/* Individual letter accents */}
                {index === 0 && (
                  <motion.div
                    className="border-foreground/30 absolute -top-1 -left-0.5 h-1 w-1 border-t border-l sm:-top-2 sm:-left-1 sm:h-2 sm:w-2"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.5 + index * 0.1 }}
                  />
                )}
                {index === firstName.length - 1 && (
                  <motion.div
                    className="border-foreground/30 absolute -right-0.5 -bottom-1 h-1 w-1 border-r border-b sm:-right-1 sm:-bottom-2 sm:h-2 sm:w-2"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.5 + index * 0.1 }}
                  />
                )}
              </motion.span>
            ))}

            {/* Dynamic underline system */}
            <motion.div
              className="absolute -bottom-2 left-0 flex gap-1 sm:-bottom-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.0 }}
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="bg-foreground/40 h-0.5"
                  initial={{ width: 0 }}
                  animate={{ width: `${15 + i * 10}px` }}
                  transition={{
                    duration: 0.8,
                    delay: 2.2 + i * 0.2,
                    type: 'spring',
                  }}
                />
              ))}
            </motion.div>

            {/* Floating emoji with physics */}
            <motion.span
              className="absolute -top-2 -right-6 text-2xl sm:-top-4 sm:-right-8 sm:text-4xl md:text-5xl lg:text-6xl"
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                duration: 1,
                delay: 2.5,
                type: 'spring',
                stiffness: 200,
                damping: 10,
              }}
              whileHover={{
                rotate: 15,
                scale: 1.2,
                y: -8,
                transition: {
                  duration: 0.3,
                  type: 'spring',
                  stiffness: 400,
                  damping: 10,
                },
              }}
              style={{
                cursor: 'default',
                x: useTransform(springX, [-0.5, 0.5], [-15, 15]),
                y: useTransform(springY, [-0.5, 0.5], [-15, 15]),
              }}
            >
              👋🏾
            </motion.span>
          </motion.div>
        </motion.h1>

        {/* Introduction with mobile-optimized layout */}
        <motion.div
          className="relative max-w-full sm:max-w-4xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.0 }}
        >
          {/* Enhanced bracket decoration - hidden on mobile, visible on larger screens */}
          <motion.div
            className="absolute top-0 -left-12 hidden sm:block"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 3.2 }}
          >
            <motion.div
              className="relative"
              whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              {/* Main bracket */}
              <motion.span
                className="text-foreground/30 font-mono text-4xl font-bold"
                animate={{
                  color: [
                    'rgba(var(--foreground) / 0.3)',
                    'rgba(var(--foreground) / 0.6)',
                    'rgba(var(--foreground) / 0.3)',
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'easeInOut',
                }}
              >
                [
              </motion.span>

              {/* Accent lines */}
              <motion.div
                className="absolute top-1 -left-1 h-6 w-0.5 bg-gradient-to-b from-orange-400/50 to-transparent"
                initial={{ height: 0 }}
                animate={{ height: 24 }}
                transition={{ delay: 3.4, duration: 0.8 }}
              />
              <motion.div
                className="absolute bottom-1 -left-1 h-6 w-0.5 bg-gradient-to-t from-orange-400/50 to-transparent"
                initial={{ height: 0 }}
                animate={{ height: 24 }}
                transition={{ delay: 3.6, duration: 0.8 }}
              />
            </motion.div>
          </motion.div>

          {/* Content area with mobile-first approach */}
          <motion.div
            className="sm:border-foreground/10 sm:border-l-2 sm:pl-4"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 3.4 }}
          >
            {/* Split introduction into sentences for better animation */}
            <div className="text-foreground/80 space-y-4 text-sm leading-relaxed font-medium sm:space-y-6 sm:text-lg md:text-xl lg:text-2xl">
              {introduction
                .split('.')
                .filter((s) => s.trim())
                .map((sentence, sentenceIndex) => (
                  <motion.p
                    key={sentenceIndex}
                    className="relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: 3.6 + sentenceIndex * 0.3,
                    }}
                  >
                    {/* Word-by-word reveal with stagger */}
                    {sentence
                      .trim()
                      .split(' ')
                      .map((word, wordIndex) => (
                        <motion.span
                          key={wordIndex}
                          className="mr-1 inline-block"
                          initial={{ opacity: 0, filter: 'blur(4px)' }}
                          animate={{ opacity: 1, filter: 'blur(0px)' }}
                          transition={{
                            duration: 0.4,
                            delay: 3.8 + sentenceIndex * 0.3 + wordIndex * 0.05,
                          }}
                          whileHover={{
                            transition: { duration: 0.2 },
                          }}
                        >
                          {word}
                        </motion.span>
                      ))}
                    <span className="text-foreground/40">.</span>

                    {/* Sentence number indicator - hidden on mobile */}
                    <motion.span
                      className="text-foreground/30 absolute top-0 -left-8 hidden font-mono text-xs sm:block"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 4.0 + sentenceIndex * 0.3 }}
                    >
                      {String(sentenceIndex + 1).padStart(2, '0')}
                    </motion.span>
                  </motion.p>
                ))}
            </div>

            {/* Footer signature */}
            <motion.div
              className="mt-8 flex items-center gap-3 sm:mt-12 sm:gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 5.0 }}
            >
              <motion.div
                className="flex gap-1"
                animate={{
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'easeInOut',
                }}
              >
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-foreground/40 h-1 w-1 rounded-full"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </motion.div>

              <motion.span
                className="text-foreground/50 font-mono text-xs tracking-wider sm:text-sm"
                whileHover={{
                  transition: { duration: 0.2 },
                }}
              >
                /{firstName.toLowerCase()}davis.dev
              </motion.span>
            </motion.div>
          </motion.div>

          {/* Enhanced closing bracket - hidden on mobile */}
          <motion.div
            className="absolute bottom-0 -left-12 hidden sm:block"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 5.2 }}
          >
            <motion.div
              className="relative"
              whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              {/* Main bracket */}
              <motion.span
                className="text-foreground/30 font-mono text-4xl font-bold"
                animate={{
                  color: [
                    'rgba(var(--foreground) / 0.3)',
                    'rgba(var(--foreground) / 0.6)',
                    'rgba(var(--foreground) / 0.3)',
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'easeInOut',
                  delay: 0.5,
                }}
              >
                ]
              </motion.span>

              {/* Accent lines */}
              <motion.div
                className="absolute top-1 -right-1 h-6 w-0.5 bg-gradient-to-b from-orange-400/50 to-transparent"
                initial={{ height: 0 }}
                animate={{ height: 24 }}
                transition={{ delay: 5.4, duration: 0.8 }}
              />
              <motion.div
                className="absolute -right-1 bottom-1 h-6 w-0.5 bg-gradient-to-t from-orange-400/50 to-transparent"
                initial={{ height: 0 }}
                animate={{ height: 24 }}
                transition={{ delay: 5.6, duration: 0.8 }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export const ProductCard = ({
  product,
  translate,
}: {
  product: {
    title: string
    link: string
    thumbnail: string
    type?: 'project' | 'blog'
  }
  translate: MotionValue<number>
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      key={product.title}
      className="group/product relative h-96 w-[40rem] flex-shrink-0"
    >
      <Link
        href={product.link}
        className="block group-hover/product:shadow-2xl"
      >
        <Image
          src={product.thumbnail}
          height="600"
          width="600"
          priority
          className="absolute inset-0 h-full w-full object-cover object-left-top"
          alt={product.title}
        />
      </Link>
      <div className="pointer-events-none absolute inset-0 h-full w-full bg-black opacity-0 group-hover/product:opacity-60 dark:group-hover/product:opacity-40" />
      {product.type && (
        <div className="absolute top-4 right-4 rounded-full bg-white/20 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          {product.type === 'blog' ? '📝 Blog' : '🚀 Project'}
        </div>
      )}
      <h2 className="absolute bottom-4 left-4 text-white opacity-0 group-hover/product:opacity-100">
        {product.title}
      </h2>
    </motion.div>
  )
}

export const ProductCardMobile = ({
  product,
  translate,
}: {
  product: {
    title: string
    link: string
    thumbnail: string
    type?: 'project' | 'blog'
  }
  translate: MotionValue<number>
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -10,
      }}
      key={product.title}
      className="group/product relative h-40 w-56 flex-shrink-0"
    >
      <Link href={product.link} className="block group-hover/product:shadow-xl">
        <Image
          src={product.thumbnail}
          height="300"
          width="300"
          priority
          className="absolute inset-0 h-full w-full rounded-lg object-cover object-left-top"
          alt={product.title}
        />
      </Link>
      <div className="pointer-events-none absolute inset-0 h-full w-full rounded-lg bg-black opacity-0 group-hover/product:opacity-50 dark:group-hover/product:opacity-30" />
      {product.type && (
        <div className="absolute top-2 right-2 rounded-full bg-white/20 px-1.5 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
          {product.type === 'blog' ? '📝' : '🚀'}
        </div>
      )}
      <h2 className="absolute bottom-2 left-2 text-sm font-medium text-white opacity-0 group-hover/product:opacity-100">
        {product.title}
      </h2>
    </motion.div>
  )
}
