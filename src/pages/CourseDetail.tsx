import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDatabaseStore } from '@/store/useDatabaseStore'
import { useAuthStore } from '@/store/useAuthStore'
import { ChevronRight, Lock, ArrowLeft, Send } from 'lucide-react'
import { toast } from 'sonner'

export const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>()
  const { courses, courseAccessRequests, createCourseAccessRequest, loadAllSiteData } = useDatabaseStore()
  const { profile } = useAuthStore()
  
  const [requestNote, setRequestNote] = useState('')
  const [requesting, setRequesting] = useState(false)

  useEffect(() => {
    loadAllSiteData()
  }, [])

  const course = courses.find(c => c.id === courseId)

  if (!course) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-bold dark:text-white">Course not found</h2>
        <Link to="/courses" className="text-teal-600 hover:underline mt-4 inline-block">Back to catalog</Link>
      </div>
    )
  }

  // Check paid access
  const isFree = course.price.toUpperCase() === 'FREE'
  const matchedRequest = courseAccessRequests.find(r => r.courseId === course.id)
  const accessGranted = isFree || matchedRequest?.status === 'approved'
  const isPending = matchedRequest?.status === 'pending'

  const handleRequestAccess = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return
    setRequesting(true)

    // Generate random 16 character token for paid requests matching the original backend.js format
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let token = 'ASG-REQ-'
    for (let i = 0; i < 12; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    try {
      await createCourseAccessRequest({
        requestToken: token,
        userId: profile.id,
        name: profile.name,
        email: profile.email,
        courseId: course.id,
        courseTitle: course.title,
        price: course.price,
        status: 'pending',
        note: requestNote.trim() || 'Paid course access requested.'
      })
      toast.success('Course access request submitted! Admin will verify soon.')
      setRequestNote('')
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit request.')
    } finally {
      setRequesting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-10 pb-20">
      <Link to="/courses" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to catalog
      </Link>

      {/* Course Banner header */}
      <section className="p-6 rounded-2xl border border-slate-200/50 bg-white dark:border-slate-800/50 dark:bg-slate-900 glass-panel flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded">
            {course.icon || 'PY'}
          </span>
          <h1 className="text-2xl font-extrabold sm:text-3xl dark:text-white">{course.title}</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">{course.summary}</p>
        </div>
        <div className="text-right">
          <span className="block text-xs font-semibold text-slate-400">Price Tier</span>
          <strong className="text-xl font-extrabold text-slate-800 dark:text-white">{course.price}</strong>
        </div>
      </section>

      {/* Main detail columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Side: Welcome and Cheatsheet */}
        <div className="md:col-span-2 space-y-8">
          <section className="p-6 rounded-2xl border border-slate-200/50 bg-white dark:border-slate-800/50 dark:bg-slate-900 glass-panel space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Welcome Guide</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {course.welcome || 'Welcome to this learning pathway. Complete each topic in order.'}
            </p>
          </section>

          <section className="p-6 rounded-2xl border border-slate-200/50 bg-white dark:border-slate-800/50 dark:bg-slate-900 glass-panel space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Cheat Sheet Summary</h3>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 font-mono text-[10px] text-slate-700 dark:bg-slate-800/30 dark:border-slate-800/40 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {course.cheatSheet || 'Cheatsheet summaries will appear as you progress.'}
            </div>
          </section>
        </div>

        {/* Right Side: Topics list or unlocking requests */}
        <div className="md:col-span-1">
          {accessGranted ? (
            <section className="p-6 rounded-2xl border border-slate-200/50 bg-white dark:border-slate-800/50 dark:bg-slate-900 glass-panel space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Topic Modules</h3>
              <div className="space-y-2">
                {course.topics?.filter(t => t.status === 'active').sort((a,b) => a.order - b.order).map((topic, idx) => (
                  <Link
                    key={idx}
                    to={`/courses/${course.id}/topics/${topic.id}`}
                    className="group flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-teal-400 dark:border-slate-800/50 dark:bg-slate-800/30 dark:hover:border-teal-500 transition-all"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="text-[10px] font-bold text-slate-400 w-4 text-center">
                        {topic.order}
                      </span>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                        {topic.title}
                      </span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors" />
                  </Link>
                ))}
              </div>
            </section>
          ) : isPending ? (
            <section className="p-6 rounded-2xl border border-amber-200 bg-amber-50/20 text-center dark:border-amber-900/30 dark:bg-amber-950/10 space-y-3">
              <Lock className="h-8 w-8 mx-auto text-amber-500" />
              <h3 className="text-sm font-bold text-amber-700 dark:text-amber-400">Request Pending</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Your course request is currently being validated. Admin will approve paid courses manually.
              </p>
            </section>
          ) : (
            <section className="p-6 rounded-2xl border border-slate-200/50 bg-white dark:border-slate-800/50 dark:bg-slate-900 glass-panel space-y-4">
              <div className="text-center space-y-2">
                <Lock className="h-8 w-8 mx-auto text-slate-400" />
                <h3 className="text-sm font-bold dark:text-white">This course is locked</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  This is a paid module. Enter a request note containing transaction references to request course access.
                </p>
              </div>
              <form onSubmit={handleRequestAccess} className="space-y-3">
                <textarea
                  placeholder="Tx ID, reference, or enrollment details..."
                  rows={3}
                  value={requestNote}
                  onChange={(e) => setRequestNote(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs outline-none focus:border-teal-500 dark:border-slate-800 dark:bg-slate-800/40"
                  required
                />
                <button
                  type="submit"
                  disabled={requesting}
                  className="w-full rounded-xl bg-teal-600 py-2 text-xs font-semibold text-white shadow-md hover:bg-teal-500 flex items-center justify-center gap-1.5 dark:bg-teal-500 dark:hover:bg-teal-400"
                >
                  {requesting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Request Access
                </button>
              </form>
            </section>
          )}
        </div>

      </div>
    </div>
  )
}

const Loader2: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
)
