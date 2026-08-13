'use client'

import { usePathname } from 'next/navigation'
import useSWR from 'swr'
import { fetcher } from '~/utils/misc'

export interface AuthUser {
  login: string
  name: string | null
  avatarUrl: string | null
}

export interface AdminResponse {
  isAdmin: boolean
  user: AuthUser | null
}

/**
 * Client-side auth accessor backed by the `/api/admin/is-admin` endpoint.
 * Returns sign-in/sign-out URLs for the GitHub OAuth flow.
 */
export function useAuth() {
  const pathname = usePathname()
  const { data, isLoading } = useSWR<AdminResponse>(
    '/api/admin/is-admin',
    fetcher,
    { refreshInterval: 60000 },
  )

  const signIn = (next?: string) => {
    const target = next ?? pathname ?? '/'
    const safe =
      target.startsWith('/') && !target.startsWith('//') ? target : '/'
    return `/api/auth/github?next=${encodeURIComponent(safe)}`
  }

  return {
    isAuthenticated: data?.user != null,
    user: data?.user ?? null,
    isAdmin: data?.isAdmin ?? false,
    isLoading,
    signIn,
    signOut: '/api/auth/logout',
  }
}
