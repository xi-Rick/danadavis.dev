'use client'

import { KindeProvider } from '@kinde-oss/kinde-auth-nextjs'

export const AuthProvider = ({ children }) => {
  return (
    <KindeProvider
      redirectUri={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3434'}/api/auth/kinde_callback`}
    >
      {children}
    </KindeProvider>
  )
}
