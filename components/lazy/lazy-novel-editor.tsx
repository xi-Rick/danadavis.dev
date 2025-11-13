'use client'

import dynamic from 'next/dynamic'

interface NovelEditorProps {
  markdown?: string
  onChange?: (content: string) => void
}

const NovelEditor = dynamic(() => import('@/components/novel-editor'), {
  ssr: false,
  loading: () => (
    <div className="w-full min-h-[400px] flex items-center justify-center border-2 border-black dark:border-white rounded-lg">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-4 border-orange-500 dark:border-green-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Loading editor...
        </p>
      </div>
    </div>
  ),
})

export function LazyNovelEditor(props: NovelEditorProps) {
  return <NovelEditor {...props} />
}
