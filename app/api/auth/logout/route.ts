import { NextResponse } from 'next/server'
import { SESSION_COOKIE } from '~/lib/github-oauth'

export async function GET(request: Request) {
  const origin = new URL(request.url).origin
  const next = new URL(request.url).searchParams.get('next') ?? '/'
  const target = next.startsWith('/') && !next.startsWith('//') ? next : '/'

  const response = NextResponse.redirect(new URL(target, origin))
  response.cookies.delete(SESSION_COOKIE)
  return response
}

export { GET as POST }
