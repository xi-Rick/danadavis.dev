'use client'

import { DiscussionEmbed } from 'disqus-react'

interface CommentsProps {
  url: string
  identifier: string
  title: string
  className?: string
}

export function Comments({ url, identifier, title, className }: CommentsProps) {
  const shortname = process.env.NEXT_PUBLIC_DISQUS_SHORTNAME as string

  return (
    <div id="comment" className={className}>
      <DiscussionEmbed
        shortname={shortname}
        config={{
          url,
          identifier,
          title,
        }}
      />
    </div>
  )
}
