import type { ExecSyncOptions } from 'child_process'
import { execSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface BackupData {
  timestamp: string
  tables: {
    [key: string]: unknown[]
  }
}

const DEFAULT_TABLES = [
  'users',
  'accounts',
  'sessions',
  'verification_tokens',
  'comment_users',
  'posts',
  'books',
  'movies',
  'projects',
  'snippets',
  'comments',
  'captains_logs',
  'products',
  'product_variants',
  'reviews',
  'goodreads_books',
  'goodreads_movies',
  'site_settings',
  'stats',
]

// Minimal delegate shape used by this script to avoid using `any`.
type PrismaDelegate = {
  findMany?: () => Promise<unknown[]>
  createMany?: (opts: {
    data: unknown[]
    skipDuplicates?: boolean
  }) => Promise<unknown>
  create?: (opts: { data: unknown }) => Promise<unknown>
}

/**
 * Heuristic to locate the Prisma delegate for a given table name.
 * Tries exact match, case-insensitive match, singular/plural variants, and underscore removal.
 */
const findDelegateName = (table: string): string | null => {
  const delegates = Object.keys(prisma as unknown as Record<string, unknown>)
  const norm = (s: string) => s.replace(/[_\-]/g, '').toLowerCase()

  // 1) exact key
  if ((prisma as unknown as Record<string, unknown>)[table]) return table

  // 2) case-insensitive or normalized matches
  for (const key of delegates) {
    if (key.toLowerCase() === table.toLowerCase()) return key
  }

  // 3) normalized matches (remove underscores/dashes)
  for (const key of delegates) {
    if (norm(key) === norm(table)) return key
  }

  // 4) try singular/plural heuristics
  const candidates = new Set<string>()
  if (table.endsWith('s')) candidates.add(table.slice(0, -1))
  else candidates.add(`${table}s`)
  if (table.endsWith('es')) candidates.add(table.slice(0, -2))

  for (const cand of candidates) {
    for (const key of delegates) {
      if (key.toLowerCase() === cand.toLowerCase()) return key
      if (norm(key) === norm(cand)) return key
    }
  }

  return null
}

/**
 * Execute a shell command synchronously and stream output.
 */
const runCommand = (cmd: string): void => {
  console.log(`> ${cmd}`)
  // execSync with stdio: 'inherit' streams output directly; no return value needed
  // Cast options to any to avoid environment-specific type mismatches in node typings
  const opts = {
    stdio: 'inherit',
    shell: true,
  } as unknown as ExecSyncOptions
  execSync(cmd, opts)
}

/** Backup all configured tables */
const backupDatabase = async (
  tables: string[] = DEFAULT_TABLES,
): Promise<string> => {
  console.log('🔄 Starting database backup...')

  const backupData: BackupData = {
    timestamp: new Date().toISOString(),
    tables: {},
  }

  try {
    for (const table of tables) {
      try {
        const delegateName = findDelegateName(table)
        if (!delegateName) {
          console.warn(
            `⚠️  Warning: No Prisma delegate found for ${table}, skipping.`,
          )
          backupData.tables[table] = []
          continue
        }

        const delegate = (prisma as unknown as Record<string, PrismaDelegate>)[
          delegateName
        ]
        if (!delegate || typeof delegate.findMany !== 'function') {
          console.warn(
            `⚠️  Warning: Prisma delegate for ${table} (${delegateName}) has no findMany(), skipping.`,
          )
          backupData.tables[table] = []
          continue
        }

        const data = await delegate.findMany()
        backupData.tables[table] = data
        console.log(
          `✅ Backed up ${data.length} records from ${table} (delegate: ${delegateName})`,
        )
      } catch (err) {
        console.warn(
          `⚠️  Warning: Could not backup ${table}: ${(err as Error).message}`,
        )
        backupData.tables[table] = []
      }
    }

    const backupsDir = path.join(process.cwd(), 'backups')
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true })
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `backup-${timestamp}.json`
    const filepath = path.join(backupsDir, filename)

    fs.writeFileSync(filepath, JSON.stringify(backupData, null, 2))
    console.log('\n✅ Backup completed successfully!')
    console.log(`📁 Backup saved to: ${filepath}\n`)

    return filepath
  } catch (error) {
    console.error('❌ Error during backup:', error)
    throw error
  }
}

/** Restore from a previously created backup file */
const restoreDatabase = async (
  backupPath: string,
  tablesOrder?: string[],
): Promise<void> => {
  console.log('🔄 Starting database restoration...')
  try {
    const backupContent = fs.readFileSync(backupPath, 'utf-8')
    const backupData: BackupData = JSON.parse(backupContent)

    console.log(`📂 Restoring from backup: ${backupData.timestamp}\n`)

    const restoreOrder = tablesOrder ?? [
      'users',
      'accounts',
      'sessions',
      'verification_tokens',
      'comment_users',
      'site_settings',
      'posts',
      'books',
      'movies',
      'projects',
      'snippets',
      'captains_logs',
      'products',
      'product_variants',
      'reviews',
      'comments',
      'goodreads_books',
      'goodreads_movies',
      'stats',
    ]

    for (const table of restoreOrder) {
      const records = backupData.tables[table]

      if (!records || records.length === 0) {
        console.log(`⏭️  Skipping ${table} (no data)`)
        continue
      }

      try {
        const delegateName = findDelegateName(table)
        if (!delegateName) {
          console.warn(
            `⚠️  Warning: No Prisma delegate found for ${table}, skipping restore.`,
          )
          continue
        }

        const delegate = (prisma as unknown as Record<string, PrismaDelegate>)[
          delegateName
        ]
        if (delegate && typeof delegate.createMany === 'function') {
          await delegate.createMany({ data: records, skipDuplicates: true })
        } else if (delegate && typeof delegate.create === 'function') {
          for (const rec of records) {
            try {
              await delegate.create({ data: rec })
            } catch (e) {
              // best-effort: continue
            }
          }
        } else {
          console.warn(
            `⚠️  Warning: Prisma delegate for ${table} (${delegateName}) has no create/createMany, skipping.`,
          )
          continue
        }

        console.log(
          `✅ Restored ${records.length} records to ${table} (delegate: ${delegateName})`,
        )
      } catch (error) {
        console.error(`❌ Error restoring ${table}:`, (error as Error).message)
        // continue with other tables
      }
    }

    console.log('\n✅ Database restoration completed!\n')
  } catch (error) {
    console.error('❌ Error during restoration:', error)
    throw error
  }
}

/** Reset and apply migrations (destructive) */
const resetAndMigrate = (force = false): void => {
  if (!force) {
    throw new Error('resetAndMigrate requires force=true to run destructively')
  }

  console.log(
    '\n🔁 Resetting database and applying migrations (destructive)...\n',
  )

  // reset dev database (drops data)
  runCommand('npx prisma migrate reset --force')

  // deploy migrations (for non-dev envs) and regenerate client
  try {
    runCommand('npx prisma migrate deploy')
  } catch (err) {
    // If deploy fails in dev contexts, it's OK — migrate reset already reapplied migrations.
    console.warn(
      '⚠️  prisma migrate deploy failed (continuing):',
      (err as Error).message,
    )
  }

  runCommand('npx prisma generate')
}

/** CLI entrypoint */
const main = async (): Promise<void> => {
  const args = process.argv.slice(2)
  const yes = args.includes('--yes') || args.includes('-y')
  const backupOnly = args.includes('--backup-only')
  const restoreOnly = args.includes('--restore-only')
  const restorePathIndex = args.findIndex((a) => a === '--restore-path')
  const restorePath =
    restorePathIndex >= 0 ? args[restorePathIndex + 1] : undefined

  try {
    console.log(''.repeat(60))
    console.log('DATABASE BACKUP & REPOPULATE UTILITY')
    console.log(''.repeat(60))

    if (restoreOnly) {
      if (!restorePath) {
        console.error(
          'Please provide --restore-path <file> when using --restore-only',
        )
        process.exit(1)
      }
      await restoreDatabase(restorePath)
      return
    }

    // Step 1: Backup
    const backupPath = await backupDatabase()

    if (backupOnly) return

    console.log(
      '⚠️  WARNING: The next step will reset the database if you choose to continue.',
    )
    console.log(`Backup file: ${backupPath}`)
    console.log(
      'If you want to proceed with reset + migrate + restore, re-run with --yes or --yes -y flag.',
    )

    if (!yes) {
      console.log('\nDry run complete. No destructive actions were taken.\n')
      console.log('Suggested next steps:')
      console.log(
        '  1. Re-run with --yes to reset, migrate and restore automatically:',
      )
      console.log('     node ./scripts/db-backup-restore.js --yes')
      console.log('  OR run the individual commands manually as you prefer.')
      return
    }

    // Destructive path: reset + migrations + restore
    resetAndMigrate(true)

    // regenerate prisma client again to be safe
    runCommand('npx prisma generate')

    // restore
    await restoreDatabase(backupPath)

    console.log('All done.')
  } catch (error) {
    console.error('❌ Script failed:', (error as Error).message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Export functions so other scripts can import them
export { backupDatabase, resetAndMigrate, restoreDatabase }

// Run when called directly (ESM-safe)
// Compare the resolved file path of this module to the executed script path
if (fileURLToPath(import.meta.url) === process.argv[1]) {
  // Allow running the compiled JS directly (node dist/...) or via ts-node/dev
  main()
}
