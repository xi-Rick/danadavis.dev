'use client'

import { ArrowLeft, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'
import { GrowingUnderline } from '~/components/ui/growing-underline'

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
        className="inline-flex items-center gap-2 text-base font-semibold underline-offset-4 transition-colors hover:text-gray-900 dark:hover:text-gray-200 w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        <GrowingUnderline>{backLabel}</GrowingUnderline>
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
