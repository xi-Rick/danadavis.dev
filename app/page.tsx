'use client'

import { allBlogs, allSnippets } from 'contentlayer/generated'
import { Home } from '~/components/home-page'
import { allCoreContent } from '~/utils/contentlayer'
import { sortPosts } from '~/utils/misc'

const MAX_POSTS_DISPLAY = 3
const MAX_SNIPPETS_DISPLAY = 4

export default function HomePage() {
  const publishedPosts = allCoreContent(sortPosts(allBlogs)).filter(
    (post) => !post.draft,
  )
  const publishedSnippets = allCoreContent(sortPosts(allSnippets)).filter(
    (snippet) => !snippet.draft,
  )

  return (
    <Home
      posts={publishedPosts.slice(0, MAX_POSTS_DISPLAY)}
      snippets={publishedSnippets.slice(0, MAX_SNIPPETS_DISPLAY)}
    />
  )
}
