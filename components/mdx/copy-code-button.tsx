'use client'

import { clsx } from 'clsx'
import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

let timeoutId: ReturnType<typeof setTimeout> | undefined

export function CopyCodeButton({
  className,
  parent,
}: {
  className?: string
  parent: 'code-title' | 'code-block'
}) {
  const [copied, setCopied] = useState(false)

  function handleCopy(e: React.MouseEvent<HTMLButtonElement>) {
    const button = e.currentTarget
    let preTag: HTMLPreElement | null = null
    if (parent === 'code-block') {
      preTag = button.nextElementSibling as HTMLPreElement
    } else if (parent === 'code-title') {
      const figure = button.parentElement?.nextElementSibling
      preTag = figure?.querySelector('pre') as HTMLPreElement
    }
    if (preTag) {
      const textContent = preTag.textContent
      if (textContent) {
        navigator.clipboard.writeText(textContent)
        setCopied(true)
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => setCopied(false), 2000)
      }
    }
  }

  return (
    <button
      type="button"
      aria-label="Copy code"
      className={clsx([
        'copy-code',
        'bg-solarized-light dark:bg-github-dark-dimmed p-2',
        className,
      ])}
      onClick={handleCopy}
    >
      {copied ? (
        <Check className="h-4.5 w-4.5" />
      ) : (
        <Copy className="h-4.5 w-4.5" />
      )}
    </button>
  )
}
