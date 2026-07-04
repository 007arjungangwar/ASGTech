import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDatabaseStore } from '@/store/useDatabaseStore'
import { useAuthStore } from '@/store/useAuthStore'
import { ShieldCheck, Play, Lock, ShieldAlert } from 'lucide-react'
import { toast } from 'sonner'

export const ExamCenter: React.FC = () => {
  const { quizCatalog, examAttempts, examRetakePermissions, loadAllSiteData } = useDatabaseStore()
  const { profile } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    loadAllSiteData()
  }, [])

  // Filter exams from quiz catalog
  // Any quiz that is marked as isExam or exam mode
  const exams = quizCatalog.filter(q => q.isExam || q.mode === 'exam' || q.id.includes('exam'))

  const getAttemptCount = (examId: string) => {
    return examAttempts.filter(a => a.examId === examId).length
  }

  const getBestScore = (examId: string) => {
    const attempts = examAttempts.filter(a => a.examId === examId)
    if (attempts.length === 0) return 0
    return Math.max(...attempts.map(a => a.score))
  }

  const handleStartExam = (exam: any) => {
    if (!profile) return

    const attempts = getAttemptCount(exam.id)
    if (attempts > 0) {
      // Check retake permission
      const permitted = examRetakePermissions.find(
        p => p.examType === 'quiz' && p.examId === exam.id && p.allowed
      )

      if (!permitted) {
        toast.error('Exams are limited to 1 attempt. Request a retake clearance from the Admin Dashboard.', {
          duration: 6000
        })
        return
      }
    }

    if (confirm(`Enter proctored exam environment? \n\nIMPORTANT PRECAUTIONS: \n1. Fullscreen mode will be locked. \n2. Tab switching or loss of cursor focus triggers AUTO-SUBMISSION. \n3. Ensure you have a stable internet connection. \n\nClick OK to launch.`)) {
      navigate(`/quiz-exam/${exam.id}`)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-10 pb-20">
      
      {/* Hero Header */}
      <section className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-950 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1 bg-indigo-500/20 backdrop-blur-md rounded-full px-3 py-1 border border-indigo-500/30 text-xs font-semibold text-indigo-300">
            <ShieldAlert className="h-3.5 w-3.5 text-indigo-400" /> Proctored Test Center
          </div>
          <h1 className="text-2xl font-extrabold sm:text-3xl tracking-tight">Certification Center</h1>
          <p className="text-xs text-slate-400 max-w-md leading-relaxed">
            Appear for qualification examinations. Successful certifications require scoring 70% or higher. Proctored visibility checks will apply.
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-600 font-extrabold text-white text-lg dark:bg-teal-500 shadow-lg">
          ASG
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Exams listings */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-base font-bold dark:text-white flex items-center gap-1.5">
            <ShieldCheck className="h-4.5 w-4.5 text-teal-600 dark:text-teal-400" /> Professional Exams
          </h2>

          <div className="space-y-4">
            {exams.map((exam, idx) => {
              const count = getAttemptCount(exam.id)
              const score = getBestScore(exam.id)
              const hasRetake = examRetakePermissions.some(p => p.examId === exam.id && p.allowed)
              const locked = count > 0 && !hasRetake

              return (
                <article
                  key={idx}
                  className="p-5 rounded-2xl border border-slate-200/50 bg-white dark:border-slate-800/50 dark:bg-slate-900 shadow-sm hover:shadow-md transition-all glass-panel flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] uppercase font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/45 dark:text-indigo-400 px-2 py-0.5 rounded">
                        Certification Exam
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">{exam.timeLimit} minutes</span>
                    </div>
                    <h3 className="text-base font-bold dark:text-white">{exam.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {exam.summary || 'Demonstrate master competence in core framework functionalities.'}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2 text-right">
                    {count > 0 && (
                      <div className="text-[10px] font-bold text-teal-600 dark:text-teal-400">
                        Completed (Best: {score}%)
                      </div>
                    )}
                    
                    {locked ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-3.5 py-2 rounded-xl">
                        <Lock className="h-4 w-4" /> Locked
                      </span>
                    ) : (
                      <button
                        onClick={() => handleStartExam(exam)}
                        className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-teal-500 dark:bg-teal-500 dark:hover:bg-teal-400 flex items-center gap-1.5 transition-colors"
                      >
                        <Play className="h-4 w-4 fill-current" /> Start Exam
                      </button>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        </div>

        {/* Retake Clearance side-panel widget */}
        <div className="space-y-6">
          <h2 className="text-base font-bold dark:text-white flex items-center gap-1.5">
            <ShieldCheck className="h-4.5 w-4.5 text-teal-600 dark:text-teal-400" /> Exam Clearances
          </h2>

          <div className="rounded-2xl border border-slate-200/50 bg-white p-5 shadow-sm dark:border-slate-800/50 dark:bg-slate-900 glass-panel space-y-4">
            <div className="space-y-1.5 text-xs text-slate-500 leading-relaxed">
              <p>For credentials auditing, exams are restricted to a single attempt.</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200">Need another attempt?</p>
              <p>Ask Arjun or use the Doubts Forum to request an exam permission override.</p>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3">
              <strong className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Clearance Statuses:</strong>
              {examRetakePermissions.length === 0 ? (
                <p className="text-[10px] text-slate-400 italic">No retake clearances active.</p>
              ) : (
                <div className="space-y-2 text-[10px]">
                  {examRetakePermissions.map((perm, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100 dark:bg-slate-850 dark:border-slate-800">
                      <div>
                        <strong className="block text-slate-800 dark:text-slate-200 truncate max-w-[120px]">{perm.examTitle}</strong>
                        <span className="text-[9px] text-slate-400">{perm.examType}</span>
                      </div>
                      <span className={`font-bold px-1.5 py-0.5 rounded ${perm.allowed ? 'bg-teal-100 text-teal-800' : 'bg-slate-200 text-slate-600'}`}>
                        {perm.allowed ? 'Approved' : 'Used'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
