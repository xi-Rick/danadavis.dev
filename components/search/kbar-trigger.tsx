import { useKBar } from 'kbar'
import { Command } from 'lucide-react'

export function KbarSearchTrigger() {
  const { query } = useKBar()

  return (
    <button
      type="button"
      aria-label="Search"
      className="rounded p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700"
      data-umami-event="search-the-site"
      onClick={() => query.toggle()}
    >
      <Command size={20} strokeWidth={1.5} />
    </button>
  )
}
