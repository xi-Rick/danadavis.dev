import { Search } from 'lucide-react'
import type { ChangeEventHandler } from 'react'

export function SearchArticles({
  onChange,
  label,
}: {
  onChange: ChangeEventHandler<HTMLInputElement>
  label: string
}) {
  return (
    <div className="relative max-w-lg">
      <label>
        <span className="sr-only">{label}</span>
        <input
          aria-label={label}
          type="text"
          onChange={onChange}
          placeholder={label}
          className="themed-input pr-12"
        />
      </label>
      <Search
        size={24}
        className="absolute top-3 right-3 h-5 w-5 text-gray-400 dark:text-gray-300"
      />
    </div>
  )
}
