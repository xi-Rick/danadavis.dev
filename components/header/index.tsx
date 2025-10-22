"use client";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { KbarSearchTrigger } from "~/components/search/kbar-trigger";
import { Container } from "~/components/ui/container";
import { GrowingUnderline } from "~/components/ui/growing-underline";
import { Link } from "~/components/ui/link";
import { HEADER_NAV_LINKS } from "~/data/navigation";
import { SITE_METADATA } from "~/data/site-metadata";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";
import { MoreLinks } from "./more-links";
import { ThemeSwitcher } from "./theme-switcher";

export function Header() {
  const pathname = usePathname();
  const { isAuthenticated, user } = useKindeBrowserClient();

  return (
    <Container
      as='header'
      className={clsx(
        "dark:bg-dark/75 bg-white/75 py-2 backdrop-blur-sm",
        "shadow-xs saturate-100 md:rounded-2xl",
        SITE_METADATA.stickyNav ? "sticky top-2 z-50 lg:top-3" : "mt-2 lg:mt-3"
      )}>
      <div className='flex items-center justify-between gap-3'>
        <Logo />
        <div className='flex items-center gap-4'>
          <div className='hidden gap-1.5 sm:flex'>
            {HEADER_NAV_LINKS.map(({ title, href }) => {
              const isActive = pathname.startsWith(href);
              return (
                <Link key={title} href={href} className='px-3 py-1 font-medium'>
                  <GrowingUnderline
                    className={clsx(isActive && "bg-size-[100%_50%]")}
                    data-umami-event={`nav-${href.replace("/", "")}`}>
                    {title}
                  </GrowingUnderline>
                </Link>
              );
            })}
            {isAuthenticated && (
              <Link href='/admin' className='px-3 py-1 font-medium'>
                <GrowingUnderline
                  className={clsx(
                    pathname === "/admin/add-post" && "bg-size-[100%_50%]"
                  )}
                  data-umami-event='nav-admin'>
                  Admin
                </GrowingUnderline>
              </Link>
            )}
            <MoreLinks />
          </div>
          <div
            data-orientation='vertical'
            role='separator'
            className='hidden h-4 w-px shrink-0 bg-gray-200 md:block dark:bg-gray-600'
          />
          <div className='flex items-center gap-2'>
            <ThemeSwitcher />
            <KbarSearchTrigger />
            {isAuthenticated ? (
              <div className='flex items-center gap-2'>
                <span className='text-sm'>Hi, {user?.given_name}</span>
                <LogoutLink className='px-3 py-1 text-sm hover:underline'>
                  Logout
                </LogoutLink>
              </div>
            ) : (
              <p />
            )}
            <MobileNav />
          </div>
        </div>
      </div>
    </Container>
  );
}
