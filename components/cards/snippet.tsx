import { clsx } from 'clsx'
import type { Snippet } from 'contentlayer/generated'
import { Brand, resolveBrandKey } from '~/components/ui/brand'
import { GradientBorder } from '~/components/ui/gradient-border'
import { GrowingUnderline } from '~/components/ui/growing-underline'
import { Link } from '~/components/ui/link'
import { TiltedGridBackground } from '~/components/ui/tilted-grid-background'
import type { CoreContent } from '~/types/data'

type SnippetCore = CoreContent<Snippet> & {
  icon?: string
  language?: string
  framework?: string
  heading?: string
  summary?: string
  title?: string
  path?: string
  tags?: string[]
}

export function SnippetCard({ snippet }: { snippet: CoreContent<Snippet> }) {
  const { icon, heading, summary, title, path, tags, language, framework } =
    snippet as SnippetCore

  // Prefer explicit icon, then framework, language, then first tag
  const brandName = resolveBrandKey([icon, framework, language, tags?.[0]])
  return (
    <GradientBorder className="rounded-2xl">
      <Link
        href={`/${path}`}
        title={title}
        className={clsx([
          'relative flex h-full min-h-[180px] rounded-2xl',
          'bg-zinc-50 dark:bg-white/5',
          'transition-shadow hover:shadow-md',
          'hover:shadow-zinc-900/5 dark:hover:shadow-black/15',
        ])}
        prefetch={false}
      >
        <TiltedGridBackground className="inset-0" />
        <div className="absolute -top-5 left-4 z-10 h-12 w-12">
          <Brand
            name={brandName}
            as="icon"
            className="h-12 w-12 text-gray-900 dark:text-white"
            aria-hidden="true"
          />
        </div>
        <div className="relative w-full px-4 pt-6 pb-6">
          <h3 className="mt-4 text-xl leading-7 font-semibold min-h-[28px]">
            <GrowingUnderline>{heading}</GrowingUnderline>
          </h3>
          <p className="mt-1.5 line-clamp-2 min-h-[48px] text-zinc-600 dark:text-zinc-400">
            {summary}
          </p>
        </div>
      </Link>
    </GradientBorder>
  )
}
