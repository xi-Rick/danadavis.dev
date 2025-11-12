import type { JSONContent } from 'novel'

/**
 * Converts Markdown to Novel JSONContent format
 * Handles images, links, headings, lists, blockquotes, code blocks, and basic text formatting
 */
export function markdownToJSON(markdown: string): JSONContent {
  // Add safety check
  if (!markdown || typeof markdown !== 'string') {
    return {
      type: 'doc',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: '' }] }],
    }
  }

  try {
    const lines = markdown.split('\n')
    const content: JSONContent['content'] = []

    let i = 0
    while (i < lines.length) {
      const line = lines[i]
      const trimmed = line.trim()

      // Skip empty lines
      if (!trimmed) {
        i++
        continue
      }

      // Headings
      if (trimmed.startsWith('#')) {
        const level = trimmed.match(/^#+/)?.[0].length || 1
        const heading = trimmed.replace(/^#+\s*/, '')
        content.push({
          type: 'heading',
          attrs: { level: Math.min(level, 6) as 1 | 2 | 3 | 4 | 5 | 6 },
          content: parseInlineFormatting(heading),
        })
        i++
        continue
      }

      // Blockquotes
      if (trimmed.startsWith('>')) {
        const quote = trimmed.replace(/^>\s*/, '')
        content.push({
          type: 'blockquote',
          content: [
            {
              type: 'paragraph',
              content: parseInlineFormatting(quote),
            },
          ],
        })
        i++
        continue
      }

      // Code blocks
      if (trimmed.startsWith('```')) {
        const language = trimmed.replace(/^```/, '').trim()
        i++
        const codeLines: string[] = []
        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          codeLines.push(lines[i])
          i++
        }
        content.push({
          type: 'codeBlock',
          attrs: { language: language || 'plaintext' },
          content: [
            {
              type: 'text',
              text: codeLines.join('\n'),
            },
          ],
        })
        i++
        continue
      }

      // Lists (bullet and ordered)
      if (trimmed.startsWith('- ') || trimmed.match(/^\d+\.\s/)) {
        const isBullet = trimmed.startsWith('- ')
        const listItems: string[] = []
        const listType = isBullet ? 'bulletList' : 'orderedList'

        while (i < lines.length) {
          const currentLine = lines[i].trim()
          if (currentLine.startsWith('- ') || currentLine.match(/^\d+\.\s/)) {
            const itemText = currentLine
              .replace(/^-\s/, '')
              .replace(/^\d+\.\s/, '')
            listItems.push(itemText)
            i++
          } else if (!currentLine) {
            i++
            break
          } else {
            break
          }
        }

        content.push({
          type: listType,
          content: listItems.map((item) => ({
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: parseInlineFormatting(item),
              },
            ],
          })),
        })
        continue
      }

      // Images
      if (trimmed.match(/^!\[.*?\]\(.*?\)/)) {
        const imageMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)/)
        if (imageMatch) {
          const alt = imageMatch[1]
          const src = imageMatch[2]
          content.push({
            type: 'image',
            attrs: {
              src,
              alt,
              title: alt,
            },
          })
          i++
          continue
        }
      }

      // Paragraphs (including those with inline formatting and images)
      let paragraph = line
      i++

      // Continue reading paragraph until blank line or special character
      while (
        i < lines.length &&
        lines[i].trim() &&
        !lines[i].trim().match(/^[#>-]/) &&
        !lines[i].trim().match(/^\d+\./) &&
        !lines[i].trim().startsWith('```')
      ) {
        paragraph += `\n${lines[i]}`
        i++
      }

      // Parse paragraph content (may contain images, links, bold, italic)
      const paragraphContent = parseParagraphContent(paragraph)
      if (paragraphContent && paragraphContent.length > 0) {
        content.push({
          type: 'paragraph',
          content: paragraphContent,
        })
      }
    }

    return {
      type: 'doc',
      content:
        content.length > 0 ? content : [{ type: 'paragraph', content: [] }],
    }
  } catch (error) {
    console.error('Error converting markdown to JSON:', error)
    return {
      type: 'doc',
      content: [
        { type: 'paragraph', content: [{ type: 'text', text: markdown }] },
      ],
    }
  }
}

/**
 * Parse inline formatting like **bold**, *italic*, [links], and ![images]
 * Filters out empty text nodes to prevent ProseMirror errors
 */
function parseInlineFormatting(text: string): JSONContent['content'] {
  const content: JSONContent['content'] = []
  let remaining = text

  while (remaining) {
    // Bold
    const boldMatch = remaining.match(/\*\*(.*?)\*\*/)
    if (boldMatch && boldMatch.index === 0) {
      const boldText = boldMatch[1]
      if (boldText) {
        content.push({
          type: 'text',
          text: boldText,
          marks: [{ type: 'bold' }],
        })
      }
      remaining = remaining.substring(boldMatch[0].length)
      continue
    }

    // Italic
    const italicMatch = remaining.match(/\*(.*?)\*/)
    if (italicMatch && italicMatch.index === 0) {
      const italicText = italicMatch[1]
      if (italicText) {
        content.push({
          type: 'text',
          text: italicText,
          marks: [{ type: 'italic' }],
        })
      }
      remaining = remaining.substring(italicMatch[0].length)
      continue
    }

    // Links
    const linkMatch = remaining.match(/\[(.*?)\]\((.*?)\)/)
    if (linkMatch && linkMatch.index === 0) {
      const linkText = linkMatch[1]
      if (linkText) {
        content.push({
          type: 'text',
          text: linkText,
          marks: [{ type: 'link', attrs: { href: linkMatch[2] } }],
        })
      }
      remaining = remaining.substring(linkMatch[0].length)
      continue
    }

    // Code
    const codeMatch = remaining.match(/`(.*?)`/)
    if (codeMatch && codeMatch.index === 0) {
      const codeText = codeMatch[1]
      if (codeText) {
        content.push({
          type: 'text',
          text: codeText,
          marks: [{ type: 'code' }],
        })
      }
      remaining = remaining.substring(codeMatch[0].length)
      continue
    }

    // Regular text up to next formatting
    const nextMatch = remaining.match(/[\*\[`]/)
    if (nextMatch?.index && nextMatch.index > 0) {
      const textSegment = remaining.substring(0, nextMatch.index)
      if (textSegment) {
        content.push({
          type: 'text',
          text: textSegment,
        })
      }
      remaining = remaining.substring(nextMatch.index)
    } else if (remaining) {
      content.push({
        type: 'text',
        text: remaining,
      })
      remaining = ''
    } else {
      remaining = ''
    }
  }

  return content.length > 0 ? content : []
}

/**
 * Parse paragraph content including potential images and text
 */
function parseParagraphContent(paragraph: string): JSONContent['content'] {
  const content: JSONContent['content'] = []
  const lines = paragraph.split('\n')

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx]
    const trimmed = line.trim()

    if (!trimmed) continue

    // Check for image with markdown syntax
    const imageMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)/)
    if (imageMatch) {
      const alt = imageMatch[1]
      const src = imageMatch[2]
      content.push({
        type: 'image',
        attrs: {
          src,
          alt: alt || 'image',
          title: alt || 'image',
        },
      })

      // Check if the next line is a caption (starts with underscore or italic formatting)
      if (lineIdx + 1 < lines.length) {
        const nextLine = lines[lineIdx + 1].trim()
        if (nextLine.startsWith('_') && nextLine.endsWith('_')) {
          lineIdx++
          // Parse the caption with formatting
          const caption = nextLine.slice(1, -1)
          const parts = caption.split(/(\[[^\]]+\]\([^)]+\))/)
          for (const part of parts) {
            if (!part || !part.trim()) continue

            // Link
            if (part.match(/\[[^\]]+\]\([^)]+\)/)) {
              const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/)
              if (linkMatch?.[1]) {
                content.push({
                  type: 'text',
                  text: linkMatch[1],
                  marks: [
                    { type: 'link', attrs: { href: linkMatch[2] } },
                    { type: 'italic' },
                  ],
                })
              }
            }
            // Regular text (italicized since it came from _..._)
            else if (part.trim()) {
              content.push({
                type: 'text',
                text: part,
                marks: [{ type: 'italic' }],
              })
            }
          }
        }
      }
      continue
    }

    // Check for emphasis/italic with text before/after
    const emMatch = trimmed.match(/\*(.*?)\*/)
    if (emMatch) {
      // Handle mixed content like "Photo by [Name] / [Source]"
      const parts = trimmed.split(/(\*[^*]+\*|\[[^\]]+\]\([^)]+\))/)
      for (const part of parts) {
        if (!part || !part.trim()) continue

        // Italic text
        if (part.startsWith('*') && part.endsWith('*')) {
          const text = part.slice(1, -1)
          if (text) {
            content.push({
              type: 'text',
              text,
              marks: [{ type: 'italic' }],
            })
          }
        }
        // Link
        else if (part.match(/\[[^\]]+\]\([^)]+\)/)) {
          const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/)
          if (linkMatch?.[1]) {
            content.push({
              type: 'text',
              text: linkMatch[1],
              marks: [{ type: 'link', attrs: { href: linkMatch[2] } }],
            })
          }
        }
        // Regular text
        else if (part.trim()) {
          content.push({
            type: 'text',
            text: part,
          })
        }
      }
    } else {
      // Regular text with formatting
      const formatted = parseInlineFormatting(trimmed)
      if (formatted && formatted.length > 0) {
        content.push(...formatted)
      }
    }
  }

  return content
}

/**
 * Convert JSONContent back to Markdown for saving
 */
export function jsonToMarkdown(json: JSONContent): string {
  if (!json.content) return ''

  return json.content.map((node) => nodeToMarkdown(node)).join('\n')
}

/**
 * Convert a single node to Markdown
 */
function nodeToMarkdown(node: JSONContent): string {
  switch (node.type) {
    case 'heading': {
      const level = node.attrs?.level || 1
      const headingContent = contentToMarkdown(node.content)
      return `${'#'.repeat(level)} ${headingContent}`
    }

    case 'paragraph':
      return contentToMarkdown(node.content) || ''

    case 'image':
      return `![${node.attrs?.alt || 'image'}](${node.attrs?.src || ''})`

    case 'blockquote': {
      const quoteContent = node.content
        ?.map((n: JSONContent) => nodeToMarkdown(n))
        .join('\n')
      return `> ${quoteContent || ''}`
    }

    case 'codeBlock': {
      const language = node.attrs?.language || 'plaintext'
      const code = contentToMarkdown(node.content)
      return `\`\`\`${language}\n${code}\n\`\`\``
    }

    case 'bulletList':
      return (
        node.content
          ?.map((item: JSONContent) => `- ${nodeToMarkdown(item)}`)
          .join('\n') || ''
      )

    case 'orderedList':
      return (
        node.content
          ?.map(
            (item: JSONContent, idx: number) =>
              `${idx + 1}. ${nodeToMarkdown(item)}`,
          )
          .join('\n') || ''
      )

    case 'listItem':
      return contentToMarkdown(node.content) || ''

    default:
      return contentToMarkdown(node.content) || ''
  }
}

/**
 * Convert content array to Markdown
 */
function contentToMarkdown(content: JSONContent[] | undefined): string {
  if (!content) return ''

  return content
    .map((node) => {
      if (node.type === 'text') {
        let text = node.text || ''
        if (node.marks) {
          for (const mark of node.marks) {
            switch (mark.type) {
              case 'bold':
                text = `**${text}**`
                break
              case 'italic':
                text = `*${text}*`
                break
              case 'code':
                text = `\`${text}\``
                break
              case 'link':
                text = `[${text}](${mark.attrs?.href || ''})`
                break
            }
          }
        }
        return text
      }
      return nodeToMarkdown(node as JSONContent)
    })
    .join('')
}
