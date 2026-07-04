import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { useTheme } from '@/contexts/ThemeContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Mail, User as UserIcon, ArrowLeft, Loader2, Sun, Moon } from 'lucide-react'
import { toast, Toaster } from 'sonner'

export const Login: React.FC = () => {
  const { signIn, register, resetPasswordForEmail, updatePassword, user, loading } = useAuthStore()
  const { theme, setTheme } = useTheme()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'reset'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  // Set initial mode based on URL query
  useEffect(() => {
    const isRegister = searchParams.get('mode') === 'register'
    const isReset = searchParams.get('mode') === 'reset-password'
    if (isRegister) setMode('register')
    else if (isReset) setMode('reset')
    else setMode('login')

    const authNotice = sessionStorage.getItem('authNotice')
    if (authNotice) {
      toast.info(authNotice)
      sessionStorage.removeItem('authNotice')
    }
  }, [searchParams])

  // Redirect to dashboard if logged in
  useEffect(() => {
    if (user) {
      const next = searchParams.get('next') || '/dashboard'
      navigate(next)
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (mode === 'login') {
        if (!email || !password) return toast.error('Please enter email and password.')
        await signIn(email, password)
        toast.success('Successfully signed in!')
      } else if (mode === 'register') {
        if (!name || !email || !password) return toast.error('All fields are required.')
        if (password !== confirmPassword) return toast.error('Passwords do not match.')
        await register(email, password, name)
        toast.success('Registration successful! Please sign in.')
        setMode('login')
      } else if (mode === 'forgot') {
        if (!email) return toast.error('Please enter your email address.')
        await resetPasswordForEmail(email)
        toast.success('Password reset email sent! Check your inbox.')
        setMode('login')
      } else if (mode === 'reset') {
        if (!password) return toast.error('Please enter a new password.')
        await updatePassword(password)
        toast.success('Password updated successfully! Redirecting...')
        navigate('/dashboard')
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during authentication.')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden bg-radial from-teal-500/10 via-transparent to-transparent">
      <Toaster position="top-right" richColors />
      
      {/* Back button */}
      <Link to="/" className="absolute top-6 left-6 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-950 dark:hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to website
      </Link>

      {/* Theme Toggler */}
      <button 
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="absolute top-6 right-6 p-2 rounded-full border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md rounded-2xl border border-slate-200/50 bg-white p-8 shadow-xl dark:border-slate-800/50 dark:bg-slate-900 glass-panel space-y-8"
      >
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-teal-600 font-extrabold text-white text-lg dark:bg-teal-500">
            ASG
          </div>
          <h2 className="text-2xl font-bold dark:text-white">
            {mode === 'login' && 'Sign in to ASG Tech'}
            {mode === 'register' && 'Create your account'}
            {mode === 'forgot' && 'Reset your password'}
            {mode === 'reset' && 'Set new password'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {mode === 'login' && 'Enter your email to access courses and code compiler'}
            {mode === 'register' && 'Join our practical student learning community'}
            {mode === 'forgot' && 'Provide your email to receive recovery instructions'}
            {mode === 'reset' && 'Enter a secure new password for your account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="popLayout">
            {mode === 'register' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-1.5"
              >
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Arjun Singh"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-4 text-sm outline-none transition-all focus:border-teal-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800/40 dark:focus:border-teal-500"
                  />
                  <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                </div>
              </motion.div>
            )}

            {mode !== 'reset' && (
              <motion.div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-4 text-sm outline-none transition-all focus:border-teal-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800/40 dark:focus:border-teal-500"
                  />
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                </div>
              </motion.div>
            )}

            {mode !== 'forgot' && (
              <motion.div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Password</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-4 text-sm outline-none transition-all focus:border-teal-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800/40 dark:focus:border-teal-500"
                  />
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                </div>
              </motion.div>
            )}

            {mode === 'register' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-1.5"
              >
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Confirm Password</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-4 text-sm outline-none transition-all focus:border-teal-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800/40 dark:focus:border-teal-500"
                  />
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-teal-600 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-teal-500 flex items-center justify-center gap-2 transition-colors disabled:bg-slate-300 dark:bg-teal-500 dark:hover:bg-teal-400 dark:disabled:bg-slate-800"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Processing...
              </>
            ) : (
              <>
                {mode === 'login' && 'Sign In'}
                {mode === 'register' && 'Register Account'}
                {mode === 'forgot' && 'Send Reset Email'}
                {mode === 'reset' && 'Reset Password'}
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-4">
          {mode === 'login' && (
            <p>
              Don't have an account?{' '}
              <button onClick={() => setMode('register')} className="text-teal-600 dark:text-teal-400 font-bold hover:underline">
                Create one
              </button>
            </p>
          )}
          {mode === 'register' && (
            <p>
              Already have an account?{' '}
              <button onClick={() => setMode('login')} className="text-teal-600 dark:text-teal-400 font-bold hover:underline">
                Sign in
              </button>
            </p>
          )}
          {mode === 'forgot' && (
            <button onClick={() => setMode('login')} className="text-teal-600 dark:text-teal-400 font-bold hover:underline">
              Back to login
            </button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
