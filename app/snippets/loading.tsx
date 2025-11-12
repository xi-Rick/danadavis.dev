import { Container } from '~/components/ui/container'
import { PageHeader } from '~/components/ui/page-header'

export default function SnippetsLoading() {
  return (
    <Container className="pt-4 lg:pt-12">
      <PageHeader
        title="Snippets"
        description={
          <>
            <p>
              My personal stash of code snippets that make my life easier.
              They&apos;re simple and reusable. Feel free to copy, tweak, and
              use them as you like.
            </p>
            <p className="mt-3 italic">
              *Some snippets written by me, some are from the internet (Thanks
              to the open source community).
            </p>
          </>
        }
        className="border-b border-gray-200 dark:border-gray-700"
      />
      <div className="py-10">
        <div className="grid-cols-2 space-y-10 gap-x-6 gap-y-10 md:grid md:space-y-0">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="relative flex h-full rounded-2xl bg-zinc-50 dark:bg-white/5 p-4 animate-pulse"
            >
              <div className="absolute -top-5 left-4 h-12 w-12 rounded-lg bg-gray-300 dark:bg-gray-700" />
              <div className="relative w-full px-4 pt-6 pb-6">
                <div className="mt-4 h-6 w-3/4 rounded bg-gray-300 dark:bg-gray-700" />
                <div className="mt-2 h-4 w-full rounded bg-gray-300 dark:bg-gray-700" />
                <div className="mt-1 h-4 w-2/3 rounded bg-gray-300 dark:bg-gray-700" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  )
}
