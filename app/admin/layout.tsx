'use client'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Root layout already animates page transitions. Avoid double-wrapping
  // admin routes to prevent nested remount/flicker issues.
  return <>{children}</>
}
