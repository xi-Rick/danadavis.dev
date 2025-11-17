import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    const result = await prisma.$queryRaw<Array<{ column_name: string }>>`
      SELECT column_name FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'comments'
        AND column_name = 'reactions'
    `
    if (result.length > 0) {
      console.log('reactions column exists on comments table')
    } else {
      console.log('reactions column NOT FOUND on comments table')
    }
  } catch (err) {
    console.error('Failed to query DB:', err)
  } finally {
    await prisma.$disconnect()
  }
}

main()
