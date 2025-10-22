'use client'

import { clsx } from 'clsx'
import { useState } from 'react'
import type { Blog, Snippet } from '~/.contentlayer/generated'
import { PostCardListView } from '~/components/blog/post-card-list-view'
import { SnippetCard } from '~/components/cards/snippet'
import { GrowingUnderline } from '~/components/ui/growing-underline'
import { Link } from '~/components/ui/link'
import type { CoreContent } from '~/types/data'

export function LatestPosts({
  posts,
  snippets,
}: {
  posts: CoreContent<Blog>[]
  snippets: CoreContent<Snippet>[]
}) {
  const [view, setView] = useState<'posts' | 'snippets'>('posts')
  return (
    <div className="pt-8 md:pt-0">
      <div className="flex justify-between pb-4 md:pb-8">
        <div className="space-y-4">
          <h3 className="flex text-2xl font-bold sm:text-2xl sm:leading-10 md:text-4xl">
            <span className="mr-2 md:mr-3">Latest</span>
            <button
              type="button"
              className={clsx(
                'underline-offset-4 transition-colors',
                view === 'posts'
                  ? 'underline'
                  : 'text-gray-300 hover:text-gray-900 dark:text-gray-500 dark:hover:text-gray-200',
              )}
              onClick={() => setView('posts')}
            >
              <GrowingUnderline data-umami-event="latest-posts">
                posts
              </GrowingUnderline>
            </button>
            <span className="mx-1">/</span>
            <button
              type="button"
              className={clsx(
                'underline-offset-4 transition-colors',
                view === 'snippets'
                  ? 'underline'
                  : 'text-gray-300 hover:text-gray-900 dark:text-gray-500 dark:hover:text-gray-200',
              )}
              onClick={() => setView('snippets')}
            >
              <GrowingUnderline data-umami-event="latest-snippets">
                snippets
              </GrowingUnderline>
            </button>
          </h3>
        </div>
        <div className="pt-2 items-center justify-end text-base leading-6 font-medium">
          <Link
            href={view === 'posts' ? '/blog' : '/snippets'}
            className=""
            aria-label="All posts"
          >
            <GrowingUnderline data-umami-event="all-posts">
              <span className="hidden md:inline-block">View all {view}</span>
              <span className="md:hidden">More</span> &rarr;
            </GrowingUnderline>
          </Link>
        </div>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700" />
      {view === 'posts' ? (
        <ul className="space-y-12 divide-gray-200 pt-6 md:space-y-20 md:pt-10 dark:divide-gray-700">
          {!posts.length && 'No posts found.'}
          {posts.map((post, idx) => (
            <li key={post.slug}>
              <PostCardListView
                post={post}
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
            </li>
          ))}
        </ul>
      ) : (
        <div className="py-10">
          <div className="grid-cols-2 space-y-10 gap-x-6 gap-y-10 md:grid md:space-y-0">
            {!snippets.length && 'No snippets found.'}
            {snippets.map((snippet) => (
              <SnippetCard snippet={snippet} key={snippet.path} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
