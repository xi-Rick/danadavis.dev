import type { ReactNode } from 'react'
import { CareerTimeline } from '~/components/author/career'
import { SocialAccounts } from '~/components/author/social-accounts'
import { Button } from '~/components/ui/button'
import { Container } from '~/components/ui/container'
import { Image } from '~/components/ui/image'
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
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={SITE_METADATA.support.buyMeACoffee}
                  target="_blank"
                  className="[&_.image-container]:mx-0"
                  rel="noreferrer"
                >
                  <Image
                    src="/static/images/bmc-button.png"
                    alt="Buy Me A Coffee"
                    width={213.7}
                    height={60}
                    style={{ height: 60 }}
                  />
                </a>
                <a
                  href={SITE_METADATA.support.kofi}
                  target="_blank"
                  className="[&_.image-container]:mx-0"
                  rel="noreferrer"
                >
                  <Image
                    src="/static/images/kofi.png"
                    alt="Support me on Ko-fi"
                    width={297}
                    height={60}
                    style={{ height: 60, width: 'auto' }}
                  />
                </a>
                <a
                  href={SITE_METADATA.support.paypal}
                  target="_blank"
                  className="flex h-15 w-[214px] items-center rounded-lg bg-primary-500/70 p-1"
                  rel="noreferrer"
                >
                  <Image
                    src="/static/images/paypal-logo.png"
                    alt="Donate via PayPal"
                    width={225.88}
                    height={60}
                    style={{ height: 30, width: 'auto' }}
                  />
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
                  Tailwind CSS
                </LinkPreview>{' '}
                using <strong>Tailwind Nextjs Starter Blog</strong>.
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
