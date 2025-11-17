'use client'

import { LoginLink } from '@kinde-oss/kinde-auth-nextjs/components'
import { usePathname, useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

export interface SignInButtonProps {
  /** Optional override for the post-login redirect URL. If omitted, will redirect to the current page + #comment */
  postLoginRedirectURL?: string
  /** Optional custom className to extend styles */
  className?: string
  /** Optional button text override */
  label?: string
  /** Show loading state */
  isLoading?: boolean
  /** Optional icon override */
  icon?: React.ReactNode
  /** Button variant */
  variant?: 'default' | 'outline' | 'themed'
}

export function SignInButton({
  postLoginRedirectURL,
  className = '',
  label = 'Sign in to comment',
  isLoading = false,
  icon = '📝',
  variant = 'default',
}: SignInButtonProps) {
  const pathname = usePathname() ?? '/'
  const searchParams = useSearchParams()

  const defaultRedirect = useMemo(() => {
    // Build the URL like /current/path?query=stuff#comment
    const search = searchParams?.toString() ?? ''
    return `${pathname}${search ? `?${search}` : ''}#comment`
  }, [pathname, searchParams])

  const finalPostLoginRedirectURL = postLoginRedirectURL ?? defaultRedirect

  // Variant styles
  const variantStyles = {
    // Use the project accent colors for the default (primary) action so it
    // matches other CTA buttons across light/dark modes.
    default:
      'bg-[var(--color-accent-orange)] hover:brightness-90 disabled:opacity-50 text-white border-[var(--color-accent-orange)] dark:bg-[var(--color-accent-green)] dark:border-[var(--color-accent-green)]',
    // Outline variant used throughout the site (e.g. Logout button) — match
    // color scheme using the project's accent colors for text and hover.
    outline:
      'bg-transparent hover:bg-orange-50 disabled:bg-transparent text-orange-500 dark:text-green-400 border border-transparent rounded-lg dark:hover:bg-green-900/30',
    themed:
      'bg-[var(--color-accent-orange)] hover:brightness-90 disabled:opacity-50 text-white border-[var(--color-accent-orange)] dark:bg-[var(--color-accent-green)] dark:border-[var(--color-accent-green)]',
  }

  return (
    <div className="flex flex-col w-full max-w-md mx-auto">
      <LoginLink
        className={`
          flex items-center justify-center gap-3 
          px-6 py-4 
          font-semibold text-base
          rounded-xl 
          transition-all duration-200 
          shadow-lg hover:shadow-xl 
          disabled:shadow-none disabled:cursor-not-allowed
          transform hover:scale-[1.02] active:scale-[0.98]
          border
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-900
          dark:focus-visible:ring-white dark:focus-visible:ring-offset-gray-900
          ${variantStyles[variant]}
          ${isLoading ? 'cursor-wait opacity-70' : ''}
          ${className}
        `}
        postLoginRedirectURL={finalPostLoginRedirectURL}
        authUrlParams={{ prompt: 'select_account' }}
        aria-label={label}
        aria-busy={isLoading}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Signing in...</span>
          </>
        ) : (
          <>
            {typeof icon === 'string' ? (
              <span className="text-xl" aria-hidden="true">
                {icon}
              </span>
            ) : (
              icon
            )}
            <span>{label}</span>
          </>
        )}
      </LoginLink>
    </div>
  )
}
