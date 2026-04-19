"use client"
import { AuthProvider, useAuth } from '@/lib/auth'
import OnboardingModal from './OnboardingModal'

function OnboardingGate({ children }) {
  const { user, profile, loading } = useAuth()
  // Show onboarding when user is logged in and has a profile that isn't complete yet
  const showOnboarding = !loading && !!user && !!profile && !profile.onboarding_complete
  return (
    <>
      {children}
      {showOnboarding && <OnboardingModal />}
    </>
  )
}

export function AuthWrapper({ children }) {
  return (
    <AuthProvider>
      <OnboardingGate>{children}</OnboardingGate>
    </AuthProvider>
  )
}
