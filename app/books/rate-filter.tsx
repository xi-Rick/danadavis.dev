'use client'

import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from '@headlessui/react'
import clsx from 'clsx'
import { ChevronDown } from 'lucide-react'
import { Fragment } from 'react'
import { Link } from '~/components/ui/link'
import { Twemoji } from '~/components/ui/twemoji'

export const RATES: {
  label: string
  description: string
  value: RateType
  emoji: string
}[] = [
  { label: '5', description: 'excellent', value: '5', emoji: 'star' },
  { label: '4', description: 'good', value: '4', emoji: 'thumbs-up' },
  { label: '3', description: 'okay', value: '3', emoji: 'thinking-face' },
  { label: '2', description: 'poor', value: '2', emoji: 'thumbs-down' },
  {
    label: '1',
    description: 'terrible',
    value: '1',
    emoji: 'loudly-crying-face',
  },
]
export type RateType = '5' | '4' | '3' | '2' | '1'

export function RateFilter({ rate, shelf }: { rate: RateType; shelf: string }) {
  const { label, value: selectedValue } =
    RATES.find(({ value }) => value === rate) || RATES[0]

  return (
    <div className="flex items-center">
      <Menu as="div" className="relative inline-block text-left">
        <MenuButton
          aria-label="Books rate filter"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 font-medium dark:border-gray-700"
          data-umami-event="books-rate-filter"
        >
          <span>
            {label} <span className="hidden md:inline">stars</span>
          </span>
          <ChevronDown strokeWidth={1.5} size={20} />
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
              'absolute right-0 z-50',
              'mt-2 origin-top-right rounded-lg text-right shadow-lg',
              'bg-white dark:bg-black',
              'ring-1 ring-black/5 focus:outline-hidden',
            ])}
          >
            <div className="space-y-1 p-1">
              {RATES.map(({ label, description, value, emoji }) => (
                <MenuItem key={value} as="div">
                  {({ close }) => (
                    <Link
                      className={clsx([
                        'flex w-full items-center gap-2 rounded-md px-2 py-1.5',
                        value === selectedValue
                          ? 'bg-gray-200 dark:bg-gray-800'
                          : 'hover:bg-gray-200 dark:hover:bg-gray-800',
                      ])}
                      href={`/books?shelf=${shelf}&rate=${value}`}
                      scroll={false}
                      onClick={close}
                    >
                      <span>({label})</span>
                      <span>{description}</span>
                      <Twemoji emoji={emoji} />
                    </Link>
                  )}
                </MenuItem>
              ))}
            </div>
          </MenuItems>
        </Transition>
      </Menu>
    </div>
  )
}
