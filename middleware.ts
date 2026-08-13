import { type NextRequest, NextResponse } from 'next/server'
import { SESSION_COOKIE, isAdminLogin, verifySession } from '~/lib/github-oauth'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Auth API routes manage their own cookies — let them through untouched.
  if (pathname.startsWith('/api/auth/')) {
    return NextResponse.next()
  }

  const session = verifySession(
    request.cookies.get(SESSION_COOKIE)?.value,
    Math.floor(Date.now() / 1000),
  )
  const isAdmin = session !== null && isAdminLogin(session.login)

  if (pathname.startsWith('/admin') && !isAdmin) {
    const loginUrl = new URL('/api/auth/github', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  // Only run middleware for admin pages and auth API routes. This prevents
  // the middleware from intercepting unknown (gibberish) paths so Next's
  // custom 404 can render normally.
  matcher: ['/admin/:path*', '/api/auth/:path*'],
  // HMAC verification needs node:crypto, which requires the Node.js runtime.
  runtime: 'nodejs',
}
