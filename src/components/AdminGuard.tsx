import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { Loader2 } from 'lucide-react'

export const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, loading, isInitialized } = useAuthStore()

  if (loading || !isInitialized) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-teal-600 dark:text-teal-400" />
          <p className="mt-4 text-sm font-medium text-slate-600 dark:text-slate-400">Loading admin controls...</p>
        </div>
      </div>
    )
  }

  if (!profile || profile.role !== 'admin') {
    sessionStorage.setItem('authNotice', 'Admin permission is required for that page.')
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
