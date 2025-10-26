import { slug } from 'github-slugger'
import { toString } from 'mdast-util-to-string'
import { remark } from 'remark'
import type { Parent } from 'unist'
import { visit } from 'unist-util-visit'

export type TocItem = {
  value: string
  url: string
  depth: number
}

export type Toc = TocItem[]

/**
 * Extracts TOC headings from markdown file and adds it to the file's data object.
 */
function remarkTocHeadings() {
  return (tree: Parent, file) => {
    let toc: Toc = []
    const slugs = new Map<string, number>()

    visit(tree, 'heading', (node) => {
      let textContent = toString(node).replace(/<[^>]*(>|$)/g, '')
      if (textContent) {
        const baseSlug = slug(textContent)
        const count = slugs.get(baseSlug) || 0
        const uniqueSlug = count === 0 ? baseSlug : `${baseSlug}-${count}`
        slugs.set(baseSlug, count + 1)

        toc.push({
          value: textContent,
          url: `#${uniqueSlug}`,
          // @ts-ignore
          depth: node.depth,
        })
      }
    })
    file.data.toc = toc
  }
}

/**
 * Passes markdown file through remark to extract TOC headings
 *
 * @param {string} markdown
 * @return {*}  {Promise<Toc>}
 */
export async function extractTocHeadings(markdown: string): Promise<Toc> {
  let vfile = await remark().use(remarkTocHeadings).process(markdown)
  // @ts-ignore
  return vfile.data.toc
}
