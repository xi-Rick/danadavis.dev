import { spawn } from 'child_process'
import figlet from 'figlet'
import { generateRssFeed } from './rss'

const ASCII_COLORS = {
  ORANGE: '\x1b[38;5;208m',
  GREEN: '\x1b[32m',
  BLUE: '\x1b[34m',
  YELLOW: '\x1b[33m',
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m',
  DIM: '\x1b[2m',
}

interface BuildStats {
  compiled: boolean
  linted: boolean
  pagesCollected: boolean
  staticGenerated: boolean
  tracesCollected: boolean
  optimized: boolean
  totalPages: number
  totalRoutes: number
}

const stats: BuildStats = {
  compiled: false,
  linted: false,
  pagesCollected: false,
  staticGenerated: false,
  tracesCollected: false,
  optimized: false,
  totalPages: 0,
  totalRoutes: 0,
}

function logStep(message: string, emoji = '⚡') {
  console.log(`${ASCII_COLORS.GREEN}${emoji} ${message}${ASCII_COLORS.RESET}`)
}

function logInfo(message: string) {
  console.log(`${ASCII_COLORS.DIM}   ${message}${ASCII_COLORS.RESET}`)
}

function logSuccess(message: string) {
  console.log(
    `${ASCII_COLORS.BOLD}${ASCII_COLORS.GREEN}✓ ${message}${ASCII_COLORS.RESET}`,
  )
}

function logWarning(message: string) {
  console.log(`${ASCII_COLORS.YELLOW}⚠ ${message}${ASCII_COLORS.RESET}`)
}

function processLine(line: string): boolean {
  // Filter out noise
  if (
    line.includes('DeprecationWarning') ||
    line.includes('Use `node --trace-deprecation') ||
    line.includes('successCallback') ||
    line.includes('Generated') ||
    line.includes('documents in .contentlayer') ||
    line.includes('Experiments (use with caution)') ||
    line.includes('optimizePackageImports') ||
    line.includes('TypeScript project references') ||
    line.includes('Attempting to build in incremental mode') ||
    line.includes('Creating an optimized production build') ||
    line.trim() === ''
  ) {
    return false
  }

  // Track compilation
  if (line.includes('Compiled successfully')) {
    stats.compiled = true
    const timeMatch = line.match(/in ([\d.]+)s/)
    const time = timeMatch ? timeMatch[1] : 'unknown'
    logSuccess(`Compiled successfully in ${time}s`)
    return false
  }

  // Track linting
  if (line.includes('Linting and checking validity of types')) {
    if (line.includes('✓')) {
      stats.linted = true
      logSuccess('Type checking and linting passed')
    } else {
      logStep('Type checking and linting...', '🔍')
    }
    return false
  }

  // Track page collection
  if (line.includes('Collecting page data')) {
    if (line.includes('✓')) {
      stats.pagesCollected = true
      // Don't show - will be covered by static generation
    } else {
      logStep('Collecting page data...', '📄')
    }
    return false
  }

  // Track static generation
  if (line.includes('Generating static pages')) {
    const match = line.match(/\((\d+)\/(\d+)\)/)
    if (match) {
      const current = Number.parseInt(match[1], 10)
      const total = Number.parseInt(match[2], 10)
      // Only show when complete
      if (!stats.staticGenerated && current === total) {
        stats.staticGenerated = true
        stats.totalPages = total
        logSuccess(`Generated ${total} static pages`)
      }
    }
    return false
  }

  // Track build traces
  if (line.includes('Collecting build traces')) {
    if (line.includes('✓')) {
      stats.tracesCollected = true
      logSuccess('Build traces collected')
    }
    return false
  }

  // Track optimization
  if (line.includes('Finalizing page optimization')) {
    if (line.includes('✓')) {
      stats.optimized = true
      logSuccess('Build optimized')
    }
    return false
  }

  // Track Next.js server tracing
  if (line.includes('Traced Next.js server files')) {
    const timeMatch = line.match(/([\d.]+)ms/)
    const time = timeMatch ? timeMatch[1] : 'unknown'
    logSuccess(`Server files traced in ${time}ms`)
    return false
  }

  // Track serverless function creation
  if (line.includes('Created all serverless functions')) {
    const timeMatch = line.match(/([\d.]+)ms/)
    const time = timeMatch ? timeMatch[1] : 'unknown'
    logSuccess(`Serverless functions created in ${time}ms`)
    return false
  }

  // Track static file collection
  if (line.includes('Collected static files')) {
    const timeMatch = line.match(/([\d.]+)ms/)
    const time = timeMatch ? timeMatch[1] : 'unknown'
    logSuccess(`Static files collected in ${time}ms`)
    return false
  }

  // Track build completion
  if (line.includes('Build Completed in')) {
    const timeMatch = line.match(/\[([\d.]+[a-z]+)\]/)
    const time = timeMatch ? timeMatch[1] : 'unknown'
    logSuccess(`Build output ready in ${time}`)
    return false
  }

  // Track deployment phases
  if (line.includes('Deploying outputs')) {
    logStep('Deploying outputs...', '🚀')
    return false
  }

  if (line.includes('Deployment completed')) {
    logSuccess('Deployment completed')
    return false
  }

  if (line.includes('Creating build cache')) {
    logInfo('💾 Creating build cache...')
    return false
  }

  // Show content generation messages
  if (line.includes('Tag list generated')) {
    logInfo('🏷️  Tags indexed')
    return false
  }

  if (line.includes('Local search index generated')) {
    logInfo('🔍 Search index built')
    return false
  }

  if (line.includes('Content source generated successfully')) {
    logInfo('✨ Content processed')
    return false
  }

  // Show environment info (simplified)
  if (line.includes('Next.js')) {
    const versionMatch = line.match(/Next\.js ([\d.]+)/)
    if (versionMatch) {
      logInfo(`Next.js ${versionMatch[1]}`)
    }
    return false
  }

  if (line.includes('Environments:')) {
    return false // Hide environment files info
  }

  // Hide route table and legends
  if (
    line.includes('Route (app)') ||
    line.includes('Size') ||
    line.includes('First Load JS') ||
    line.includes('├') ||
    line.includes('└') ||
    line.includes('┌') ||
    line.includes('○  (Static)') ||
    line.includes('●  (SSG)') ||
    line.includes('ƒ  (Dynamic)') ||
    line.includes('ƒ Middleware') ||
    line.includes('+ First Load JS') ||
    line.includes('chunks/') ||
    line.includes('other shared chunks') ||
    line.trim().startsWith('/') ||
    line.trim().startsWith('+ ')
  ) {
    return false
  }

  // Show errors and warnings (except filtered ones)
  if (line.includes('Error') || line.includes('error')) {
    console.log(line)
    return false
  }

  if (line.includes('⚠')) {
    // Filter out specific warnings
    if (
      !line.includes('TypeScript project references') &&
      !line.includes('Attempting to build in incremental mode')
    ) {
      console.log(line)
    }
    return false
  }

  return false
}

async function runBuild() {
  return new Promise<void>((resolve, reject) => {
    const env = {
      ...process.env,
      INIT_CWD: process.cwd(),
    }

    const nextBuild = spawn('next', ['build'], {
      env,
      shell: false,
    })

    let buffer = ''
    let lastStaticPageMessage = ''

    nextBuild.stdout.on('data', (data: Buffer) => {
      buffer += data.toString()
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        // Deduplicate static page messages
        if (line.includes('Generating static pages')) {
          if (line !== lastStaticPageMessage) {
            lastStaticPageMessage = line
            processLine(line)
          }
        } else {
          processLine(line)
        }
      }
    })

    nextBuild.stderr.on('data', (data: Buffer) => {
      const line = data.toString().trim()
      // Only show actual errors, not deprecation warnings, prisma info, or TypeScript warnings
      if (
        !line.includes('DeprecationWarning') &&
        !line.includes('Use `node --trace-deprecation') &&
        !line.includes('prisma:warn') &&
        !line.includes('prisma generate --no-engine') &&
        !line.includes('TypeScript project references') &&
        !line.includes('Attempting to build in incremental mode')
      ) {
        if (line) {
          console.error(line)
        }
      }
    })

    nextBuild.on('close', (code: number) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`Build failed with exit code ${code}`))
      }
    })
  })
}

async function runPostbuildTasks() {
  await generateRssFeed()
}

async function showAscii() {
  try {
    const text = await figlet.text('Dana Davis', {
      font: 'Standard',
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 120,
      whitespaceBreak: true,
    })

    console.log('\n')
    console.log(
      `${ASCII_COLORS.BOLD}${ASCII_COLORS.ORANGE}${text}${ASCII_COLORS.RESET}`,
    )
    console.log(
      `${ASCII_COLORS.GREEN}Building personal site and portfolio...${ASCII_COLORS.RESET}`,
    )
    console.log('\n')
  } catch (err) {
    console.error('Error generating ASCII art:', err)
  }
}

async function main() {
  const startTime = Date.now()

  try {
    // Show ASCII art
    await showAscii()

    console.log('\n')
    logStep('Starting build process...', '🚀')
    console.log('\n')

    // Run Next.js build
    await runBuild()

    console.log('\n')
    logStep('Running post-build tasks...', '⚙️')
    console.log('\n')

    // Run postbuild tasks
    await runPostbuildTasks()

    const duration = ((Date.now() - startTime) / 1000).toFixed(1)

    console.log('\n')
    console.log(
      `${ASCII_COLORS.BOLD}${ASCII_COLORS.GREEN}✨ Build completed successfully in ${duration}s${ASCII_COLORS.RESET}`,
    )
    console.log('\n')
  } catch (error) {
    console.error(
      `${ASCII_COLORS.BOLD}\n❌ Build failed: ${error instanceof Error ? error.message : String(error)}${ASCII_COLORS.RESET}\n`,
    )
    process.exit(1)
  }
}

main()
