import { clsx } from 'clsx'
import dynamic from 'next/dynamic'
import { Container } from '~/components/ui/container'
import { SITE_METADATA } from '~/data/site-metadata'
import { FooterBottom } from './footer-bottom'
import { FooterNav } from './footer-nav'
import { LogoAndRepo } from './logo-and-repo'
import { Signature } from './signature'

// FooterMeta shows dynamic time and uses `Date`/`Intl` which can vary between
// server and client rendering; to avoid hydration mismatch, import it only on
// the client with SSR disabled.
const FooterMeta = dynamic(
  () => import('./footer-meta').then((mod) => mod.FooterMeta),
  {
    ssr: false,
  },
)

export function Footer() {
  return (
    <Container as="footer" className="mt-8 mb-4 md:mt-16">
      <div
        className={clsx([
          'grid grid-cols-1 gap-x-8 gap-y-8 py-8 md:grid-cols-2 xl:grid-cols-3',
          'border-t border-gray-200 dark:border-gray-700',
        ])}
      >
        <div className="col-span-1 space-y-4 xl:col-span-2">
          <LogoAndRepo />
          <div className="text-gray-500 italic dark:text-gray-400">
            {SITE_METADATA.description}
          </div>
          <div className="pt-4">
            <div className="flex gap-26 py-1.5 md:gap-32">
              <div className="flex items-center">
                <Signature className="h-12 w-20 md:w-24 -ml-8 -mt-8" />
              </div>
              <FooterMeta />
            </div>
          </div>
        </div>
        <FooterNav />
      </div>
      <FooterBottom />
    </Container>
  )
}
