'use client'

import { KindeProvider } from '@kinde-oss/kinde-auth-nextjs'

interface AuthProviderProps {
  children: React.ReactNode
  siteUrl?: string
}

export const AuthProvider = ({ children, siteUrl }: AuthProviderProps) => {
  const redirectUri = `${siteUrl || 'https://localhost:3434'}/api/auth/kinde_callback`

  return <KindeProvider redirectUri={redirectUri}>{children}</KindeProvider>
}
