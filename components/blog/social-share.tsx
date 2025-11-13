'use client'

import { Menu, MenuButton, MenuItems, Transition } from '@headlessui/react'
import { clsx } from 'clsx'
import { Facebook, Link, Linkedin, Share2 } from 'lucide-react'
import { Fragment, useState } from 'react'
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
} from 'react-share'
import { SITE_METADATA } from '~/data/site-metadata'
import XIcon from '~/icons/x.svg'

type SocialButtonsProps = {
  postUrl: string
  filePath: string
  title: string
  className?: string
}

export function SocialShare({
  postUrl,
  filePath,
  title,
  className,
}: SocialButtonsProps) {
  const [copied, setCopied] = useState(false)

  function handleCopyLink() {
    navigator.clipboard.writeText(postUrl)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <MenuButton
        aria-label="More links"
        className={clsx(
          'flex items-center gap-1 px-3 py-1 font-medium text-[var(--color-text)] opacity-60 hover:opacity-100 transition-opacity',
          className,
        )}
        data-umami-event="social-share"
      >
        <span>Share</span>
        <Share2 strokeWidth={1.5} size={16} />
      </MenuButton>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems
          className={clsx([
            'mt-2 w-56',
            'absolute right-0 z-50 rounded-md',
            'origin-top-right translate-x-[calc(50%-42px)]',
            'ring-1 ring-[var(--color-border)] focus:outline-hidden',
            'bg-[var(--color-bg)] shadow-lg',
            'divide-y divide-[var(--color-border)]',
          ])}
        >
          <div className="px-4 py-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex items-center gap-2.5 text-[var(--color-text)] opacity-60 hover:text-[var(--color-accent-orange)] dark:hover:text-[var(--color-accent-green)] transition-colors"
            >
              <Link strokeWidth={1.5} size={18} />
              <span>{copied ? 'Copied' : 'Copy link'}</span>
            </button>
          </div>
          <div className="space-y-3 px-4 py-3">
            <TwitterShareButton
              url={postUrl}
              title={title}
              via={SITE_METADATA.x}
              className="flex items-center gap-2.5 text-[var(--color-text)]! opacity-60 hover:text-[var(--color-accent-orange)]! dark:hover:text-[var(--color-accent-green)]! transition-colors"
            >
              <XIcon className="h-4 w-4" fill="#fff" viewBox="0 0 1200 1227" />
              <span className="">Share on X (Twitter)</span>
            </TwitterShareButton>
            <LinkedinShareButton
              url={postUrl}
              title={title}
              className="flex items-center gap-2.5 text-[var(--color-text)]! opacity-60 hover:text-[var(--color-accent-orange)]! dark:hover:text-[var(--color-accent-green)]! transition-colors"
            >
              <Linkedin strokeWidth={1.5} size={18} />
              <span className="">Share on LinkedIn</span>
            </LinkedinShareButton>
            <FacebookShareButton
              url={postUrl}
              className="flex items-center gap-2.5 text-[var(--color-text)]! opacity-60 hover:text-[var(--color-accent-orange)]! dark:hover:text-[var(--color-accent-green)]! transition-colors"
            >
              <Facebook strokeWidth={1.5} size={18} />
              <span className="">Share on Facebook</span>
            </FacebookShareButton>
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  )
}
