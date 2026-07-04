import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { useDatabaseStore } from '@/store/useDatabaseStore'
import { useTheme } from '@/contexts/ThemeContext'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu, X, Sun, Moon, Laptop, Bell, Search, LogOut, User as UserIcon,
  LineChart, Award, ShieldAlert, BookOpen, Map, Video, FileText,
  HelpCircle, MessageSquare, MessageCircle, Settings, ChevronRight
} from 'lucide-react'
import { toast, Toaster } from 'sonner'

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, signOut } = useAuthStore()
  const { studentAnnouncement, subscribeToRealtime, loadAllSiteData, loadUserProgress } = useDatabaseStore()
  const { theme, setTheme } = useTheme()
  
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showAlerts, setShowAlerts] = useState(false)
  
  const navigate = useNavigate()
  const location = useLocation()

  // Realtime subscription and initial load
  useEffect(() => {
    loadAllSiteData()
    if (profile) {
      loadUserProgress(profile.id, profile.email, profile.role === 'admin')
    }
    
    const unsubscribe = subscribeToRealtime((key, value) => {
      if (key === 'studentAnnouncement' && value?.active && profile?.role !== 'admin') {
        toast.info(`Announcement: ${value.title}`, {
          description: value.body,
          duration: 6000
        })
      }
    })

    return () => {
      unsubscribe()
    }
  }, [profile])

  const handleLogout = async () => {
    if (confirm('Do you want to sign out of ASG Tech?')) {
      await signOut()
      navigate('/')
    }
  }

  // Get active page checks
  const isActive = (path: string) => {
    return location.pathname === path
  }

  // Get user avatar initials
  const getUserInitials = () => {
    if (!profile?.name) return 'ST'
    return profile.name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(part => part.charAt(0).toUpperCase())
      .join('')
  }

  // Navigation schema
  const navGroups = [
    {
      title: 'Learn',
      items: [
        { label: 'Courses', path: '/courses', icon: BookOpen },
        { label: 'Roadmap', path: '/roadmap', icon: Map },
        { label: 'Videos', path: '/videos', icon: Video },
        { label: 'Resources', path: '/resources', icon: FileText }
      ]
    },
    {
      title: 'Practice',
      items: [
        { label: 'Quiz Exam', path: '/quiz', icon: ShieldAlert },
        { label: 'Coding Practice', path: '/coding-practice', icon: LineChart },
        { label: 'Exam Center', path: '/exam-center', icon: ShieldAlert },
        { label: 'Progress', path: '/tracker', icon: LineChart },
        { label: 'Certificates', path: '/certificate', icon: Award },
        { label: 'AI Tutor', path: '/assistant', icon: HelpCircle }
      ]
    },
    {
      title: 'Community',
      items: [
        { label: 'Ask Doubt', path: '/questions', icon: HelpCircle },
        { label: 'Forum', path: '/forum', icon: MessageSquare },
        { label: 'Live Chat', path: '/chat', icon: MessageCircle }
      ]
    }
  ]

  if (profile?.role === 'admin') {
    navGroups.push({
      title: 'Admin',
      items: [
        { label: 'Dashboard', path: '/admin', icon: Settings },
        { label: 'Content Guide', path: '/admin/guide', icon: FileText }
      ]
    })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    const query = searchQuery.trim().toLowerCase()
    
    // Quick search router matching
    if (query.includes('quiz') || query.includes('test')) {
      navigate('/quiz')
    } else if (query.includes('coding') || query.includes('practice')) {
      navigate('/coding-practice')
    } else if (query.includes('exam')) {
      navigate('/exam-center')
    } else if (query.includes('course')) {
      navigate('/courses')
    } else if (query.includes('roadmap')) {
      navigate('/roadmap')
    } else if (query.includes('video')) {
      navigate('/videos')
    } else if (query.includes('cert')) {
      navigate('/certificate')
    } else if (query.includes('doubt') || query.includes('question')) {
      navigate('/questions')
    } else if (query.includes('chat')) {
      navigate('/chat')
    } else if (query.includes('forum')) {
      navigate('/forum')
    } else {
      navigate(`/courses?search=${encodeURIComponent(query)}`)
    }
    setSearchQuery('')
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-50">
      <Toaster position="top-right" richColors />
      
      {/* Collapsible Left Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-slate-200/50 bg-white transition-transform duration-300 ease-in-out dark:border-slate-800/50 dark:bg-slate-900/95 lg:static ${
          sidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full lg:w-20 lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-200/50 dark:border-slate-800/50">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-600 font-extrabold text-white dark:bg-teal-500">
              ASG
            </div>
            {sidebarOpen && (
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-teal-600 to-indigo-600 bg-clip-text text-transparent dark:from-teal-400 dark:to-indigo-400">
                ASG Tech
              </span>
            )}
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar Items */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-2">
              {sidebarOpen ? (
                <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {group.title}
                </h3>
              ) : (
                <div className="border-t border-slate-200/50 dark:border-slate-800/50 my-4" />
              )}
              <div className="space-y-1">
                {group.items.map((item, iIdx) => {
                  const Icon = item.icon
                  const active = isActive(item.path)
                  return (
                    <Link
                      key={iIdx}
                      to={item.path}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                        active
                          ? 'bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/40 dark:hover:text-slate-100'
                      }`}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      {sidebarOpen && <span>{item.label}</span>}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        {sidebarOpen && (
          <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50 text-xs text-slate-500 dark:text-slate-400">
            <div>Logged in as:</div>
            <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">{profile?.name}</div>
            <div className="capitalize mt-1 text-[10px] bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-400 inline-block px-1.5 py-0.5 rounded font-bold">
              {profile?.role}
            </div>
          </div>
        )}
      </aside>

      {/* Main Workspace Frame */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/50 bg-white/70 backdrop-blur-md px-6 transition-colors dark:border-slate-800/50 dark:bg-slate-950/70">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              aria-label="Toggle Menu Sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            {/* Breadcrumbs Nav */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Link to="/dashboard" className="hover:text-slate-800 dark:hover:text-slate-200">Dashboard</Link>
              {location.pathname !== '/dashboard' && (
                <>
                  <ChevronRight className="h-3 w-3" />
                  <span className="font-semibold capitalize text-slate-800 dark:text-slate-200">
                    {location.pathname.split('/').pop()?.replace('-', ' ')}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Search form */}
          <form onSubmit={handleSearch} className="relative hidden md:block w-72">
            <input
              type="text"
              placeholder="Search workspaces..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-slate-200 bg-slate-50/50 py-1.5 pl-9 pr-4 text-xs outline-none transition-all focus:border-teal-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900/50 dark:focus:border-teal-500 dark:focus:bg-slate-900"
            />
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          </form>

          {/* Top Bar Right Utils */}
          <div className="flex items-center gap-4">
            {/* Theme Selector */}
            <div className="flex items-center bg-slate-100 rounded-full p-0.5 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50">
              <button
                onClick={() => setTheme('light')}
                className={`p-1 rounded-full ${theme === 'light' ? 'bg-white text-amber-500 shadow-sm dark:bg-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                aria-label="Light mode"
              >
                <Sun className="h-4 w-4" />
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`p-1 rounded-full ${theme === 'dark' ? 'bg-white text-indigo-500 shadow-sm dark:bg-slate-800' : 'text-slate-400 hover:text-slate-200'}`}
                aria-label="Dark mode"
              >
                <Moon className="h-4 w-4" />
              </button>
              <button
                onClick={() => setTheme('system')}
                className={`p-1 rounded-full ${theme === 'system' ? 'bg-white text-teal-500 shadow-sm dark:bg-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                aria-label="System mode"
              >
                <Laptop className="h-4 w-4" />
              </button>
            </div>

            {/* Notification Drawer Button */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowAlerts(!showAlerts)
                  setShowProfileMenu(false)
                }}
                className={`p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 relative ${
                  studentAnnouncement?.active && profile?.role !== 'admin' ? 'text-teal-600 dark:text-teal-400' : 'text-slate-500'
                }`}
                aria-label="Alerts"
              >
                <Bell className="h-5 w-5" />
                {studentAnnouncement?.active && profile?.role !== 'admin' && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-teal-500 animate-ping" />
                )}
              </button>
              
              <AnimatePresence>
                {showAlerts && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200/50 bg-white p-4 shadow-xl dark:border-slate-800/50 dark:bg-slate-900 z-50 glass-panel"
                  >
                    <h4 className="text-sm font-semibold border-b pb-2 dark:border-slate-800">Institute Announcements</h4>
                    <div className="mt-3 space-y-2">
                      {studentAnnouncement?.active && profile?.role !== 'admin' ? (
                        <div>
                          <strong className="text-xs text-teal-600 dark:text-teal-400 block">{studentAnnouncement.title}</strong>
                          <p className="text-xs mt-1 text-slate-600 dark:text-slate-300 leading-relaxed">
                            {studentAnnouncement.body}
                          </p>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 dark:text-slate-400 py-4 text-center">No new announcements at this time.</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Account Profile circle dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu)
                  setShowAlerts(false)
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white shadow-sm ring-2 ring-slate-100 hover:ring-teal-400 dark:bg-teal-500 dark:ring-slate-800"
              >
                {getUserInitials()}
              </button>
              
              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200/50 bg-white p-2 shadow-xl dark:border-slate-800/50 dark:bg-slate-900 z-50 glass-panel"
                  >
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                      <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{profile?.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{profile?.email}</div>
                    </div>
                    <div className="py-1 space-y-0.5">
                      <Link to="/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/50" onClick={() => setShowProfileMenu(false)}>
                        <UserIcon className="h-4 w-4 text-slate-400" />
                        My Profile
                      </Link>
                      <Link to="/tracker" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/50" onClick={() => setShowProfileMenu(false)}>
                        <LineChart className="h-4 w-4 text-slate-400" />
                        My Progress
                      </Link>
                      <Link to="/certificate" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/50" onClick={() => setShowProfileMenu(false)}>
                        <Award className="h-4 w-4 text-slate-400" />
                        Certificates
                      </Link>
                      {profile?.role === 'admin' && (
                        <Link to="/admin" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/50" onClick={() => setShowProfileMenu(false)}>
                          <Settings className="h-4 w-4 text-slate-400" />
                          Admin Dashboard
                        </Link>
                      )}
                      <button onClick={() => { setShowProfileMenu(false); handleLogout(); }} className="flex w-full items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/20">
                        <LogOut className="h-4 w-4 text-rose-400" />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Dynamic Global Announcement Banner */}
        {studentAnnouncement?.active && profile?.role !== 'admin' && (
          <div className="bg-teal-50 border-b border-teal-200/50 px-6 py-2 text-center text-xs font-medium text-teal-800 dark:bg-teal-950/30 dark:border-teal-900/30 dark:text-teal-400 animate-pulse">
            📢 <strong>{studentAnnouncement.title}</strong>: {studentAnnouncement.body}
          </div>
        )}

        {/* Content Workspace Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
