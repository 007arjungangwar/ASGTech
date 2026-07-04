import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDatabaseStore } from '@/store/useDatabaseStore'
import { useAuthStore } from '@/store/useAuthStore'
import { FocusLayout } from '@/layouts/FocusLayout'
import { ShieldAlert, ChevronLeft, ChevronRight, Clock, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { ExamAttempt, QuizAttempt, QuizAttemptAnswer } from '@/types'

interface ExamWorkspaceProps {
  examType: 'quiz' | 'coding-exam'
}

export const ExamWorkspace: React.FC<ExamWorkspaceProps> = () => {
  const { quizId, topic } = useParams<{ quizId?: string; topic?: string }>()
  const navigate = useNavigate()
  const { quizCatalog, quizQuestions, saveExamAttempt, saveQuizAttempt, consumeExamRetakePermission, loadAllSiteData } = useDatabaseStore()
  const { profile } = useAuthStore()

  // State controls
  const [examStarted, setExamStarted] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(600) // 10 minutes default
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({}) // questionIndex -> selectedOptionIndex
  const [submitted, setSubmitted] = useState(false)

  // Quiz details
  const activeQuizId = quizId || topic || ''
  const quiz = quizCatalog.find(q => q.id === activeQuizId)
  
  const timerRef = useRef<any>(null)
  const ignoreFocusRef = useRef<boolean>(false)

  useEffect(() => {
    loadAllSiteData()
  }, [])

  useEffect(() => {
    if (quiz) {
      setTimeRemaining(quiz.timeLimitMinutes * 60)
    }
  }, [quiz])

  // Proctoring listeners
  useEffect(() => {
    if (!examStarted || submitted) return

    const triggerAutoSubmit = (reason: string) => {
      if (submitted) return
      setSubmitted(true)
      toast.error(`Exam auto-submitted due to proctor violation: ${reason}`)
      handleFinishExam(true)
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        triggerAutoSubmit('Tab switched or window minimized.')
      }
    }

    const handleBlur = () => {
      setTimeout(() => {
        if (!document.hasFocus() && !ignoreFocusRef.current) {
          triggerAutoSubmit('Cursor left the exam browser workspace.')
        }
      }, 200)
    }

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !submitted) {
        triggerAutoSubmit('Exited proctor fullscreen layout.')
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    window.addEventListener('blur', handleBlur)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      window.removeEventListener('blur', handleBlur)
    }
  }, [examStarted, submitted])

  // Time Countdown runner
  useEffect(() => {
    if (examStarted && !submitted) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current)
            handleFinishExam(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => clearInterval(timerRef.current)
  }, [examStarted, submitted])

  if (!quiz) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-bold dark:text-white">Exam not found</h2>
        <button onClick={() => navigate('/quiz')} className="text-teal-600 hover:underline mt-4">Back to dashboard</button>
      </div>
    )
  }

  // Filter questions for this quiz
  const questions = quizQuestions.filter(q => q.quizId === quiz.id)

  const startProctoredExam = async () => {
    try {
      const docEl = document.documentElement
      if (docEl.requestFullscreen) {
        await docEl.requestFullscreen()
      }
      setExamStarted(true)
      
      if (profile) {
        await consumeExamRetakePermission(profile.id, profile.email, 'quiz', quiz.id)
      }
    } catch (err) {
      toast.error('Failed to trigger proctored fullscreen.')
    }
  }

  const handleFinishExam = async (violated = false) => {
    if (submitted && !violated) return
    setSubmitted(true)
    clearInterval(timerRef.current)

    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen()
      } catch (e) {
        console.warn(e)
      }
    }

    // Evaluate scores
    const questionsList = questions
    let correctCount = 0
    questionsList.forEach((q, idx) => {
      const userSelect = selectedOptions[idx]
      // Match correctOption index (converting string key to index if needed)
      const correctIdx = Number(q.correctOption)
      if (userSelect !== undefined && userSelect === correctIdx) {
        correctCount++
      }
    })

    const percentage = questionsList.length ? Math.round((correctCount / questionsList.length) * 100) : 0

    if (profile) {
      const answers: QuizAttemptAnswer[] = Object.entries(selectedOptions).map(([qIdx, optIdx]) => {
        const q = questionsList[Number(qIdx)]
        const selectedOpt = q.options[optIdx]
        const correctOpt = q.options[Number(q.correctOption)]
        return {
          questionId: q.id,
          prompt: q.prompt,
          selectedOption: String(optIdx),
          selectedText: selectedOpt ? selectedOpt.text : '',
          correctOption: String(q.correctOption),
          correctText: correctOpt ? correctOpt.text : '',
          explanation: q.explanation || '',
          isCorrect: optIdx === Number(q.correctOption)
        }
      })

      if (quiz.isExam || quiz.mode === 'exam') {
        const attemptRecord: ExamAttempt = {
          examType: 'quiz',
          examId: quiz.id,
          examTitle: quiz.title,
          quizTitle: quiz.title,
          score: percentage,
          percentage: percentage,
          total: questionsList.length,
          status: violated ? 'auto-submitted' : 'submitted',
          reason: violated ? 'window-focus-lost' : 'manual-submit',
          details: { answers },
          submittedAt: new Date().toISOString(),
          date: new Date().toISOString()
        }
        await saveExamAttempt(profile.id, attemptRecord)
      } else {
        const attemptRecord: QuizAttempt = {
          quizId: quiz.id,
          quizTitle: quiz.title,
          score: percentage,
          percentage: percentage,
          total: questionsList.length,
          answers,
          submittedAt: new Date().toISOString(),
          date: new Date().toISOString(),
          proctorReason: violated ? 'window-focus-lost' : undefined,
          autoSubmitted: violated
        }
        await saveQuizAttempt(profile.id, attemptRecord)
      }
    }

    toast.success('Assessment results graded and saved.')
  }

  const formatTime = () => {
    const minutes = Math.floor(timeRemaining / 60)
    const seconds = timeRemaining % 60
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  const currentQuestion = questions[currentIdx]

  return (
    <FocusLayout
      title={quiz.title}
      subtitle={examStarted && !submitted ? `Proctored Exam • ${questions.length} questions` : 'Exam Setup'}
      headerActions={
        examStarted && !submitted && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 font-mono text-xs dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 select-none">
            <Clock className="h-4 w-4 animate-pulse" />
            <span>{formatTime()}</span>
          </div>
        )
      }
    >
      <div className="py-6 max-w-4xl mx-auto">
        
        {/* Pre-launch Warning Screen */}
        {!examStarted && !submitted && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-2xl border border-slate-200/50 bg-white p-8 shadow-xl dark:border-slate-800/50 dark:bg-slate-900 glass-panel space-y-6 text-center max-w-lg mx-auto"
          >
            <ShieldAlert className="h-14 w-14 text-indigo-500 mx-auto animate-pulse" />
            <h2 className="text-xl font-bold dark:text-white">Proctored Assessment Setup</h2>
            <div className="text-xs text-slate-500 dark:text-slate-400 space-y-3 text-left bg-slate-50 p-4 rounded-xl border border-slate-100 dark:bg-slate-850 dark:border-slate-800/60 leading-relaxed">
              <p className="flex items-start gap-2">
                <span className="font-bold text-teal-600 dark:text-teal-400">&bull;</span>
                <span><strong>Fullscreen Mode:</strong> The assessment is restricted to fullscreen focus. Exiting will auto-submit.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="font-bold text-teal-600 dark:text-teal-400">&bull;</span>
                <span><strong>Tab & Cursor Monitors:</strong> Switching browser tabs, opening inspect panels, or losing cursor focus triggers instant auto-submission.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="font-bold text-teal-600 dark:text-teal-400">&bull;</span>
                <span><strong>Single Attempt Limit:</strong> Clearance retakes are limited. Ensure you have no interruptions.</span>
              </p>
            </div>
            <button
              onClick={startProctoredExam}
              className="w-full rounded-xl bg-teal-600 py-3 text-xs font-bold text-white shadow-lg hover:bg-teal-500 transition-colors"
            >
              Start Proctored Exam
            </button>
          </motion.div>
        )}

        {/* Live Question Sheet */}
        {examStarted && !submitted && currentQuestion && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch select-none">
            {/* Sidebar quick jump list */}
            <aside className="md:col-span-1 rounded-2xl border border-slate-200/50 bg-white p-4 dark:border-slate-800/50 dark:bg-slate-900 glass-panel flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Questions list</h3>
                <div className="flex flex-wrap gap-2">
                  {questions.map((_, idx) => {
                    const answered = selectedOptions[idx] !== undefined
                    const active = idx === currentIdx
                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentIdx(idx)}
                        className={`h-8 w-8 rounded-lg text-xs font-bold transition-all ${
                          active
                            ? 'bg-teal-600 text-white shadow-sm'
                            : answered
                            ? 'bg-teal-50 border border-teal-200 text-teal-700 dark:bg-teal-950/30 dark:border-teal-900/50 dark:text-teal-400'
                            : 'bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
                <button
                  onClick={() => {
                    if (confirm('Finish exam and submit answers?')) {
                      handleFinishExam(false)
                    }
                  }}
                  className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 py-2.5 text-xs font-bold text-white shadow"
                >
                  Submit Exam
                </button>
              </div>
            </aside>

            {/* Question Panel */}
            <main className="md:col-span-3 rounded-2xl border border-slate-200/50 bg-white p-6 dark:border-slate-800/50 dark:bg-slate-900 glass-panel flex flex-col justify-between space-y-8">
              <div className="space-y-6">
                <span className="text-[9px] uppercase font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded">
                  Question {currentIdx + 1} of {questions.length}
                </span>
                
                <h2 className="text-sm font-bold dark:text-white leading-relaxed">
                  {currentQuestion.prompt || currentQuestion.title}
                </h2>

                {/* Multiple choice options */}
                <div className="space-y-2">
                  {currentQuestion.options?.map((option, oIdx) => {
                    const active = selectedOptions[currentIdx] === oIdx
                    return (
                      <button
                        key={oIdx}
                        onClick={() => setSelectedOptions({ ...selectedOptions, [currentIdx]: oIdx })}
                        className={`w-full text-left rounded-xl border p-3.5 text-xs font-medium transition-all ${
                          active
                            ? 'border-teal-500 bg-teal-50/30 text-teal-700 dark:border-teal-500 dark:bg-teal-950/20 dark:text-teal-400'
                            : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-850/40 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex gap-2">
                          <span className={`h-4 w-4 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                            active ? 'border-teal-600 text-teal-600' : 'border-slate-400 text-slate-400'
                          }`}>
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span>{option.text}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Navigation controls */}
              <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                  disabled={currentIdx === 0}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-teal-600 disabled:opacity-30"
                >
                  <ChevronLeft className="h-4.5 w-4.5" /> Previous Question
                </button>
                <button
                  onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
                  disabled={currentIdx === questions.length - 1}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-teal-600 disabled:opacity-30"
                >
                  Next Question <ChevronRight className="h-4.5 w-4.5" />
                </button>
              </div>
            </main>
          </div>
        )}

        {/* Results Screen */}
        {submitted && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-2xl border border-slate-200/50 bg-white p-8 shadow-xl dark:border-slate-800/50 dark:bg-slate-900 glass-panel space-y-6 text-center max-w-lg mx-auto"
          >
            <CheckCircle2 className="h-14 w-14 text-teal-500 mx-auto fill-current" />
            <div className="space-y-2">
              <h2 className="text-xl font-bold dark:text-white">Exam Finished</h2>
              <p className="text-xs text-slate-500">Your proctored test results have been graded.</p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-b border-slate-100 dark:border-slate-800 py-6">
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Grades passed ratio</span>
                <strong className="text-2xl font-extrabold text-slate-800 dark:text-white">
                  {
                    (() => {
                      const questionsList = questions
                      let correctCount = 0
                      questionsList.forEach((q, idx) => {
                        const userSelect = selectedOptions[idx]
                        const correctIdx = Number(q.correctOption)
                        if (userSelect !== undefined && userSelect === correctIdx) {
                          correctCount++
                        }
                      })
                      return `${correctCount}/${questionsList.length}`
                    })()
                  }
                </strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Evaluation outcome</span>
                <strong className="text-2xl font-extrabold text-teal-600 dark:text-teal-400">
                  {
                    (() => {
                      const questionsList = questions
                      let correctCount = 0
                      questionsList.forEach((q, idx) => {
                        const userSelect = selectedOptions[idx]
                        const correctIdx = Number(q.correctOption)
                        if (userSelect !== undefined && userSelect === correctIdx) {
                          correctCount++
                        }
                      })
                      const pct = questionsList.length ? Math.round((correctCount / questionsList.length) * 100) : 0
                      return `${pct}%`
                    })()
                  }
                </strong>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => navigate('/exam-center')}
                className="flex-1 rounded-xl bg-teal-600 py-3 text-xs font-bold text-white hover:bg-teal-500 transition-colors"
              >
                Back to Exam Center
              </button>
              <button
                onClick={() => navigate('/tracker')}
                className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 transition-all"
              >
                View Achievements
              </button>
            </div>
          </motion.div>
        )}

      </div>
    </FocusLayout>
  )
}
