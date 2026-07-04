import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDatabaseStore } from '@/store/useDatabaseStore'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Award, CheckCircle2, Flame, Terminal, ArrowRight } from 'lucide-react'

export const Tracker: React.FC = () => {
  const { quizAttempts, codingSubmissions, examAttempts, loadAllSiteData } = useDatabaseStore()

  useEffect(() => {
    loadAllSiteData()
  }, [])

  // Calculate statistics
  const totalQuizzesPassed = quizAttempts.filter(a => a.percentage >= 70).length
  const totalChallengesSolved = codingSubmissions.filter(s => s.passed === s.total && s.total > 0).length
  const totalExamsPassed = examAttempts.filter(a => a.score >= 70).length

  // Mock study consistency points data
  const chartData = [
    { name: 'Week 1', progress: 20 },
    { name: 'Week 2', progress: 35 },
    { name: 'Week 3', progress: 50 },
    { name: 'Week 4', progress: 75 }
  ]

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10 pb-20">
      <div className="space-y-2 border-b pb-4 dark:border-slate-800">
        <h1 className="text-3xl font-extrabold tracking-tight dark:text-white font-sans">Progress Tracker</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Review your course percentages, coding completions, and credential logs.
        </p>
      </div>

      {/* Metrics Row */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <article className="p-5 rounded-2xl border border-slate-200/50 bg-white shadow-sm dark:border-slate-800/50 dark:bg-slate-900 glass-panel flex items-center gap-4">
          <div className="p-3 bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400 rounded-xl">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <strong className="block text-xl font-bold dark:text-white">{totalQuizzesPassed}</strong>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Quizzes Passed</span>
          </div>
        </article>

        <article className="p-5 rounded-2xl border border-slate-200/50 bg-white shadow-sm dark:border-slate-800/50 dark:bg-slate-900 glass-panel flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 rounded-xl">
            <Terminal className="h-6 w-6" />
          </div>
          <div>
            <strong className="block text-xl font-bold dark:text-white">{totalChallengesSolved}</strong>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Challenges Solved</span>
          </div>
        </article>

        <article className="p-5 rounded-2xl border border-slate-200/50 bg-white shadow-sm dark:border-slate-800/50 dark:bg-slate-900 glass-panel flex items-center gap-4">
          <div className="p-3 bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400 rounded-xl">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <strong className="block text-xl font-bold dark:text-white">{totalExamsPassed}</strong>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Exams Passed</span>
          </div>
        </article>

        <article className="p-5 rounded-2xl border border-slate-200/50 bg-white shadow-sm dark:border-slate-800/50 dark:bg-slate-900 glass-panel flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 rounded-xl">
            <Flame className="h-6 w-6" />
          </div>
          <div>
            <strong className="block text-xl font-bold dark:text-white">Active</strong>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Streak active</span>
          </div>
        </article>
      </section>

      {/* Recharts progress timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Weekly Activity Line */}
        <section className="lg:col-span-2 rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm dark:border-slate-800/50 dark:bg-slate-900 glass-panel space-y-4">
          <h2 className="text-base font-bold dark:text-white">Overall Learning curve</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" opacity={0.3} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                <Line type="monotone" dataKey="progress" stroke="#0d9488" strokeWidth={3} dot={{ strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} name="Progress Index" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Exams history side-grid */}
        <section className="rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm dark:border-slate-800/50 dark:bg-slate-900 glass-panel flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-base font-bold dark:text-white">Exam credentials</h2>
            
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {examAttempts.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No certificates issued yet. Complete certification exams with &ge; 70%.</p>
              ) : (
                examAttempts.map((attempt, idx) => {
                  const passed = attempt.score >= 70
                  return (
                    <article
                      key={idx}
                      className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-850/40 flex items-center justify-between gap-4"
                    >
                      <div>
                        <h4 className="text-xs font-bold dark:text-white truncate max-w-[130px]">{attempt.quizTitle}</h4>
                        <span className="text-[9px] text-slate-400 block mt-0.5">{new Date(attempt.submittedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="text-right">
                        <strong className={`block text-xs font-extrabold ${passed ? 'text-teal-600 dark:text-teal-400' : 'text-rose-600'}`}>
                          {attempt.score}%
                        </strong>
                        {passed && (
                          <Link to="/certificate" className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                            Get Cert
                          </Link>
                        )}
                      </div>
                    </article>
                  )
                })
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
            <Link
              to="/certificate"
              className="w-full text-center inline-flex items-center justify-center gap-1 bg-teal-600 hover:bg-teal-500 py-2.5 text-xs font-bold text-white shadow rounded-xl"
            >
              Go to Credentials Portal <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

      </div>
    </div>
  )
}
