import { genPageMetadata } from 'app/seo'
import { Tag } from '~/components/blog/tags'
import { Container } from '~/components/ui/container'
import tagData from '~/json/tag-data.json'

export const metadata = genPageMetadata({
  title: 'Tags',
  description: 'Things I blog about',
})

export default async function Page() {
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])
  return (
    <Container className="pt-4 md:pt-0">
      <div className="flex flex-col items-start justify-start md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6">
        <div className="space-x-2 border-b border-gray-200 pt-6 pb-8 md:border-b-0 md:pb-0 dark:border-gray-700">
          <h1 className="text-3xl leading-9 font-bold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:border-r-2 md:px-6 md:text-6xl md:leading-14 dark:text-gray-100">
            Tags
          </h1>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 py-8 md:my-0 md:py-8">
          {tagKeys.length === 0 && 'No tags found.'}
          {sortedTags.map((t) => {
            return (
              <div key={t} className="flex items-center gap-0.5">
                <Tag text={t} size="md" />
                <span className="text-gray-600 dark:text-gray-300">
                  ({tagCounts[t]})
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </Container>
  )
}
