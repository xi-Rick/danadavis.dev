import { Container } from '~/components/ui/container'
import { Link } from '~/components/ui/link'
import { RadiantCard } from '~/components/ui/radiant-card'
import { TiltedGridBackground } from '~/components/ui/tilted-grid-background'
import { Twemoji } from '~/components/ui/twemoji'
import FourOhFour from '~/icons/404.svg'

export default function NotFound() {
  return (
    <Container className="pt-6 lg:pt-12">
      <RadiantCard className="p-6 md:p-12">
        <div className="relative flex flex-col items-center justify-center py-8">
          {/* Tilted grid for light mode and radiant card provides dark grid */}
          <TiltedGridBackground className="inset-0 -z-10 block dark:hidden" />

          <FourOhFour className="mx-auto aspect-square w-[260px] max-w-[80vw] md:w-[420px] drop-shadow-xl" />

          <div className="space-y-6 pt-8 md:pt-12 xl:pt-16 text-center">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Hmm... it looks like you&apos;re lost.
              <span className="ml-2 inline-block align-middle">
                <Twemoji emoji={'face-with-monocle'} />
              </span>
            </h2>

            <p className="mx-auto max-w-xl text-base text-foreground/80">
              The page you&apos;re looking for can&apos;t be found. Maybe it
              moved, or maybe the link was mistyped. Either way, I kept some
              other good things around the site — try one of these.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/"
                className="inline-flex items-center rounded-lg px-5 py-3 accent-bg text-white dark:text-white no-underline font-medium shadow-sm hover:opacity-95"
              >
                Back to homepage
              </Link>

              <Link
                href="/projects"
                className="inline-flex items-center rounded-lg px-5 py-3 accent-green-bg text-white no-underline font-medium shadow-sm hover:opacity-95"
              >
                See projects
              </Link>
            </div>

            <div className="mt-4 text-sm text-foreground/60">
              Or try browsing the site map or tags to find something similar.
            </div>
          </div>
        </div>
      </RadiantCard>
    </Container>
  )
}
