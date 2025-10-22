'use client'

import { type LucideProps, PenTool, Quote } from 'lucide-react'
import type { SelectBook } from '~/db/schema'

export function BookDetails({ book }: { book: SelectBook }) {
  const tab = 'summary'
  return (
    <div className="space-y-3">
      <div className="relative md:pr-4">
        {tab === 'summary' ? (
          <TabContent icon={Quote} content={book.bookDescription} />
        ) : (
          <TabContent icon={PenTool} content={book.userReview} />
        )}
      </div>
    </div>
  )
}

function TabContent(props: {
  icon: React.FC<LucideProps>
  content: string | null
}) {
  const { icon: Icon, content } = props
  return (
    <>
      <Icon
        size={20}
        strokeWidth={1.5}
        className="absolute -top-20 right-8 z-[-1] h-10 w-10 accent md:-top-20"
      />
      <p className="line-clamp-5 text-gray-500 italic dark:text-gray-400">
        {content || 'N/A'}
      </p>
    </>
  )
}
