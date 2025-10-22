'use client'

import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from '@headlessui/react'
import {
  clearAllBodyScrollLocks,
  disableBodyScroll,
  enableBodyScroll,
} from 'body-scroll-lock'
import { clsx } from 'clsx'
import { Menu, X } from 'lucide-react'
import { Fragment, useEffect, useRef, useState } from 'react'
import { Link } from '~/components/ui/link'
import { Twemoji } from '~/components/ui/twemoji'
import { HEADER_NAV_LINKS, MORE_NAV_LINKS } from '~/data/navigation'
import { SITE_METADATA } from '~/data/site-metadata'
import { Logo } from './logo'

export function MobileNav() {
  const [navShow, setNavShow] = useState(false)
  const navRef = useRef(null)

  const onToggleNav = () => {
    setNavShow((status) => {
      if (status) {
        enableBodyScroll(navRef.current)
      } else {
        // Prevent scrolling
        disableBodyScroll(navRef.current)
      }
      return !status
    })
  }

  useEffect(() => {
    return clearAllBodyScrollLocks
  })

  return (
    <>
      <div
        className={clsx([
          'rounded-sm p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700',
          'flex items-center justify-center sm:hidden',
        ])}
        data-umami-event="mobile-nav-toggle"
      >
        <button type="button" aria-label="Toggle Menu" onClick={onToggleNav}>
          <Menu size={22} />
        </button>
      </div>
      <Transition appear show={navShow} as={Fragment} unmount={false}>
        <Dialog as="div" onClose={onToggleNav} unmount={false}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            unmount={false}
          >
            <div className="fixed inset-0 z-60 bg-black/25" />
          </TransitionChild>
          <TransitionChild
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-x-full opacity-0"
            enterTo="translate-x-0 opacity-95"
            leave="transition ease-in duration-200 transform"
            leaveFrom="translate-x-0 opacity-95"
            leaveTo="translate-x-full opacity-0"
            unmount={false}
          >
            <DialogPanel className="fixed top-0 left-0 z-70 h-full w-full bg-white opacity-95 duration-300 dark:bg-black dark:opacity-[0.98]">
              <div className="flex items-center gap-3 pt-8 pl-10">
                <Logo />
                <span className="font-medium">{SITE_METADATA.headerTitle}</span>
              </div>
              <nav
                ref={navRef}
                className="mt-4 flex h-full basis-0 flex-col items-start gap-4 overflow-y-auto pt-2 pl-10"
              >
                {[...HEADER_NAV_LINKS, ...MORE_NAV_LINKS].map((link) => (
                  <Link
                    key={link.title}
                    href={link.href}
                    className="hover:text-primary-500 dark:hover:text-primary-400 py-1 text-xl font-bold tracking-widest text-gray-900 outline-0 outline-solid dark:text-gray-100"
                    onClick={onToggleNav}
                  >
                    <Twemoji emoji={link.emoji} />
                    <span className="ml-2">{link.title}</span>
                  </Link>
                ))}
              </nav>
              <button
                type="button"
                className="hover:text-primary-500 dark:hover:text-primary-400 fixed top-5 right-4 z-80 h-16 w-16 p-4 text-gray-900 dark:text-gray-100"
                aria-label="Toggle Menu"
                onClick={onToggleNav}
              >
                <X className="h-7 w-7" strokeWidth={1.5} />
              </button>
            </DialogPanel>
          </TransitionChild>
        </Dialog>
      </Transition>
    </>
  )
}
