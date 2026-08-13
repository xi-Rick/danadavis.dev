'use client'

import Giscus from '@giscus/react'
import { useTheme } from 'next-themes'
import type { GiscusConfig } from '~/lib/giscus'

export default function Comments({ config }: { config: GiscusConfig }) {
  const { resolvedTheme } = useTheme()

  return (
    <div
      id="comment"
      className="not-prose mt-12 space-y-8 border-t border-gray-200 pt-6 dark:border-gray-700"
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-gray-500 dark:text-gray-400">
          comments
        </span>
      </div>
      <Giscus
        id="comments-container"
        repo={config.repo}
        repoId={config.repoId}
        category={config.category}
        categoryId={config.categoryId}
        mapping={config.mapping}
        reactionsEnabled={config.reactionsEnabled}
        emitMetadata={config.emitMetadata}
        inputPosition={config.inputPosition}
        theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
        lang={config.lang}
        loading="lazy"
      />
    </div>
  )
}
