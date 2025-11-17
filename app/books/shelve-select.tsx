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
import { GrowingUnderline } from '~/components/ui/growing-underline'
import { Link } from '~/components/ui/link'

export const SHELVES: {
  label: string
  value: ShelfType
}[] = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Reading',
    value: 'currently-reading',
  },
  {
    label: 'English',
    value: 'english',
  },
  {
    label: 'Read',
    value: 'read',
  },
  {
    label: 'Paused',
    value: 'paused',
  },
  {
    label: 'Abandoned',
    value: 'abandoned',
  },
]

export type ShelfType =
  | 'all'
  | 'currently-reading'
  | 'english'
  | 'read'
  | 'paused'
  | 'abandoned'

export function ShelveSelect({
  shelf,
  rate,
}: {
  shelf: ShelfType
  rate: string
}) {
  const { label, value: selectedValue } =
    SHELVES.find(({ value }) => value === shelf) || SHELVES[0]

  return (
    <div className="flex items-center">
      <Menu as="div" className="relative inline-block text-left">
        <MenuButton
          aria-label="More links"
          className="px-3 py-1 font-medium"
          data-umami-event="movies-rate-filter"
        >
          <GrowingUnderline className="inline-flex items-center gap-2">
            <span>{label}</span>
            <ChevronDown strokeWidth={1.5} size={20} />
          </GrowingUnderline>
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
              'mt-2 w-36 origin-top-right rounded-lg text-right shadow-lg',
              'bg-white dark:bg-black',
              'ring-1 ring-black/5 focus:outline-hidden',
              'translate-x-[calc(50%-42px)]',
            ])}
          >
            <div className="space-y-1 p-1">
              {SHELVES.map(({ label, value }) => (
                <MenuItem key={value} as="div">
                  {({ close }) => (
                    <Link
                      className={clsx([
                        'flex w-full items-center gap-2 rounded-md px-2 py-1.5',
                        'hover:bg-orange-100 dark:hover:bg-green-900',
                      ])}
                      href={`/books?shelf=${value}&rate=${rate}`}
                      scroll={false}
                      onClick={close}
                    >
                      <span data-umami-event="books-shelf-select">{label}</span>
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
