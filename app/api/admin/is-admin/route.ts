import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { NextResponse } from 'next/server'
import { normalizeEmail } from '~/utils/misc'

export async function GET(request: Request) {
  try {
    const adminEmail = normalizeEmail(process.env.ADMIN_EMAIL || '')
    const { isAuthenticated, getUser } = getKindeServerSession()
    const auth = await isAuthenticated()
    let isAdmin = false
    if (auth) {
      const user = await getUser()
      if (user?.email) {
        isAdmin = normalizeEmail(user.email) === adminEmail
      }
    }
    return NextResponse.json({ isAdmin, adminEmail })
  } catch (err) {
    console.error('is-admin error', err)
    return NextResponse.json(
      { isAdmin: false, adminEmail: '' },
      { status: 500 },
    )
  }
}
