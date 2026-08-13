import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'

/**
 * GitHub OAuth + signed-session helpers.
 *
 * All secrets are server-only and read from `process.env` at runtime. None of
 * the variable names used here are `PUBLIC_`/`NEXT_PUBLIC_`-prefixed, so they
 * never reach the client bundle.
 */

export interface SessionUser {
  id: number
  login: string
  name: string | null
  avatarUrl: string | null
}

export const SESSION_COOKIE = 'auth_session'
export const STATE_COOKIE = 'auth_oauth_state'
/** 30 days in seconds — session lifetime. */
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30
/** 10 minutes in seconds — OAuth `state` cookie lifetime. */
export const OAUTH_STATE_MAX_AGE = 60 * 10

const GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize'
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token'
const GITHUB_USER_URL = 'https://api.github.com/user'

interface SessionPayload extends SessionUser {
  /** issued-at, unix seconds */
  iat: number
  /** expiry, unix seconds */
  exp: number
}

interface OAuthStatePayload {
  state: string
  next: string
}

function getServerEnv(name: string): string | undefined {
  const value = process.env[name]
  return typeof value === 'string' ? value.trim() : undefined
}

function getSessionSecret(): string {
  const secret = getServerEnv('AUTH_SESSION_SECRET')
  if (!secret) {
    throw new Error('AUTH_SESSION_SECRET is not configured.')
  }
  return secret
}

/** Check a GitHub login against the `AUTH_ADMIN_GITHUB_LOGINS` allowlist. */
export function isAdminLogin(login: string): boolean {
  const logins = getServerEnv('AUTH_ADMIN_GITHUB_LOGINS')
  if (!logins) return false
  const allowed = logins
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
  return allowed.includes(login.trim().toLowerCase())
}

function base64UrlEncode(input: string): string {
  return Buffer.from(input, 'utf8').toString('base64url')
}

function base64UrlDecode(input: string): string {
  return Buffer.from(input, 'base64url').toString('utf8')
}

function sign(value: string): string {
  return createHmac('sha256', getSessionSecret())
    .update(value)
    .digest('base64url')
}

/** Constant-time comparison of two signatures. */
function signaturesMatch(a: string, b: string): boolean {
  const bufferA = Buffer.from(a)
  const bufferB = Buffer.from(b)
  if (bufferA.length !== bufferB.length) return false
  return timingSafeEqual(bufferA, bufferB)
}

/**
 * Build the GitHub authorize URL plus the matching CSRF `state` token and the
 * post-login redirect path. `nextPath` is carried inside the signed state so it
 * cannot be tampered with.
 */
export function createGithubAuthUrl(
  origin: string,
  nextPath?: string,
): { url: string; state: string; nextPath: string } {
  const clientId = getServerEnv('GITHUB_OAUTH_CLIENT_ID')
  if (!clientId) {
    throw new Error('GITHUB_OAUTH_CLIENT_ID is not configured.')
  }

  const safeNext =
    nextPath?.startsWith('/') && !nextPath.startsWith('//') ? nextPath : '/'
  const state = randomBytes(16).toString('hex')
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${origin}/api/auth/github/callback`,
    scope: 'read:user',
    state,
    allow_signup: 'true',
  })

  return {
    url: `${GITHUB_AUTHORIZE_URL}?${params.toString()}`,
    state,
    nextPath: safeNext,
  }
}

/** Exchange an OAuth `code` for an access token (server-side only). */
export async function exchangeGithubCode(
  code: string,
  origin: string,
): Promise<string> {
  const clientId = getServerEnv('GITHUB_OAUTH_CLIENT_ID')
  const clientSecret = getServerEnv('GITHUB_OAUTH_CLIENT_SECRET')
  if (!clientId || !clientSecret) {
    throw new Error('GitHub OAuth credentials are not configured.')
  }

  const response = await fetch(GITHUB_TOKEN_URL, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: `${origin}/api/auth/github/callback`,
    }),
  })

  if (!response.ok) {
    throw new Error(`GitHub token exchange failed: ${response.status}`)
  }

  const data = (await response.json()) as {
    access_token?: string
    error?: string
  }
  if (!data.access_token) {
    throw new Error(`GitHub token exchange error: ${data.error ?? 'unknown'}`)
  }

  return data.access_token
}

/** Fetch the authenticated GitHub profile and map it to the session user. */
export async function fetchGithubViewer(
  accessToken: string,
): Promise<SessionUser> {
  const response = await fetch(GITHUB_USER_URL, {
    headers: {
      accept: 'application/vnd.github+json',
      authorization: `Bearer ${accessToken}`,
      'user-agent': 'danadavis.dev',
    },
  })

  if (!response.ok) {
    throw new Error(`GitHub profile fetch failed: ${response.status}`)
  }

  const profile = (await response.json()) as {
    id: number
    login: string
    name: string | null
    avatar_url: string | null
  }

  return {
    id: profile.id,
    login: profile.login,
    name: profile.name ?? null,
    avatarUrl: profile.avatar_url ?? null,
  }
}

/** Sign a user object into a `payload.signature` session cookie value. */
export function signSession(user: SessionUser, nowSeconds: number): string {
  const payload: SessionPayload = {
    ...user,
    iat: nowSeconds,
    exp: nowSeconds + SESSION_MAX_AGE,
  }
  const encoded = base64UrlEncode(JSON.stringify(payload))
  return `${encoded}.${sign(encoded)}`
}

/** Verify a session cookie value and return the user, or null if invalid. */
export function verifySession(
  cookieValue: string | undefined,
  nowSeconds: number,
): SessionUser | null {
  if (!cookieValue) return null
  const [encoded, signature] = cookieValue.split('.')
  if (!encoded || !signature) return null
  if (!signaturesMatch(signature, sign(encoded))) return null

  try {
    const payload = JSON.parse(base64UrlDecode(encoded)) as SessionPayload
    if (typeof payload.exp !== 'number' || payload.exp < nowSeconds) return null
    if (typeof payload.id !== 'number' || typeof payload.login !== 'string') {
      return null
    }
    return {
      id: payload.id,
      login: payload.login,
      name: payload.name ?? null,
      avatarUrl: payload.avatarUrl ?? null,
    }
  } catch {
    return null
  }
}

/** Sign a short-lived OAuth `state` (plus post-login path) for CSRF protection. */
export function signOAuthState(state: string, nextPath: string): string {
  const payload: OAuthStatePayload = { state, next: nextPath }
  const encoded = base64UrlEncode(JSON.stringify(payload))
  return `${encoded}.${sign(encoded)}`
}

/**
 * Verify a signed OAuth `state` cookie against the value GitHub echoed back.
 * Returns the verified state and post-login path, or null if invalid.
 */
export function verifyOAuthState(
  cookieValue: string | undefined,
  returnedState: string | null,
): OAuthStatePayload | null {
  if (!cookieValue || !returnedState) return null
  const [encoded, signature] = cookieValue.split('.')
  if (!encoded || !signature) return null
  if (!signaturesMatch(signature, sign(encoded))) return null

  try {
    const payload = JSON.parse(base64UrlDecode(encoded)) as OAuthStatePayload
    if (typeof payload.state !== 'string' || typeof payload.next !== 'string') {
      return null
    }
    if (!signaturesMatch(payload.state, returnedState)) return null
    return { state: payload.state, next: payload.next }
  } catch {
    return null
  }
}
