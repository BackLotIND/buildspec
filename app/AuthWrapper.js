"use client"
import { AuthProvider } from '@/lib/auth'

export function AuthWrapper({ children }) {
  return <AuthProvider>{children}</AuthProvider>
}
