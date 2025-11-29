'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Link } from '~/components/ui/link'

export default function CoursePlayer({
  initialVideoId,
  curriculum = [],
}: {
  initialVideoId?: string
  curriculum?: { title: string; videoUrl: string; videoId?: string }[]
}) {
  const firstId = initialVideoId || curriculum?.[0]?.videoId || ''
  const [currentId, setCurrentId] = useState<string>(firstId)

  const getEmbedUrl = (id?: string) => {
    if (!id) return ''
    return `https://www.youtube.com/embed/${id}`
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
      <div className="w-full aspect-video rounded-lg overflow-hidden border-2 border-black dark:border-white">
        {currentId ? (
          <iframe
            src={getEmbedUrl(currentId)}
            title="Course player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            className="w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-100 dark:bg-black/20">
            <span className="text-sm text-gray-500">No video selected</span>
          </div>
        )}
      </div>

      <div>
        <div className="space-y-2">
          {curriculum?.map((item) => (
            <div
              key={item.videoId || item.videoUrl}
              className={`flex items-center justify-between gap-4 rounded-lg px-3 py-2 cursor-pointer border ${
                (item.videoId || item.videoUrl) === currentId
                  ? 'bg-orange-100 dark:bg-green-900/20 border-black dark:border-white'
                  : 'border-transparent hover:bg-gray-50 dark:hover:bg-white/5'
              }`}
              onClick={() =>
                setCurrentId(item.videoId || extractId(item.videoUrl))
              }
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-8 overflow-hidden rounded-sm bg-black/10 relative">
                  <Image
                    src={`https://img.youtube.com/vi/${item.videoId || extractId(item.videoUrl)}/hqdefault.jpg`}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-sm">
                  <div className="font-medium">{item.title}</div>
                </div>
              </div>
              <div className="text-xs text-gray-500">Play</div>
            </div>
          ))}
        </div>
        {curriculum?.length === 0 && (
          <div className="mt-4 text-sm text-gray-500">
            No curriculum items available for this course.
          </div>
        )}
      </div>
    </div>
  )
}

function extractId(url?: string) {
  if (!url) return ''
  const match = url.match(/[?&]v=([^&]+)/)
  if (match) return match[1]
  const short = url.match(/youtu\.be\/(.+)/)
  if (short) return short[1]
  return url
}
