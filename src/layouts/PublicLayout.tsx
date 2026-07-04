import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { useTheme } from '@/contexts/ThemeContext'
import { Sun, Moon, Laptop, Menu, X } from 'lucide-react'

export const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthStore()
  const { theme, setTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const publicLinks = [
    { label: 'Home', path: '/' },
    { label: 'Blog', path: '/blog' },
    { label: 'Projects', path: '/projects' },
    { label: 'About', path: '/about' },
    { label: 'Verify Certificate', path: '/certificate-verify' }
  ]

  const socialLinks = [
    { label: 'Instagram', short: 'IG', url: 'https://instagram.com/007arjungangwar' },
    { label: 'LinkedIn', short: 'in', url: 'https://linkedin.com/in/arjun-singh-gangwar-54b264280' },
    { label: 'Medium', short: 'M', url: 'https://medium.com/@007arjungangwar' },
    { label: 'X', short: 'X', url: 'https://x.com/007arjungangwar' },
    { label: 'YouTube', short: 'YT', url: 'https://youtube.com/@Epsilonacademyofficial' }
  ]

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-50">
      {/* Navbar */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/50 bg-white/70 backdrop-blur-md px-6 dark:border-slate-800/50 dark:bg-slate-950/70">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-600 font-extrabold text-white dark:bg-teal-500">
              ASG
            </div>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-teal-600 to-indigo-600 bg-clip-text text-transparent dark:from-teal-400 dark:to-indigo-400">
              ASG Tech
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium">
            {publicLinks.map((link, idx) => (
              <Link
                key={idx}
                to={link.path}
                className={`rounded-lg px-3 py-1.5 transition-colors ${
                  isActive(link.path)
                    ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Desktop Controls */}
        <div className="hidden md:flex items-center gap-4">
          {/* Theme Toggles */}
          <div className="flex items-center bg-slate-100 rounded-full p-0.5 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50">
            <button onClick={() => setTheme('light')} className={`p-1 rounded-full ${theme === 'light' ? 'bg-white text-amber-500 shadow-sm dark:bg-slate-800' : 'text-slate-400'}`} aria-label="Light mode"><Sun className="h-4 w-4" /></button>
            <button onClick={() => setTheme('dark')} className={`p-1 rounded-full ${theme === 'dark' ? 'bg-white text-indigo-500 shadow-sm dark:bg-slate-800' : 'text-slate-400'}`} aria-label="Dark mode"><Moon className="h-4 w-4" /></button>
            <button onClick={() => setTheme('system')} className={`p-1 rounded-full ${theme === 'system' ? 'bg-white text-teal-500 shadow-sm dark:bg-slate-800' : 'text-slate-400'}`} aria-label="System mode"><Laptop className="h-4 w-4" /></button>
          </div>

          {/* Signin Button */}
          {user ? (
            <Link to="/dashboard" className="rounded-lg bg-teal-600 px-4 py-1.5 text-xs font-semibold text-white shadow-md hover:bg-teal-500 dark:bg-teal-500 dark:hover:bg-teal-400">
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200">
                Sign in
              </Link>
              <Link to="/login?mode=register" className="rounded-lg bg-teal-600 px-4 py-1.5 text-xs font-semibold text-white shadow-md hover:bg-teal-500 dark:bg-teal-500 dark:hover:bg-teal-400">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200">
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200/50 bg-white/95 backdrop-blur-md px-6 py-4 space-y-4 dark:border-slate-800/50 dark:bg-slate-950/95 z-50">
          <div className="flex flex-col gap-2">
            {publicLinks.map((link, idx) => (
              <Link
                key={idx}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive(link.path)
                    ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100'
                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
            <span className="text-xs text-slate-500 dark:text-slate-400">Theme</span>
            <div className="flex gap-2">
              <button onClick={() => setTheme('light')} className={`p-1.5 rounded-full border ${theme === 'light' ? 'bg-amber-100 border-amber-300 text-amber-600 dark:bg-slate-800 dark:border-slate-700' : 'border-transparent text-slate-400'}`}><Sun className="h-4 w-4" /></button>
              <button onClick={() => setTheme('dark')} className={`p-1.5 rounded-full border ${theme === 'dark' ? 'bg-indigo-100 border-indigo-300 text-indigo-600 dark:bg-slate-800 dark:border-slate-700' : 'border-transparent text-slate-400'}`}><Moon className="h-4 w-4" /></button>
              <button onClick={() => setTheme('system')} className={`p-1.5 rounded-full border ${theme === 'system' ? 'bg-teal-100 border-teal-300 text-teal-600 dark:bg-slate-800 dark:border-slate-700' : 'border-transparent text-slate-400'}`}><Laptop className="h-4 w-4" /></button>
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
            {user ? (
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="w-full text-center rounded-lg bg-teal-600 py-2 text-xs font-semibold text-white shadow-md">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full text-center rounded-lg border border-slate-200 py-2 text-xs font-semibold text-slate-600 dark:border-slate-800 dark:text-slate-400">
                  Sign in
                </Link>
                <Link to="/login?mode=register" onClick={() => setMobileMenuOpen(false)} className="w-full text-center rounded-lg bg-teal-600 py-2 text-xs font-semibold text-white shadow-md">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Main Public Body */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/50 bg-white py-12 dark:border-slate-800/50 dark:bg-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-teal-600 font-extrabold text-white dark:bg-teal-500">
                ASG
              </div>
              <strong className="text-sm font-bold dark:text-slate-200">ASG Tech Institute</strong>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              Practical technology learning for students. Follow Arjun Singh Gangwar for learning updates, coding demos, articles, video lessons, and direct contact.
            </p>
          </div>

          <div className="flex flex-col md:items-end gap-3">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">Connect with Arjun</span>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((item, idx) => (
                <a
                  key={idx}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-slate-200 text-xs text-slate-600 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 transition-all dark:border-slate-800 dark:text-slate-400 dark:bg-slate-900/50 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                >
                  <span className="font-bold text-teal-600 dark:text-teal-400">{item.short}</span>
                  <span>{item.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 border-t border-slate-100 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-slate-400 dark:border-slate-800">
          <span>&copy; 2026 ASG Tech Institute.</span>
          <a href="mailto:arjungangwariitpkd@gmail.com" className="hover:text-teal-500">arjungangwariitpkd@gmail.com</a>
        </div>
      </footer>
    </div>
  )
}
