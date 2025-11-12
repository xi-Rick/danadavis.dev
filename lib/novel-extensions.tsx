import {
  CheckSquare,
  Code,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  List,
  ListOrdered,
  Text,
  TextQuote,
} from 'lucide-react'
import {
  Command,
  GlobalDragHandle,
  Placeholder,
  StarterKit,
  type SuggestionItem,
  TaskItem,
  TaskList,
  TiptapLink,
  UpdatedImage,
  createSuggestionItems,
  renderItems,
} from 'novel'

/**
 * Default extensions configuration for Novel.sh editor
 * Includes styling for all default Tiptap extensions
 */
export const defaultExtensions: unknown[] = [
  StarterKit.configure({
    bulletList: {
      HTMLAttributes: {
        class: 'novel-bullet-list',
      },
    },
    orderedList: {
      HTMLAttributes: {
        class: 'novel-ordered-list',
      },
    },
    listItem: {
      HTMLAttributes: {
        class: 'novel-list-item',
      },
    },
    blockquote: {
      HTMLAttributes: {
        class:
          'border-l-4 border-orange-500 pl-4 italic text-black/80 dark:text-white/80',
      },
    },
    codeBlock: {
      HTMLAttributes: {
        class:
          'rounded-sm bg-black/10 dark:bg-white/10 border border-black dark:border-white p-5 font-mono font-medium text-black dark:text-white',
      },
    },
    code: {
      HTMLAttributes: {
        class:
          'rounded-md bg-black/10 dark:bg-white/10 px-1.5 py-1 font-mono font-medium text-black dark:text-white',
        spellcheck: 'false',
      },
    },
    horizontalRule: false,
    dropcursor: {
      color: '#FF9F43',
      width: 2,
    },
    gapcursor: false,
  }),
  Placeholder.configure({
    placeholder: 'Start by using a slash "/" for commands...',
    emptyEditorClass: 'is-editor-empty',
    emptyNodeClass: 'is-empty',
    showOnlyWhenEditable: true,
  }),
  TiptapLink.configure({
    HTMLAttributes: {
      class:
        'text-orange-500 underline underline-offset-[3px] hover:text-orange-600 dark:hover:text-orange-400 transition-colors cursor-pointer',
    },
  }),
  UpdatedImage.configure({
    HTMLAttributes: {
      class: 'rounded-lg border border-black dark:border-white',
    },
  }),
  TaskList.configure({
    HTMLAttributes: {
      class: 'not-prose pl-2 text-black dark:text-white',
    },
  }),
  TaskItem.configure({
    HTMLAttributes: {
      class: 'flex items-start my-4 text-black dark:text-white',
    },
    nested: true,
  }),
  GlobalDragHandle.configure({
    HTMLAttributes: {
      class:
        'flex h-full cursor-grab active:cursor-grabbing pr-2 opacity-0 hover:opacity-100 transition-opacity',
    },
    // Enable viewport boundary detection
    dragHandleWidth: 24,
  }),
]

/**
 * Slash command suggestion items
 * These are the commands that appear when user types "/"
 */
export const suggestionItemsArr: SuggestionItem[] = [
  {
    title: 'Text',
    description: 'Just start typing with plain text.',
    searchTerms: ['p', 'paragraph'],
    icon: <Text size={18} className="text-orange-500" />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleNode('paragraph', 'paragraph')
        .run()
    },
  },
  {
    title: 'To-do List',
    description: 'Track tasks with a to-do list.',
    searchTerms: ['todo', 'task', 'list', 'check', 'checkbox'],
    icon: <CheckSquare size={18} className="text-orange-500" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleTaskList().run()
    },
  },
  {
    title: 'Heading 1',
    description: 'Big section heading.',
    searchTerms: ['title', 'big', 'large'],
    icon: <Heading1 size={18} className="text-orange-500" />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', { level: 1 })
        .run()
    },
  },
  {
    title: 'Heading 2',
    description: 'Medium section heading.',
    searchTerms: ['subtitle', 'medium'],
    icon: <Heading2 size={18} className="text-orange-500" />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', { level: 2 })
        .run()
    },
  },
  {
    title: 'Heading 3',
    description: 'Small section heading.',
    searchTerms: ['subtitle', 'small'],
    icon: <Heading3 size={18} className="text-orange-500" />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', { level: 3 })
        .run()
    },
  },
  {
    title: 'Bullet List',
    description: 'Create a simple bullet list.',
    searchTerms: ['unordered', 'point'],
    icon: <List size={18} className="text-orange-500" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run()
    },
  },
  {
    title: 'Numbered List',
    description: 'Create a list with numbering.',
    searchTerms: ['ordered'],
    icon: <ListOrdered size={18} className="text-orange-500" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run()
    },
  },
  {
    title: 'Quote',
    description: 'Capture a quote.',
    searchTerms: ['blockquote'],
    icon: <TextQuote size={18} className="text-orange-500" />,
    command: ({ editor, range }) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleNode('paragraph', 'paragraph')
        .toggleBlockquote()
        .run(),
  },
  {
    title: 'Code',
    description: 'Capture a code snippet.',
    searchTerms: ['codeblock'],
    icon: <Code size={18} className="text-orange-500" />,
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
  },
  {
    title: 'Image',
    description: 'Upload an image.',
    searchTerms: ['img', 'picture', 'media'],
    icon: <ImageIcon size={18} className="text-orange-500" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run()
    },
  },
]

export const suggestionItems = createSuggestionItems(suggestionItemsArr)

/**
 * Slash command configuration
 * This extends the Command extension with custom suggestions
 */
export const slashCommand = Command.configure({
  suggestion: {
    items: () => suggestionItems,
    render: renderItems,
  },
})

/**
 * Complete extensions array for the editor
 * Includes default extensions and slash command support
 */
export const editorExtensions: unknown[] = [...defaultExtensions, slashCommand]
