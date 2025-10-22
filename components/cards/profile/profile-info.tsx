import { Github, Linkedin, Mail, MapPin } from 'lucide-react'
import { Fragment } from 'react'
import { SITE_METADATA } from '~/data/site-metadata'
import XIcon from '~/icons/x.svg'

function getAccountHandle(url = '') {
  const lastPart = url.split('/').pop()
  if (lastPart) {
    return lastPart
  }
  return url
}

const SOCIALS = [
  {
    platform: 'github',
    handle: getAccountHandle(SITE_METADATA.github),
    href: SITE_METADATA.github,
    Icon: () => <Github size={20} strokeWidth={1.5} />,
    umamiEvent: 'profile-card-github',
  },
  {
    platform: 'linkedin',
    handle: getAccountHandle(SITE_METADATA.linkedin),
    href: SITE_METADATA.linkedin,
    Icon: () => <Linkedin size={20} strokeWidth={1.5} />,
    umamiEvent: 'profile-card-linkedin',
  },
  {
    platform: 'x',
    handle: getAccountHandle(SITE_METADATA.x),
    href: SITE_METADATA.x,
    Icon: () => (
      <XIcon className="h-4 w-4" fill="#fff" viewBox="0 0 1200 1227" />
    ),
    umamiEvent: 'profile-card-x',
  },
]

export function ProfileCardInfo() {
  return (
    <div className="hidden py-4 md:block md:px-5">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
        Dana Davis
      </h3>
      <h5 className="py-2 text-gray-500 dark:text-gray-400">Web Developer</h5>
      <div className="mt-4 mb-2 space-y-4">
        <div className="flex items-center text-gray-700 dark:text-gray-200">
          <MapPin strokeWidth={1.5} size={20} />
          <p className="px-2">United States</p>
        </div>
        <div className="flex items-center text-gray-700 dark:text-gray-200">
          <Mail strokeWidth={1.5} size={20} />
          <a className="px-2" href={`mailto:${SITE_METADATA.email}`}>
            {SITE_METADATA.email}
          </a>
        </div>
        <div className="flex items-center gap-2.5 text-gray-700 dark:text-gray-200">
          {SOCIALS.map(({ platform, handle, href, Icon, umamiEvent }, idx) => (
            <Fragment key={platform}>
              <a
                target="_blank"
                href={href}
                rel="noreferrer"
                className="flex items-center underline-offset-4 hover:underline"
                data-umami-event={umamiEvent}
              >
                <Icon />
                <span className="ml-px text-gray-500">/</span>
                <span className="ml-0.5">{handle}</span>
              </a>
              {idx !== SOCIALS.length - 1 && (
                <span className="text-gray-400 dark:text-gray-500">|</span>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}
