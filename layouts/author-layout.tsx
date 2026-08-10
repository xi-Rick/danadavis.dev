import type { ReactNode } from 'react'
import { CareerTimeline } from '~/components/author/career'
import { SocialAccounts } from '~/components/author/social-accounts'
import { Button } from '~/components/ui/button'
import { Container } from '~/components/ui/container'
import { LinkPreview } from '~/components/ui/link-preview'
import { PageHeader } from '~/components/ui/page-header'
import { Twemoji } from '~/components/ui/twemoji'
import { SITE_METADATA } from '~/data/site-metadata'

interface Props {
  children?: ReactNode
}

export function AuthorLayout({}: Props) {
  return (
    <Container className="pt-4 lg:pt-12">
      <PageHeader
        title="About"
        description="A bit of background on who I am, what I do, and why I started this blog. Nothing too serious, just a little intro to the person typing away behind the scenes."
        className="border-b border-gray-200 dark:border-gray-700"
      />
      <div className="py-8">
        <div className="prose prose-lg max-w-full dark:prose-invert">
          {/* About Me Section */}
          <section>
            <h2 className="mt-0">About Me</h2>
            <div>
              <h3 className="mt-0">Hi there 👋🏾</h3>
              <p>
                I&apos;m <strong>Dana</strong>, a{' '}
                <strong>Full-Stack Developer</strong> from the{' '}
                <strong>United States</strong>. Building tomorrow&apos;s web
                today, one commit at a time.
              </p>
              <p>
                What I love most about web development is that it gives me a
                hobby I can pursue from home while constantly learning something
                new. It&apos;s a field where you&apos;re never stuck in the
                past—there&apos;s always something fresh to explore, which also
                helps me keep up with younger generations and stay relevant in
                an ever-evolving tech landscape <Twemoji emoji="rocket" />.
              </p>
              <p>
                My journey into tech started way back with{' '}
                <strong>Android development</strong>. I remember understanding
                that phones could act as hotspots before the software was even
                built into devices—that kind of forward-thinking got me hooked
                on technology&apos;s potential <Twemoji emoji="mobile-phone" />.
              </p>
              <p>
                These days, I work mainly with <strong>Next.js</strong>,{' '}
                <strong>TypeScript</strong>, <strong>React</strong>,{' '}
                <strong>Node.js</strong>, and <strong>TailwindCSS</strong>—tools
                that let me bring ideas to life on the web.
              </p>
            </div>
            <div>
              <h3>Philosophy & Perspective</h3>
              <p>
                I believe in having a solid worldview—thinking in terms of
                creating a place where everyone belongs, regardless of how
                others perceive them. As Magneto would say:
              </p>
              <blockquote className="border-l-4 border-orange-500 dark:border-green-600 pl-4 italic">
                &ldquo;A place for all who are hated and feared.&rdquo;
              </blockquote>
              <p>
                I can entertain any idea, no matter how wild. I&apos;m not
                easily swayed by one or two viewpoints—I take time to consider
                different perspectives before forming my own conclusions. But
                entertaining an idea and <em>believing</em> it for long are two
                different things <Twemoji emoji="brain" />.
              </p>
            </div>
            <div>
              <h3>Beyond Code</h3>
              <p>
                When I&apos;m not coding, you&apos;ll probably find me reading{' '}
                <strong>One Piece</strong>—I&apos;ve been following it since{' '}
                <strong>1999</strong>, and yes, I&apos;m still waiting to see
                how it all ends <Twemoji emoji="pirate-flag" />. There&apos;s
                something about long-running stories that mirror the tech
                journey: both require patience, persistence, and a love for the
                adventure itself.
              </p>
            </div>
            <div>
              <div className="mt-[2em] mb-[1em] flex items-center justify-between [&>h3]:my-0">
                <h3>My career</h3>
                <Button
                  asChild
                  className="border-2 border-orange-500 dark:border-green-600"
                >
                  <a href="/resume.pdf" target="_blank" rel="noreferrer">
                    <span className="normal-case">Resume</span>
                    <Twemoji emoji="page-facing-up" />
                  </a>
                </Button>
              </div>
              <CareerTimeline />
            </div>
            <div>
              <h3>Contact</h3>
              <p>
                Reach out to me at{' '}
                <a href={`mailto:${SITE_METADATA.email}`}>
                  {SITE_METADATA.email}
                </a>{' '}
                or find me on social media:
              </p>
              <SocialAccounts />
            </div>
            <div>
              <h3>Support</h3>
              <p>If you appreciate my work, consider supporting me:</p>
              <div className="flex flex-nowrap items-center gap-2 sm:gap-3">
                <a
                  href={SITE_METADATA.support.buyMeACoffee}
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-full bg-[#FFDD00] px-3 py-2.5 text-black shadow-sm transition-transform hover:scale-[1.03] active:scale-95 sm:flex-none sm:min-w-[170px] sm:px-4"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 shrink-0 sm:h-5 sm:w-5"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M3 9h15v4a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V9Z" />
                    <path
                      d="M18 10h1.5a2.5 2.5 0 0 1 0 5H18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                    <path
                      d="M6 5.5c.4-1 1.5-1 1.3-2M10 5.5c.4-1 1.5-1 1.3-2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="whitespace-nowrap text-[11px] font-bold italic leading-none sm:text-sm">
                    Buy me a coffee
                  </span>
                </a>

                <a
                  href={SITE_METADATA.support.kofi}
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-full border border-gray-300 bg-[#f5f5f5] px-3 py-2.5 text-black shadow-sm transition-transform hover:scale-[1.03] active:scale-95 dark:border-transparent sm:flex-none sm:min-w-[170px] sm:px-4"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 shrink-0 sm:h-5 sm:w-5"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 6h11v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V6Z"
                      fill="#FF5E5B"
                    />
                    <path
                      d="M15 8h1.8a2 2 0 0 1 0 4H15"
                      fill="none"
                      stroke="#FF5E5B"
                      strokeWidth="1.6"
                    />
                    <path
                      d="M9.5 8.3c-.9-.9-2.3-.2-2.3.9 0 1.1 1.6 2.2 2.3 2.7.7-.5 2.3-1.6 2.3-2.7 0-1.1-1.4-1.8-2.3-.9Z"
                      fill="#fff"
                    />
                  </svg>
                  <span className="whitespace-nowrap text-[11px] font-semibold leading-none sm:text-sm">
                    Support me on Ko-fi
                  </span>
                </a>

                <a
                  href={SITE_METADATA.support.paypal}
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-full bg-primary-500/70 px-3 py-2.5 shadow-sm transition-transform hover:scale-[1.03] active:scale-95 sm:flex-none sm:min-w-[170px] sm:px-4"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 shrink-0 sm:h-5 sm:w-5"
                    aria-hidden="true"
                  >
                    <path
                      d="M7 4h6.2c2.5 0 4 1.3 3.6 3.6-.4 2.7-2.3 4.2-5 4.2H9.4L8.5 17H5.8L7 4Z"
                      fill="#003087"
                    />
                    <path
                      d="M9.5 6.3h6c2.4 0 3.9 1.2 3.5 3.5-.4 2.6-2.2 4.1-4.8 4.1h-2.5l-.8 4.8H8.3l1.2-12.4Z"
                      fill="#009cde"
                      opacity="0.85"
                    />
                  </svg>
                  <span className="whitespace-nowrap text-[11px] font-bold leading-none text-white sm:text-sm">
                    PayPal
                  </span>
                </a>
              </div>
            </div>
          </section>

          {/* About This Blog Section */}
          <section className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700">
            <h2 className="mt-0">About This Blog</h2>
            <div>
              <h3>Why I Write</h3>
              <blockquote className="border-l-4 border-orange-500 dark:border-green-600 pl-4">
                <p>Sharing is learning!</p>
              </blockquote>
              <p>
                This blog is my digital journal—a place where I document the
                insights, lessons, and occasional &ldquo;aha!&rdquo; moments
                from my journey as a software engineer. Writing about what I
                learn helps me understand it better, and if someone else finds
                it useful along the way, that&apos;s even better{' '}
                <Twemoji emoji="writing-hand" />.
              </p>
              <p>
                Think of this as a conversation between friends, not a formal
                textbook. I keep things simple, direct, and hopefully
                entertaining. After all, learning should be fun, not a chore.
              </p>
            </div>
            <div>
              <h3>Features</h3>
              <ul>
                <li>
                  <Twemoji emoji="atom-symbol" /> <strong>Next.js 15</strong>{' '}
                  (App Router) and <strong>React 19</strong>.
                </li>
                <li>
                  <Twemoji emoji="artist-palette" />{' '}
                  <strong>Tailwind CSS</strong> with custom{' '}
                  <strong>Black, Orange, and Green</strong> theme.
                </li>
                <li>
                  <Twemoji emoji="sparkles" /> Custom animated{' '}
                  <LinkPreview
                    url="https://ui.aceternity.com/components/hero-parallax"
                    className="font-bold"
                  >
                    Hero Parallax
                  </LinkPreview>{' '}
                  landing with{' '}
                  <LinkPreview
                    url="https://www.framer.com/motion/"
                    className="font-bold"
                  >
                    Framer Motion
                  </LinkPreview>
                  .
                </li>
                <li>
                  <Twemoji emoji="writing-hand" />{' '}
                  <LinkPreview url="https://novel.sh/" className="font-bold">
                    Novel.sh AI Editor
                  </LinkPreview>{' '}
                  with{' '}
                  <LinkPreview url="https://kinde.com/" className="font-bold">
                    Kinde Auth
                  </LinkPreview>{' '}
                  for secure admin access.
                </li>
                <li>
                  <Twemoji emoji="card-file-box" /> <strong>PostgreSQL</strong>{' '}
                  with{' '}
                  <LinkPreview
                    url="https://www.prisma.io/"
                    className="font-bold"
                  >
                    Prisma ORM
                  </LinkPreview>{' '}
                  for type-safe database operations.
                </li>
                <li>
                  <Twemoji emoji="open-book" />{' '}
                  <LinkPreview
                    url="https://contentlayer.dev/"
                    className="font-bold"
                  >
                    Contentlayer
                  </LinkPreview>{' '}
                  & MDX for blog content.
                </li>
                <li>
                  <Twemoji emoji="musical-notes" /> <strong>Spotify</strong> and{' '}
                  <Twemoji emoji="laptop" /> <strong>GitHub</strong>{' '}
                  integrations.
                </li>
                <li>
                  <Twemoji emoji="bar-chart" />{' '}
                  <LinkPreview
                    url="https://cloud.umami.is/"
                    className="font-bold"
                  >
                    Umami
                  </LinkPreview>{' '}
                  analytics.
                </li>
              </ul>
            </div>
            <div>
              <h3>Credits</h3>
              <p>
                This blog is hosted on{' '}
                <LinkPreview url="https://vercel.com/" className="font-bold">
                  Vercel
                </LinkPreview>
                , built with{' '}
                <LinkPreview url="https://nextjs.org/" className="font-bold">
                  Next.js
                </LinkPreview>{' '}
                and{' '}
                <LinkPreview
                  url="https://tailwindcss.com/"
                  className="font-bold"
                >
                  Tailwind CSS.
                </LinkPreview>{' '}
              </p>
              <p>
                A huge thanks to{' '}
                <LinkPreview url="https://x.com/hta218_" className="font-bold">
                  Leo Huynh
                </LinkPreview>{' '}
                for the minimal, lightweight, and super easy-to-customize blog
                starter.
              </p>
              <p>
                See my{' '}
                <LinkPreview
                  url="https://github.com/xi-Rick/danadavis.dev"
                  className="font-bold"
                >
                  GitHub repository
                </LinkPreview>{' '}
                for this blog.
              </p>
            </div>
            <div>
              <h3>Legacy versions</h3>
              <p>
                I started this blog since 2019 and up until now it has 2 legacy
                versions:
              </p>
              <ul>
                <li>
                  <code>v1</code> built with <strong>NextJS v14</strong> using
                  Page router:{' '}
                  <a
                    href="https://open-source-portfolio.vercel.app/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    https://open-source-portfolio.vercel.app/
                  </a>
                </li>
                <li>
                  <code>v0</code> built with <strong>Gatsby</strong>:{' '}
                  <a
                    href="https://danadavis-blog-legacy.vercel.app/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    https://danadavis-blog-legacy.vercel.app/
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3>Assets</h3>
              <p>
                Most of the images in my blog are from{' '}
                <LinkPreview url="https://unsplash.com/" className="font-bold">
                  Unsplash
                </LinkPreview>
                , gifs from{' '}
                <LinkPreview url="https://giphy.com/" className="font-bold">
                  GIPHY
                </LinkPreview>
                , and illustrations are from{' '}
                <LinkPreview url="https://storyset.com/" className="font-bold">
                  Storyset
                </LinkPreview>
                .
              </p>
              <p>
                Thanks for the free resources <Twemoji emoji="folded-hands" />.
              </p>
            </div>
          </section>
          <div className="mt-12 pt-8">
            <blockquote className="text-lg italic text-orange-600 dark:text-green-400 border-l-4 border-orange-500 dark:border-green-600 pl-4">
              &ldquo;Vision? What do you know about my vision? My vision would
              turn your world upside down, tear asunder your illusions, and send
              the sanctuary of your own ignorance crashing down around you. Now
              ask yourself, Are you ready to see that vision?&rdquo;
            </blockquote>
          </div>
        </div>
      </div>
    </Container>
  )
}
