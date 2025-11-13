import { useKBar } from 'kbar'
import { Command } from 'lucide-react'

export function KbarSearchTrigger() {
  const { query } = useKBar()

  return (
    <button
      type="button"
      aria-label="Search"
      className="rounded p-1.5 hover:bg-orange-100 hover:text-orange-600 dark:hover:bg-green-900/20 dark:hover:text-green-400 transition-colors"
      data-umami-event="search-the-site"
      onClick={() => query.toggle()}
    >
      <Command size={20} strokeWidth={1.5} />
    </button>
  )
}
