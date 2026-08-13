import { NextResponse } from 'next/server'
import { isAdminLogin } from '~/lib/github-oauth'
import { getSessionUser } from '~/lib/session'

export async function GET() {
  try {
    const user = await getSessionUser()
    const isAdmin = user !== null && isAdminLogin(user.login)
    return NextResponse.json({
      isAdmin,
      user: user
        ? {
            login: user.login,
            name: user.name,
            avatarUrl: user.avatarUrl,
          }
        : null,
    })
  } catch (err) {
    console.error('is-admin error', err)
    return NextResponse.json({ isAdmin: false, user: null }, { status: 500 })
  }
}
