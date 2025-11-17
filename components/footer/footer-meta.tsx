'use client'

import { Clock, Github, MapPin, Star } from 'lucide-react'
import useSWR from 'swr'
import { GrowingUnderline } from '~/components/ui/growing-underline'
import { Link } from '~/components/ui/link'
import { Twemoji } from '~/components/ui/twemoji'
import { SITE_METADATA } from '~/data/site-metadata'
import type { GithubRepository } from '~/types/data'
import { fetcher } from '~/utils/misc'

const TIME_IS = 'https://time.is/Lansing'
const MY_TIMEZONE = 'America/Detroit'
const MY_TIMEZONE_OFFSET = -5 * -60 // UTC-5

function getTime() {
  const date = new Date()
  const visitorTimezoneOffset = date.getTimezoneOffset()
  const hoursDiff = (visitorTimezoneOffset - MY_TIMEZONE_OFFSET) / 60
  const diff =
    hoursDiff === 0
      ? 'same time'
      : hoursDiff > 0
        ? `${hoursDiff}h ahead`
        : `${hoursDiff * -1}h behind`

  const time = new Intl.DateTimeFormat('en-US', {
    timeZone: MY_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date)

  return { time, diff }
}

export function FooterMeta() {
  const { time, diff } = getTime()
  const siteRepo = SITE_METADATA.siteRepo.replace('https://github.com/', '')
  const repoName = siteRepo.split('/')[1]
  const { data: repo } = useSWR<GithubRepository>(
    `/api/github?repo=${siteRepo}`,
    fetcher,
  )

  return (
    <div className="space-y-2 py-1.5 text-gray-800 dark:text-gray-200">
      <div className="flex items-center gap-1 font-medium">
        <Github className="h-5 w-5" />
        <Link href={SITE_METADATA.siteRepo} className="ml-1">
          <GrowingUnderline data-umami-event="view-repo">
            {repoName}
          </GrowingUnderline>
        </Link>
        <span>-</span>
        <span className="inline-flex items-center text-gray-500 dark:text-gray-400">
          <Star className="mr-1 h-4 w-4" />
          {repo ? <span>{repo.stargazerCount}</span> : '---'}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <MapPin className="h-5 w-5" />
        <Link
          href="https://www.google.com/maps/place/Lansing,+MI"
          target="_blank"
        >
          <GrowingUnderline
            className="font-medium"
            data-umami-event="footer-location"
          >
            Lansing, MI <Twemoji emoji="flag-us" className="h-4.5!" />
          </GrowingUnderline>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5" />
        <Link href={TIME_IS}>
          <GrowingUnderline
            className="font-medium"
            data-umami-event="footer-time"
          >
            {/* Time is dynamic — avoid hydration mismatch by ensuring this is rendered on the client.
                Also add suppressHydrationWarning to avoid React warnings if the server and client
                output differ by a small amount (e.g., one minute). */}
            <span suppressHydrationWarning>{time} </span>
            <span
              className="text-gray-500 dark:text-gray-400"
              suppressHydrationWarning
            >
              - {diff}
            </span>
          </GrowingUnderline>
        </Link>
      </div>
    </div>
  )
}
