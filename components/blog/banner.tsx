import { clsx } from 'clsx'
import { GritBackground } from '~/components/ui/grit-background'
import { GrowingUnderline } from '~/components/ui/growing-underline'
import { Image, Zoom } from '~/components/ui/image'
import { Link } from '~/components/ui/link'
import { capitalize, kebabCaseToPlainText } from '~/utils/misc'

export function Banner({
  banner,
  className,
}: {
  banner: string
  className?: string
}) {
  const [path, author, filename] = banner.split('__')
  const handle = path.split('/').pop() || ''
  const hasCredit = banner.includes('__') && author && filename
  return (
    <div className={clsx('relative', className)}>
      {hasCredit && (
        <Credit
          author={author}
          id={filename.split('.')[0]}
          className={clsx([
            'absolute top-4 right-4 z-10',
            'hidden rounded-lg px-3 py-0.5 lg:block',
            'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-200',
          ])}
        />
      )}
      <Zoom>
        <Image
          src={banner}
          alt={
            capitalize(kebabCaseToPlainText(handle)) || 'Article banner photo'
          }
          width={1600}
          height={900}
          className="h-auto w-full rounded-lg"
          unoptimized
        />
      </Zoom>
      <GritBackground className="inset-0 rounded-lg opacity-75" />
    </div>
  )
}

interface CreditProps {
  author: string
  id: string
  className?: string
}

function Credit({ author, id, className }: CreditProps) {
  if (author && id) {
    return (
      <div className={clsx('text-sm italic', className)}>
        Photo by{' '}
        <Link
          className="font-semibold"
          href={`https://unsplash.com/@${author}`}
        >
          <GrowingUnderline data-umami-event="banner-author">
            @{author}
          </GrowingUnderline>
        </Link>{' '}
        on{' '}
        <Link
          className="font-semibold"
          href={`https://unsplash.com/photos/${id}`}
        >
          <GrowingUnderline data-umami-event="banner-unsplash">
            Unsplash
          </GrowingUnderline>
        </Link>
      </div>
    )
  }
  return null
}
