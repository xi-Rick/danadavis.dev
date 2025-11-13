import path from 'path'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { writeFile } from 'fs/promises'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Determine file extension
    const ext = file.name.endsWith('.png') ? 'png' : 'ico'
    const filename = `favicon.${ext}`

    // Save to public directory
    const publicPath = path.join(process.cwd(), 'public', filename)
    await writeFile(publicPath, buffer)

    return NextResponse.json({ path: `/${filename}` })
  } catch (error) {
    console.error('Error uploading favicon:', error)
    return NextResponse.json(
      { error: 'Failed to upload favicon' },
      { status: 500 },
    )
  }
}
