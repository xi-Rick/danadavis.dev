import { NextResponse } from 'next/server'

// TipTap JSON node types
interface TipTapMark {
  type: string
  attrs?: Record<string, unknown>
}

interface TipTapNode {
  type: string
  content?: TipTapNode[]
  text?: string
  marks?: TipTapMark[]
  attrs?: Record<string, unknown>
}

// Convert TipTap JSON to HTML
function jsonToHtml(json: TipTapNode | unknown): string {
  if (!json || typeof json !== 'object') {
    return ''
  }

  const node = json as TipTapNode

  if (node.type === 'doc' && node.content) {
    return node.content
      .map((childNode: TipTapNode) => jsonToHtml(childNode))
      .join('')
  }

  if (node.type === 'paragraph') {
    const content = node.content
      ? node.content
          .map((childNode: TipTapNode) => jsonToHtml(childNode))
          .join('')
      : ''
    return content ? `<p>${content}</p>` : '<p><br /></p>'
  }

  if (node.type === 'heading') {
    const level = (node.attrs?.level as number) || 1
    const content = node.content
      ? node.content
          .map((childNode: TipTapNode) => jsonToHtml(childNode))
          .join('')
      : ''
    return `<h${level}>${content}</h${level}>`
  }

  if (node.type === 'text') {
    let text = node.text || ''

    // Apply marks
    if (node.marks) {
      for (const mark of node.marks) {
        if (mark.type === 'bold') {
          text = `<strong>${text}</strong>`
        } else if (mark.type === 'italic') {
          text = `<em>${text}</em>`
        } else if (mark.type === 'code') {
          text = `<code>${text}</code>`
        } else if (mark.type === 'link') {
          const href = (mark.attrs?.href as string) || '#'
          text = `<a href="${href}">${text}</a>`
        } else if (mark.type === 'underline') {
          text = `<u>${text}</u>`
        } else if (mark.type === 'strike') {
          text = `<s>${text}</s>`
        }
      }
    }

    return text
  }

  if (node.type === 'bulletList') {
    const items = node.content
      ? node.content
          .map((childNode: TipTapNode) => jsonToHtml(childNode))
          .join('')
      : ''
    return `<ul>${items}</ul>`
  }

  if (node.type === 'orderedList') {
    const items = node.content
      ? node.content
          .map((childNode: TipTapNode) => jsonToHtml(childNode))
          .join('')
      : ''
    return `<ol>${items}</ol>`
  }

  if (node.type === 'listItem') {
    const content = node.content
      ? node.content
          .map((childNode: TipTapNode) => jsonToHtml(childNode))
          .join('')
      : ''
    return `<li>${content}</li>`
  }

  if (node.type === 'blockquote') {
    const content = node.content
      ? node.content
          .map((childNode: TipTapNode) => jsonToHtml(childNode))
          .join('')
      : ''
    return `<blockquote>${content}</blockquote>`
  }

  if (node.type === 'codeBlock') {
    const language = (node.attrs?.language as string) || 'text'
    const content = node.content
      ? node.content
          .map((childNode: TipTapNode) => childNode.text || '')
          .join('')
      : ''
    return `<pre><code class="language-${language}">${content}</code></pre>`
  }

  if (node.type === 'image') {
    const src = (node.attrs?.src as string) || ''
    const alt = (node.attrs?.alt as string) || ''
    const title = (node.attrs?.title as string) || ''
    return `<img src="${src}" alt="${alt}" title="${title}" class="rounded-lg my-4" />`
  }

  if (node.type === 'horizontalRule') {
    return '<hr />'
  }

  if (node.type === 'hardBreak') {
    return '<br />'
  }

  // Handle taskList and taskItem
  if (node.type === 'taskList') {
    const items = node.content
      ? node.content
          .map((childNode: TipTapNode) => jsonToHtml(childNode))
          .join('')
      : ''
    return `<ul class="task-list">${items}</ul>`
  }

  if (node.type === 'taskItem') {
    const checked = (node.attrs?.checked as boolean) || false
    const content = node.content
      ? node.content
          .map((childNode: TipTapNode) => jsonToHtml(childNode))
          .join('')
      : ''
    return `<li class="task-item"><input type="checkbox" ${checked ? 'checked' : ''} disabled />${content}</li>`
  }

  // If we have content array, process it
  if (node.content && Array.isArray(node.content)) {
    return node.content
      .map((childNode: TipTapNode) => jsonToHtml(childNode))
      .join('')
  }

  return ''
}

export async function POST(request: Request) {
  try {
    const { content } = await request.json()

    if (!content) {
      return NextResponse.json(
        { error: 'No content provided' },
        { status: 400 },
      )
    }

    let html = ''

    // Check if content is JSON (TipTap format) or markdown string
    if (typeof content === 'string') {
      // Try to parse as JSON first
      try {
        const jsonContent = JSON.parse(content)
        html = jsonToHtml(jsonContent)
      } catch {
        // If not JSON, treat as markdown
        html = convertMarkdownToHtml(content)
      }
    } else if (typeof content === 'object') {
      // Already parsed JSON object
      html = jsonToHtml(content)
    }

    return NextResponse.json({ html })
  } catch (error) {
    console.error('Preview error:', error)
    return NextResponse.json(
      { error: 'Failed to render preview' },
      { status: 500 },
    )
  }
}

// Fallback markdown converter
function convertMarkdownToHtml(content: string): string {
  let html = content

  // Headers
  html = html.replace(/^##### (.*$)/gim, '<h5>$1</h5>')
  html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>')
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>')
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>')
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>')

  // Code blocks
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre><code class="language-${lang || 'text'}">${code.trim()}</code></pre>`
  })

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')

  // Bold and italic
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')

  // Images
  html = html.replace(
    /!\[(.*?)\]\((.*?)\)/g,
    '<img alt="$1" src="$2" class="rounded-lg my-4" />',
  )

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')

  // Blockquotes
  html = html.replace(/^> (.+)$/gim, '<blockquote>$1</blockquote>')

  // Horizontal rules
  html = html.replace(/^---$/gim, '<hr />')

  // Lists - unordered
  const ulRegex = /(?:^|\n)((?:^[ \t]*[-*+][ \t]+.+$\n?)+)/gm
  html = html.replace(ulRegex, (match) => {
    const items = match
      .trim()
      .split('\n')
      .map((line) => line.replace(/^[ \t]*[-*+][ \t]+/, ''))
      .map((item) => `<li>${item}</li>`)
      .join('')
    return `<ul>${items}</ul>`
  })

  // Lists - ordered
  const olRegex = /(?:^|\n)((?:^[ \t]*\d+\.[ \t]+.+$\n?)+)/gm
  html = html.replace(olRegex, (match) => {
    const items = match
      .trim()
      .split('\n')
      .map((line) => line.replace(/^[ \t]*\d+\.[ \t]+/, ''))
      .map((item) => `<li>${item}</li>`)
      .join('')
    return `<ol>${items}</ol>`
  })

  // Paragraphs
  const lines = html.split('\n\n')
  html = lines
    .map((line) => {
      const trimmed = line.trim()
      if (!trimmed) return ''

      if (
        trimmed.startsWith('<h') ||
        trimmed.startsWith('<ul') ||
        trimmed.startsWith('<ol') ||
        trimmed.startsWith('<li') ||
        trimmed.startsWith('<blockquote') ||
        trimmed.startsWith('<pre') ||
        trimmed.startsWith('<hr') ||
        trimmed.startsWith('<img')
      ) {
        return trimmed
      }

      return `<p>${trimmed}</p>`
    })
    .filter((line) => line)
    .join('\n')

  return html
}
