'use client'

import PageTransitionWrapper from '~/components/ui/page-transition-wrapper'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <PageTransitionWrapper>{children}</PageTransitionWrapper>
}
