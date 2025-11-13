import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { type NextRequest, NextResponse } from 'next/server'
import { prisma } from '~/db'
import { invalidateSiteSettingsCache } from '~/lib/site-settings'

export async function GET() {
  try {
    let settings = await prisma.siteSettings.findUnique({
      where: { id: 'default' },
    })

    // If no settings exist, create default
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: { id: 'default' },
      })
    }

    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch site settings' },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Remove id and timestamps from update data
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, createdAt, updatedAt, ...updateData } = body

    const settings = await prisma.siteSettings.upsert({
      where: { id: 'default' },
      update: updateData,
      create: { id: 'default', ...updateData },
    })

    // Invalidate cache so next request gets fresh data
    invalidateSiteSettingsCache()

    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Error updating site settings:', error)
    return NextResponse.json(
      { error: 'Failed to update site settings' },
      { status: 500 },
    )
  }
}
