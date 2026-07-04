import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDatabaseStore } from '@/store/useDatabaseStore'
import { useAuthStore } from '@/store/useAuthStore'
import { Play, ShieldCheck, Compass, HelpCircle } from 'lucide-react'
import { toast } from 'sonner'

export const Quiz: React.FC = () => {
  const { quizCatalog, quizAttempts, examRetakePermissions, loadAllSiteData } = useDatabaseStore()
  const { profile } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    loadAllSiteData()
  }, [])

  const currentQuizzes = quizCatalog.filter(q => q.status === 'active')

  // Check how many times student attempted a specific quiz
  const getAttemptCount = (quizId: string) => {
    return quizAttempts.filter(a => a.quizId === quizId).length
  }

  // Get best percentage for a quiz
  const getBestScore = (quizId: string) => {
    const attempts = quizAttempts.filter(a => a.quizId === quizId)
    if (attempts.length === 0) return 0
    return Math.max(...attempts.map(a => a.percentage))
  }

  const handleLaunchQuiz = (quiz: any) => {
    if (!profile) return
    
    const count = getAttemptCount(quiz.id)
    const isExam = quiz.isExam || quiz.isLocked || quiz.mode === 'exam'

    if (isExam && count > 0) {
      // Check retake clearance permissions
      const permitted = examRetakePermissions.find(
        p => p.examType === 'quiz' && p.examId === quiz.id && p.allowed
      )
      
      if (!permitted) {
        toast.error('Exams are limited to 1 attempt. Please request retake clearance from the Admin.', {
          duration: 5000
        })
        return
      }
    }

    if (confirm(`Start quiz: "${quiz.title}"? \nTime limit: ${quiz.timeLimit} minutes. \nLeaving the tab will trigger auto-submission.`)) {
      navigate(`/quiz-exam/${quiz.id}`)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10 pb-20">
      <div className="space-y-2 border-b pb-4 dark:border-slate-800">
        <h1 className="text-3xl font-extrabold tracking-tight dark:text-white">Assessment Center</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Reinforce your technical knowledge with automated diagnostic tests and exams.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Quiz Catalog list */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-base font-bold dark:text-white flex items-center gap-1.5">
            <ShieldCheck className="h-4.5 w-4.5 text-teal-600 dark:text-teal-400" /> Available Quizzes
          </h2>

          {currentQuizzes.length === 0 ? (
            <div className="text-center py-16 text-slate-400 space-y-3 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
              <Compass className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-700" />
              <h3 className="text-sm font-semibold">No quizzes loaded</h3>
              <p className="text-xs">Assessments catalog is empty at this time.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentQuizzes.map((quiz, idx) => {
                const attempts = getAttemptCount(quiz.id)
                const bestScore = getBestScore(quiz.id)
                const isExam = quiz.isExam || quiz.mode === 'exam' || quiz.id.includes('exam')

                return (
                  <article
                    key={idx}
                    className="p-5 rounded-2xl border border-slate-200/50 bg-white dark:border-slate-800/50 dark:bg-slate-900 shadow-sm hover:shadow-md transition-all glass-panel flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-4">
                        <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded ${
                          isExam
                            ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400'
                            : 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400'
                        }`}>
                          {isExam ? 'Exam Mode' : 'Practice Test'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">{quiz.timeLimit} mins</span>
                      </div>
                      <h3 className="text-sm font-bold dark:text-white">{quiz.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {quiz.summary || 'Verify your understanding of syntax topics.'}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div className="text-[10px] font-semibold text-slate-400">
                        {attempts > 0 ? (
                          <span className="text-teal-600 dark:text-teal-400">Attempts: {attempts} (Best: {bestScore}%)</span>
                        ) : (
                          <span>Not attempted</span>
                        )}
                      </div>
                      
                      <button
                        onClick={() => handleLaunchQuiz(quiz)}
                        className="rounded-xl bg-teal-600 px-4 py-2 text-[10px] font-semibold text-white shadow hover:bg-teal-500 dark:bg-teal-500 dark:hover:bg-teal-400 flex items-center gap-1"
                      >
                        <Play className="h-3.5 w-3.5 fill-current" /> Start Quiz
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>

        {/* Right Side: Attempts logs tracker */}
        <div className="space-y-6">
          <h2 className="text-base font-bold dark:text-white flex items-center gap-1.5">
            <HelpCircle className="h-4.5 w-4.5 text-teal-600 dark:text-teal-400" /> Recent Attempts
          </h2>

          <div className="rounded-2xl border border-slate-200/50 bg-white p-5 shadow-sm dark:border-slate-800/50 dark:bg-slate-900 glass-panel space-y-4">
            {quizAttempts.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">Appear for a quiz to see your progress metrics here.</p>
            ) : (
              <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
                {quizAttempts.sort((a,b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()).map((attempt, idx) => {
                  const passed = attempt.percentage >= 70
                  return (
                    <article key={idx} className="flex justify-between items-center gap-4 text-xs pb-3 border-b border-slate-100 last:border-0 last:pb-0 dark:border-slate-800">
                      <div>
                        <h4 className="font-bold dark:text-white truncate max-w-[130px]">{attempt.quizTitle}</h4>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {new Date(attempt.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-right">
                        <strong className={`block font-bold ${passed ? 'text-teal-600 dark:text-teal-400' : 'text-rose-600'}`}>
                          {attempt.percentage}%
                        </strong>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                          {passed ? 'Passed' : 'Failed'}
                        </span>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
