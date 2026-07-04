import React from 'react'
import { Toaster } from 'sonner'

interface FocusLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
  headerActions?: React.ReactNode
}

export const FocusLayout: React.FC<FocusLayoutProps> = ({
  children,
  title,
  subtitle,
  headerActions
}) => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-50">
      <Toaster position="top-right" richColors />
      
      {/* Minimal Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/50 bg-white/70 backdrop-blur-md px-6 dark:border-slate-800/50 dark:bg-slate-950/70 select-none">
        <div className="flex items-center gap-4">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-teal-600 font-extrabold text-white dark:bg-teal-500">
            ASG
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200">
              {title}
            </h1>
            {subtitle && (
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Dynamic actions e.g. timers */}
        <div className="flex items-center gap-4">
          {headerActions}
        </div>
      </header>

      {/* Focus Main Content Workspace */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  )
}
