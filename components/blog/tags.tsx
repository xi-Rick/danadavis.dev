import { clsx } from 'clsx'
import { slug } from 'github-slugger'
import { Link } from '~/components/ui/link'

export function TagsList({ tags }: { tags: string[] }) {
  if (!tags || tags.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-2 md:gap-3">
      {tags.map((tag) => (
        <Tag key={tag} text={tag} />
      ))}
    </div>
  )
}

export function Tag({
  text,
  size = 'sm',
}: {
  text: string
  size?: 'sm' | 'md'
}) {
  const tagName = text.split(' ').join('-')
  return (
    <Link
      href={`/tags/${slug(text)}`}
      className={clsx([
        'inline-block rounded-lg border-2 font-semibold transition-all duration-200',
        'border-black bg-white text-black hover:border-orange-500 hover:bg-orange-500 hover:text-white',
        'dark:border-white dark:bg-black dark:text-white dark:hover:border-green-500 dark:hover:bg-green-500 dark:hover:text-white',
        size === 'sm' ? 'px-2 py-0.5 text-sm' : 'px-3 py-1 text-base',
      ])}
    >
      <span data-umami-event={`tag-${tagName}`}>#{tagName}</span>
    </Link>
  )
}
