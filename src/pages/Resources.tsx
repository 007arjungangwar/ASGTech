import React, { useEffect } from 'react'
import { useDatabaseStore } from '@/store/useDatabaseStore'
import { Download, FileText, Globe, Bookmark, Compass } from 'lucide-react'

export const Resources: React.FC = () => {
  const { resourceLibrary, loadAllSiteData } = useDatabaseStore()

  useEffect(() => {
    loadAllSiteData()
  }, [])

  const currentResources = resourceLibrary.filter(r => r.status === 'active')

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-10 pb-20">
      <div className="space-y-2 border-b pb-4 dark:border-slate-800">
        <h1 className="text-3xl font-extrabold tracking-tight dark:text-white">Resource Library</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Supplementary PDF materials, cheat sheet lists, textbooks, and reference documentations.
        </p>
      </div>

      {currentResources.length === 0 ? (
        <div className="text-center py-16 text-slate-400 space-y-3 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <Compass className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-700" />
          <h3 className="text-sm font-semibold">No resource library links</h3>
          <p className="text-xs">Any uploaded reference sheets or dataset zips will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {currentResources.map((res, idx) => (
            <article
              key={idx}
              className="group p-5 rounded-2xl border border-slate-200/50 bg-white shadow-sm hover:shadow-md dark:border-slate-800/50 dark:bg-slate-900 transition-all glass-panel flex gap-4 items-start"
            >
              <div className="p-3 rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400">
                {res.category.toLowerCase().includes('book') || res.category.toLowerCase().includes('text') ? (
                  <Bookmark className="h-5 w-5" />
                ) : (
                  <FileText className="h-5 w-5" />
                )}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[9px] uppercase font-bold text-slate-400 bg-slate-50 dark:bg-slate-850 px-2 py-0.5 rounded">
                    {res.category}
                  </span>
                  <span className="text-[10px] text-slate-400">{res.fileSize || 'N/A'}</span>
                </div>
                <h3 className="text-sm font-bold dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {res.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {res.summary}
                </p>
                <div className="pt-2">
                  <a
                    href={res.fileUrl || res.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600/5 hover:bg-teal-600/10 text-teal-600 dark:bg-teal-500/10 dark:hover:bg-teal-500/20 dark:text-teal-400 px-3.5 py-1.5 text-[10px] font-semibold transition-colors"
                  >
                    {res.fileUrl ? (
                      <>
                        <Download className="h-3.5 w-3.5" /> Download File
                      </>
                    ) : (
                      <>
                        <Globe className="h-3.5 w-3.5" /> External Reference
                      </>
                    )}
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
