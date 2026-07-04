import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { Loader2 } from 'lucide-react'

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, isInitialized } = useAuthStore()
  const location = useLocation()

  if (loading || !isInitialized) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-teal-600 dark:text-teal-400" />
          <p className="mt-4 text-sm font-medium text-slate-600 dark:text-slate-400">Loading student workspace...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    sessionStorage.setItem('authNotice', 'Please sign in or create a student account to access this page.')
    return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />
  }

  return <>{children}</>
}
