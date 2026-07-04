import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useDatabaseStore } from '@/store/useDatabaseStore'
import { Search, Compass, BookOpen, Lock, Tag } from 'lucide-react'

export const Courses: React.FC = () => {
  const { courses, loadAllSiteData, courseAccessRequests } = useDatabaseStore()
  const [searchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadAllSiteData()
    const query = searchParams.get('search')
    if (query) setSearchQuery(query)
  }, [searchParams])

  const filteredCourses = courses.filter(course => {
    if (course.status !== 'active') return false
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      course.title.toLowerCase().includes(q) ||
      course.summary.toLowerCase().includes(q)
    )
  })

  // Check if student has access to course
  const checkCourseAccess = (courseId: string) => {
    const matched = courseAccessRequests.find(r => r.courseId === courseId)
    if (!matched) return 'locked'
    return matched.status // 'pending', 'approved', 'revoked'
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-4 dark:border-slate-800">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight dark:text-white">Courses Catalog</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Structured lessons, HTML/PDF notes, quizzes, and coding tasks.</p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 pl-10 text-xs outline-none transition-all focus:border-teal-500 dark:border-slate-800 dark:bg-slate-900/50 dark:focus:border-teal-500"
          />
          <Search className="absolute left-3.5 top-3 h-3.5 w-3.5 text-slate-400" />
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="text-center py-16 text-slate-400 space-y-3 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <Compass className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-700" />
          <h3 className="text-sm font-semibold">No courses matched</h3>
          <p className="text-xs max-w-xs mx-auto">Try typing another query or clearing the search filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course, idx) => {
            const accessStatus = course.price.toUpperCase() === 'FREE' ? 'approved' : checkCourseAccess(course.id)
            return (
              <article
                key={idx}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm hover:shadow-md dark:border-slate-800/50 dark:bg-slate-900 transition-all glass-panel"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 font-bold text-teal-800 dark:bg-teal-950/40 dark:text-teal-400">
                      {course.icon || 'PY'}
                    </div>
                    {accessStatus === 'approved' ? (
                      <span className="text-[10px] uppercase font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded dark:bg-teal-950/40 dark:text-teal-400">
                        Active
                      </span>
                    ) : accessStatus === 'pending' ? (
                      <span className="text-[10px] uppercase font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded dark:bg-amber-950/40 dark:text-amber-400">
                        Pending Approval
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded dark:bg-slate-850 dark:text-slate-500 inline-flex items-center gap-1">
                        <Lock className="h-3 w-3" /> Locked
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {course.title}
                  </h2>
                  <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {course.summary}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 inline-flex items-center gap-1">
                    <Tag className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" /> {course.price}
                  </span>
                  
                  {accessStatus === 'approved' ? (
                    <Link
                      to={`/courses/${course.id}`}
                      className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-teal-500 dark:bg-teal-500 dark:hover:bg-teal-400 transition-colors inline-flex items-center gap-1"
                    >
                      <BookOpen className="h-4 w-4" /> Open Course
                    </Link>
                  ) : accessStatus === 'pending' ? (
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                      Request Sent
                    </span>
                  ) : (
                    <Link
                      to={`/courses/${course.id}`}
                      className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline inline-flex items-center gap-1"
                    >
                      Unlock Course &rarr;
                    </Link>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
