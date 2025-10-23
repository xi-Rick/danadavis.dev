'use client'
import { DiscussionEmbed } from 'disqus-react'
import { useTheme } from 'next-themes'
import { useCallback, useEffect, useRef, useState } from 'react'

interface CommentsProps {
  url: string
  identifier: string
  title: string
  className?: string
}

export default function Comments({
  url,
  identifier,
  title,
  className,
}: CommentsProps) {
  const shortname = process.env.NEXT_PUBLIC_DISQUS_SHORTNAME

  const [loadComments, setLoadComments] = useState(true) // Changed to true for auto-load
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()
  const previousTheme = useRef(resolvedTheme)
  const disqusResetTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Mark as mounted after hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  // Auto-load comments on mount
  useEffect(() => {
    setLoadComments(true)
    previousTheme.current = resolvedTheme
  }, [resolvedTheme])

  // Enhanced theme change handler
  const handleThemeChange = useCallback(() => {
    if (
      !loadComments ||
      !resolvedTheme ||
      previousTheme.current === resolvedTheme
    ) {
      return
    }

    console.log(
      'Theme changed from',
      previousTheme.current,
      'to',
      resolvedTheme,
      '- reloading Disqus',
    )

    // Clear any existing timeout
    if (disqusResetTimeoutRef.current) {
      clearTimeout(disqusResetTimeoutRef.current)
    }

    // Method 1: Try to reset existing Disqus instance
    try {
      interface WindowWithDisqus {
        DISQUS?: {
          reset: (config: { reload: boolean; config: () => void }) => void
        }
      }

      const windowWithDisqus = window as unknown as WindowWithDisqus
      if (
        windowWithDisqus.DISQUS &&
        typeof windowWithDisqus.DISQUS.reset === 'function'
      ) {
        windowWithDisqus.DISQUS.reset({
          reload: true,
          config: function () {
            this.page.url = url
            this.page.identifier = identifier
            this.page.title = title
          },
        })

        // Update theme reference
        previousTheme.current = resolvedTheme
        return
      }
    } catch (resetError) {
      console.warn('Failed to reset Disqus directly:', resetError)
    }

    // Method 2: Force component reload as fallback
    disqusResetTimeoutRef.current = setTimeout(() => {
      setReloadKey((prev) => prev + 1)
      previousTheme.current = resolvedTheme
    }, 300)
  }, [loadComments, resolvedTheme, url, identifier, title])

  // Listen for theme changes
  useEffect(() => {
    handleThemeChange()
  }, [handleThemeChange])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (disqusResetTimeoutRef.current) {
        clearTimeout(disqusResetTimeoutRef.current)
      }
    }
  }, [])

  // Handle missing shortname gracefully
  if (!shortname) {
    console.error('NEXT_PUBLIC_DISQUS_SHORTNAME is not defined')
    return null
  }

  if (error) {
    return (
      <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={() => {
            setError(null)
            setReloadKey(0)
          }}
          className="mt-2 text-sm text-red-600 underline hover:no-underline dark:text-red-400"
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className={className}>
      <div
        id="comment"
        key={`comments-${reloadKey}-${resolvedTheme}`}
        // Reset to standard colors that Disqus can parse, adapted for theme
        style={{
          colorScheme: mounted && resolvedTheme === 'dark' ? 'dark' : 'light',
          color:
            mounted && resolvedTheme === 'dark'
              ? 'rgb(255, 255, 255)'
              : 'rgb(0, 0, 0)',
          backgroundColor:
            mounted && resolvedTheme === 'dark'
              ? 'rgb(0, 0, 0)'
              : 'rgb(255, 255, 255)',
        }}
      >
        {loadComments && (
          <DiscussionEmbed
            shortname={shortname}
            config={{
              url,
              identifier,
              title,
            }}
          />
        )}
      </div>
    </div>
  )
}
