import { NextResponse } from 'next/server'
import {
  OAUTH_STATE_MAX_AGE,
  STATE_COOKIE,
  createGithubAuthUrl,
  signOAuthState,
} from '~/lib/github-oauth'

export async function GET(request: Request) {
  const origin = new URL(request.url).origin
  const next = new URL(request.url).searchParams.get('next') ?? '/'

  try {
    const { url, state, nextPath } = createGithubAuthUrl(origin, next)
    const response = NextResponse.redirect(url)
    response.cookies.set(STATE_COOKIE, signOAuthState(state, nextPath), {
      httpOnly: true,
      sameSite: 'lax',
      secure: origin.startsWith('https://'),
      path: '/',
      maxAge: OAUTH_STATE_MAX_AGE,
    })
    return response
  } catch (err) {
    console.error('github auth start error', err)
    return NextResponse.redirect(new URL('/', origin))
  }
}
