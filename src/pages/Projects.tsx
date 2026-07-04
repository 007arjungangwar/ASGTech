import React, { useEffect } from 'react'
import { useDatabaseStore } from '@/store/useDatabaseStore'
import { Award, Code } from 'lucide-react'

export const Projects: React.FC = () => {
  const { projectShowcase, loadAllSiteData } = useDatabaseStore()

  useEffect(() => {
    loadAllSiteData()
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight dark:text-white">Portfolio Projects</h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-xl">
          Apply your Python and data science skills on actual practical scenarios, generating proof of competence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projectShowcase.filter(p => p.status === 'active').map((proj, idx) => (
          <article
            key={idx}
            className="flex flex-col justify-between rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm hover:shadow-md dark:border-slate-800/50 dark:bg-slate-900 transition-all glass-panel"
          >
            <div>
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-1 rounded">
                  {proj.category}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  {proj.difficulty}
                </span>
              </div>
              <h2 className="text-xl font-bold dark:text-white leading-tight">
                {proj.title}
              </h2>
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {proj.summary}
              </p>
              
              <div className="mt-6 space-y-2">
                <strong className="text-xs font-semibold text-slate-400 block">Skills gained:</strong>
                <div className="flex flex-wrap gap-1.5">
                  {proj.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-[10px] text-slate-600 bg-slate-50 dark:text-slate-400 dark:bg-slate-800/60 px-2 py-0.5 rounded border border-slate-100 dark:border-slate-800/40"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <div className="space-y-1">
                <strong className="text-xs font-semibold text-slate-400 block">Project Outcome:</strong>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed flex items-start gap-1">
                  <Award className="h-4 w-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                  <span>{proj.outcome}</span>
                </p>
              </div>
              
              <a
                href={proj.url || '/login?next=/courses'}
                className="w-full text-center inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600/5 hover:bg-teal-600/10 text-teal-600 dark:bg-teal-500/10 dark:hover:bg-teal-500/20 dark:text-teal-400 py-2.5 text-xs font-semibold transition-colors"
              >
                <Code className="h-4 w-4" /> Start Project Workspace
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
