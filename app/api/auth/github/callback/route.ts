import { type NextRequest, NextResponse } from 'next/server'
import { prisma } from '~/db'
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  STATE_COOKIE,
  exchangeGithubCode,
  fetchGithubViewer,
  signSession,
  verifyOAuthState,
} from '~/lib/github-oauth'

export async function GET(request: NextRequest) {
  const origin = new URL(request.url).origin
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const returnedState = searchParams.get('state')
  const stateCookie = request.cookies.get(STATE_COOKIE)?.value

  const response = NextResponse.redirect(new URL('/', origin))
  response.cookies.delete(STATE_COOKIE)

  const verified = verifyOAuthState(stateCookie, returnedState)
  if (!verified || !code) {
    return response
  }

  try {
    const accessToken = await exchangeGithubCode(code, origin)
    const user = await fetchGithubViewer(accessToken)
    const session = signSession(user, Math.floor(Date.now() / 1000))

    // Keep a User row in sync so posts/projects can set authorId (FK).
    await prisma.user.upsert({
      where: { id: String(user.id) },
      update: {
        email: `github-${user.login}@users.noreply.github.com`,
        name: user.name ?? user.login,
      },
      create: {
        id: String(user.id),
        email: `github-${user.login}@users.noreply.github.com`,
        name: user.name ?? user.login,
      },
    })

    response.cookies.set(SESSION_COOKIE, session, {
      httpOnly: true,
      sameSite: 'lax',
      secure: origin.startsWith('https://'),
      path: '/',
      maxAge: SESSION_MAX_AGE,
    })
    response.headers.set('location', new URL(verified.next, origin).toString())
    return response
  } catch (err) {
    console.error('github auth callback error', err)
    return response
  }
}
