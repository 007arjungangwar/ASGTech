import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDatabaseStore } from '@/store/useDatabaseStore'
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react'

export const Roadmap: React.FC = () => {
  const { roadmapItems, loadAllSiteData } = useDatabaseStore()

  useEffect(() => {
    loadAllSiteData()
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-10 pb-20">
      <div className="space-y-2 border-b pb-4 dark:border-slate-800">
        <h1 className="text-3xl font-extrabold tracking-tight dark:text-white">Study Roadmap</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Syllabus stages from core syntax constructs to advanced artificial neural networks.
        </p>
      </div>

      <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 pl-8 space-y-12">
        {roadmapItems.filter(item => item.status === 'active').sort((a,b) => a.order - b.order).map((stage, idx) => (
          <article key={idx} className="relative space-y-4">
            {/* Timeline Dot icon */}
            <span className="absolute -left-[45px] top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-teal-50 border-2 border-teal-500 text-teal-600 dark:bg-teal-950/60 dark:border-teal-400 dark:text-teal-400">
              {stage.completed ? <CheckCircle2 className="h-4.5 w-4.5 fill-current" /> : <Circle className="h-4.5 w-4.5" />}
            </span>

            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded">
                Stage {stage.order}
              </span>
              <h2 className="text-xl font-bold dark:text-white leading-tight">
                {stage.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
                {stage.summary}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl bg-white p-5 rounded-2xl border border-slate-200/50 dark:bg-slate-900 dark:border-slate-800/50 glass-panel">
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Target Skills</h4>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  {stage.skills?.map((skill: string, sIdx: number) => (
                    <li key={sIdx} className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recommended Course</h4>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mt-1">
                    {stage.courseTitle || 'Related course modules'}
                  </p>
                </div>
                {stage.courseId && (
                  <Link
                    to={`/courses/${stage.courseId}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline mt-4 sm:mt-0"
                  >
                    View course modules <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
