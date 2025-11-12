'use client'

import { ArrowLeft, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'

interface AdminNavigationProps {
  currentPage?: string
  backLink?: string
  backLabel?: string
}

export function AdminNavigation({
  currentPage,
  backLink = '/admin',
  backLabel = 'Back to Dashboard',
}: AdminNavigationProps) {
  return (
    <nav className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
      {/* Back Link */}
      <Link
        href={backLink}
        className="inline-flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg border-2 border-black dark:border-white hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        {backLabel}
      </Link>

      {/* Breadcrumb / Current Page */}
      {currentPage && (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <LayoutDashboard className="w-4 h-4" />
          <span className="hidden sm:inline">/</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {currentPage}
          </span>
        </div>
      )}
    </nav>
  )
}
