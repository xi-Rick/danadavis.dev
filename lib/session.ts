import { cookies } from 'next/headers'
import {
  SESSION_COOKIE,
  type SessionUser,
  isAdminLogin,
  verifySession,
} from '~/lib/github-oauth'

/**
 * Server-side session accessor for server components, route handlers and
 * server actions. Setting/clearing the session cookie is handled by the
 * auth route handlers themselves.
 */

export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies()
  return verifySession(
    store.get(SESSION_COOKIE)?.value,
    Math.floor(Date.now() / 1000),
  )
}

export async function isAdminSession(): Promise<boolean> {
  const user = await getSessionUser()
  return user !== null && isAdminLogin(user.login)
}

/**
 * Throws unless the current session belongs to an admin. Route handlers and
 * server actions call this before mutating data.
 */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await getSessionUser()
  if (!user || !isAdminLogin(user.login)) {
    throw new Error('Unauthorized')
  }
  return user
}
