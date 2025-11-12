import { promises as fs } from 'node:fs'
import path from 'node:path'
import { genPageMetadata } from 'app/seo'
import { SnippetCard } from '~/components/cards/snippet'
import { Container } from '~/components/ui/container'
import { PageHeader } from '~/components/ui/page-header'

type SnippetContent = {
  title: string
  heading: string
  summary: string
  icon: string
  path: string
  slug: string
  date: string
  lastmod: string
  tags: string[]
  draft: boolean
  images: string[]
  authors: string[]
  layout: string
  type: 'Snippet'
  bibliography?: undefined
  canonicalUrl?: undefined
  readingTime: { text: string; minutes: number; time: number; words: number }
  toc: unknown[]
  filePath: string
  structuredData: unknown
}

export const metadata = genPageMetadata({
  title: 'Snippets',
  description:
    "My personal stash of code snippets that make my life easier. They're simple and reusable. Feel free to copy, tweak, and use them as you like. *Some snippets written by me, some are from the internet (Thanks to the open source community).",
})

// Enable static generation with revalidation
export const revalidate = 3600 // Revalidate every hour
export const dynamic = 'force-static' // Force static generation

// Map language names to icon names from BrandsMap
function getLanguageIcon(language: string): string {
  const languageMap: Record<string, string> = {
    javascript: 'Javascript',
    typescript: 'Typescript',
    python: 'Python',
    java: 'Java',
    css: 'CSS',
    html: 'Html',
    bash: 'Bash',
    sql: 'MySQL',
    markdown: 'Markdown',
    json: 'Javascript', // fallback
    yaml: 'Javascript', // fallback
    xml: 'Html', // fallback
  }

  return languageMap[language.toLowerCase()] || 'Javascript' // default fallback
}

// Cache snippets data
let cachedSnippets: SnippetContent[] | null = null
let cacheTime = 0
const CACHE_DURATION = 1000 * 60 * 60 // 1 hour

async function loadSnippetsFromJson() {
  const now = Date.now()

  // Return cached data if available and not expired
  if (cachedSnippets && now - cacheTime < CACHE_DURATION) {
    return cachedSnippets
  }

  try {
    const filePath = path.join(process.cwd(), 'json', 'snippets.json')
    const fileContents = await fs.readFile(filePath, 'utf8')
    const snippetsData = JSON.parse(fileContents) as Array<{
      id: string
      title: string
      slug: string
      summary: string
      content: string
      date: string
      lastmod: string
      tags: string[]
      categories: string[]
      images: string[]
      authors: string[]
      draft: boolean
      featured: boolean
      layout: string
      language: string
      framework: string
      difficulty: string
      createdAt: string
      updatedAt: string
      authorId: string
    }>

    const processedSnippets = snippetsData
      .filter((snippet) => !snippet.draft)
      .map((snippet) => ({
        title: snippet.title,
        heading: snippet.title,
        summary: snippet.summary,
        icon: getLanguageIcon(snippet.language),
        path: `snippets/${snippet.slug}`,
        slug: snippet.slug,
        date: snippet.date,
        lastmod: snippet.lastmod,
        tags: snippet.tags,
        draft: snippet.draft,
        images: snippet.images,
        authors: snippet.authors,
        layout: snippet.layout,
        type: 'Snippet' as const,
        bibliography: undefined,
        canonicalUrl: undefined,
        readingTime: {
          text: '5 min read',
          minutes: 5,
          time: 300000,
          words: 100,
        }, // default
        toc: [],
        filePath: `snippets/${snippet.slug}.mdx`,
        structuredData: {
          '@context': 'https://schema.org',
          '@type': 'CodeSnippet',
          headline: snippet.title,
          datePublished: snippet.date,
          dateModified: snippet.lastmod || snippet.date,
          description: snippet.summary,
          image: snippet.images ? snippet.images[0] : '/static/images/logo.png',
          url: `/snippets/${snippet.slug}`,
        },
      })) as SnippetContent[]

    // Update cache
    cachedSnippets = processedSnippets
    cacheTime = now

    return processedSnippets
  } catch (error) {
    console.error('Error loading snippets from JSON:', error)
    return []
  }
}

export default async function Snippets() {
  const snippets = await loadSnippetsFromJson()

  return (
    <Container className="pt-4 lg:pt-12">
      <PageHeader
        title="Snippets"
        description={
          <>
            <p>
              My personal stash of code snippets that make my life easier.
              They’re simple and reusable. Feel free to copy, tweak, and use
              them as you like.
            </p>
            <p className="mt-3 italic">
              *Some snippets written by me, some are from the internet (Thanks
              to the open source community).
            </p>
          </>
        }
        className="border-b border-gray-200 dark:border-gray-700"
      />
      <div className="py-10">
        <div className="grid-cols-2 space-y-10 gap-x-6 gap-y-10 md:grid md:space-y-0">
          {snippets.map((snippet) => (
            <SnippetCard snippet={snippet} key={snippet.path} />
          ))}
        </div>
      </div>
    </Container>
  )
}
