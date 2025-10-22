import { withAuth } from '@kinde-oss/kinde-auth-nextjs/middleware'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { NextResponse } from 'next/server'

export default withAuth(
  async function middleware(req) {
    const res = NextResponse.next()
    // Add CORS headers for auth routes
    if (req.nextUrl.pathname.startsWith('/api/auth/')) {
      res.headers.set('Access-Control-Allow-Origin', '*')
      res.headers.set(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS',
      )
      res.headers.set(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization',
      )
    }

    // Check if user is authenticated and not the admin on admin paths
    const { getUser } = getKindeServerSession()
    const user = await getUser()
    if (
      req.nextUrl.pathname.startsWith('/admin') &&
      user &&
      user.email !== process.env.ADMIN_EMAIL
    ) {
      // Redirect to logout and home
      const logoutUrl = new URL('/api/auth/logout', req.url)
      logoutUrl.searchParams.set('post_logout_redirect_url', '/')
      return NextResponse.redirect(logoutUrl)
    }

    return res
  },
  {
    publicPaths: [
      '/',
      '/blog',
      '/about',
      '/projects',
      '/snippets',
      '/books',
      '/movies',
      '/tags',
      '/api/activities',
      '/audio/',
    ],
  },
)

export const config = {
  matcher: [
    // Only run middleware for admin pages and auth API routes. This prevents
    // the middleware from intercepting unknown (gibberish) paths so Next's
    // custom 404 can render normally.
    '/admin/:path*',
    '/api/auth/:path*',
  ],
}
