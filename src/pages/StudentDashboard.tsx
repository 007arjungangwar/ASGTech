import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { useDatabaseStore } from '@/store/useDatabaseStore'
import {
  Flame, Award, Play, Clock,
  Calendar as CalendarIcon, UserPlus, ChevronRight
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts'

export const StudentDashboard: React.FC = () => {
  const { profile } = useAuthStore()
  const {
    courses, codingSubmissions
  } = useDatabaseStore()

  // Streaks calculations
  const [streakCount] = useState(3) // Mock/calculated streak
  const [activeTab, setActiveTab] = useState<'weekly' | 'skills'>('weekly')

  // Pomodoro Focus Timer State
  const [timerMinutes, setTimerMinutes] = useState(25)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)
  const [timerSession, setTimerSession] = useState<'study' | 'break'>('study')

  useEffect(() => {
    let interval: any = null
    if (timerRunning) {
      interval = setInterval(() => {
        if (timerSeconds > 0) {
          setTimerSeconds(timerSeconds - 1)
        } else if (timerMinutes > 0) {
          setTimerMinutes(timerMinutes - 1)
          setTimerSeconds(59)
        } else {
          // Timer finished
          setTimerRunning(false)
          if (timerSession === 'study') {
            alert('Study session complete! Time for a short break.')
            setTimerSession('break')
            setTimerMinutes(5)
          } else {
            alert('Break over! Ready to focus?')
            setTimerSession('study')
            setTimerMinutes(25)
          }
        }
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [timerRunning, timerMinutes, timerSeconds, timerSession])

  const toggleTimer = () => setTimerRunning(!timerRunning)
  const resetTimer = () => {
    setTimerRunning(false)
    setTimerSession('study')
    setTimerMinutes(25)
    setTimerSeconds(0)
  }

  // Weekly study hours data (mock)
  const weeklyData = [
    { day: 'Mon', hours: 1.5 },
    { day: 'Tue', hours: 2.0 },
    { day: 'Wed', hours: 0.8 },
    { day: 'Thu', hours: 3.2 },
    { day: 'Fri', hours: 1.2 },
    { day: 'Sat', hours: 4.0 },
    { day: 'Sun', hours: 2.5 }
  ]

  // Skill mappings
  const skillsData = [
    { subject: 'Python Basics', A: 90, B: 110, fullMark: 150 },
    { subject: 'Pandas', A: 75, B: 130, fullMark: 150 },
    { subject: 'NumPy', A: 85, B: 130, fullMark: 150 },
    { subject: 'SQL', A: 60, B: 120, fullMark: 150 },
    { subject: 'Machine Learning', A: 50, B: 140, fullMark: 150 },
    { subject: 'Deep Learning', A: 40, B: 140, fullMark: 150 }
  ]

  // Leaderboard data (mock)
  const leaderboard = [
    { rank: 1, name: 'Asha Sharma', points: 940, avatar: 'AS' },
    { rank: 2, name: 'Ravi Verma', points: 870, avatar: 'RV' },
    { rank: 3, name: 'Meera Nair', points: 850, avatar: 'MN' },
    { rank: 4, name: 'Arjun Singh (You)', points: 720, avatar: 'AS' }
  ]

  const totalChallengesSolved = codingSubmissions.filter(s => s.passed === s.total && s.total > 0).length

  return (
    <div className="space-y-8 pb-10">
      {/* Greetings Hero */}
      <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6 rounded-2xl bg-gradient-to-r from-teal-600 to-indigo-600 text-white shadow-xl dark:from-teal-800 dark:to-indigo-950">
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold sm:text-3xl tracking-tight">
            Welcome back, {profile?.name.split(' ')[0]}!
          </h1>
          <p className="text-xs text-teal-100 max-w-md">
            Your daily focus is looking strong. Resume your last course or take a quick quiz assessment below.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 border border-white/10">
            <Flame className="h-6 w-6 text-amber-400 fill-current animate-pulse" />
            <div>
              <strong className="block text-lg font-bold">{streakCount} Days</strong>
              <span className="text-[10px] text-teal-100 font-medium">Active Streak</span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 border border-white/10">
            <Award className="h-6 w-6 text-teal-300" />
            <div>
              <strong className="block text-lg font-bold">{totalChallengesSolved}</strong>
              <span className="text-[10px] text-teal-100 font-medium">Challenges Solved</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Double-Col Panels */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Continue Learning card */}
          <section className="rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm dark:border-slate-800/50 dark:bg-slate-900 glass-panel">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h2 className="text-lg font-bold dark:text-white">Continue Learning</h2>
              <span className="text-xs font-semibold text-slate-400">Next module up</span>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-slate-50/50 p-4 rounded-xl border border-slate-100 dark:bg-slate-800/40 dark:border-slate-800/60">
              <div className="space-y-1.5 flex-1">
                <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">Python Foundations</span>
                <h3 className="text-base font-bold dark:text-white">Functions: Scope, Definition & Lambda Parameters</h3>
                <div className="w-full bg-slate-200 rounded-full h-2 mt-3 dark:bg-slate-700 max-w-md">
                  <div className="bg-teal-500 h-2 rounded-full" style={{ width: '45%' }} />
                </div>
                <small className="text-[10px] text-slate-400 block mt-1">45% completed (Topic 4/10)</small>
              </div>
              <Link
                to="/courses/python-for-beginners/topics/python-beginner-topic-4"
                className="rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-teal-500 flex items-center gap-1.5 dark:bg-teal-500 dark:hover:bg-teal-400 transition-colors"
              >
                <Play className="h-4.5 w-4.5 fill-current" /> Resume Lesson
              </Link>
            </div>
          </section>

          {/* Analytics Tabs (Weekly Activity or Skill Graph) */}
          <section className="rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm dark:border-slate-800/50 dark:bg-slate-900 glass-panel">
            <div className="flex items-center justify-between border-b pb-4 mb-6 dark:border-slate-800">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('weekly')}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                    activeTab === 'weekly'
                      ? 'bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400'
                      : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  Weekly Study Hours
                </button>
                <button
                  onClick={() => setActiveTab('skills')}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                    activeTab === 'skills'
                      ? 'bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400'
                      : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  Skill Map Graph
                </button>
              </div>
            </div>

            <div className="h-72 w-full">
              {activeTab === 'weekly' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" opacity={0.3} />
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                    <Area type="monotone" dataKey="hours" stroke="#0d9488" strokeWidth={2} fillOpacity={1} fill="url(#colorHours)" name="Hours studied" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillsData}>
                    <PolarGrid stroke="#cbd5e1" opacity={0.3} />
                    <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={9} />
                    <PolarRadiusAxis angle={30} domain={[0, 150]} stroke="#94a3b8" fontSize={8} />
                    <Radar name="My Score" dataKey="A" stroke="#0d9488" fill="#0d9488" fillOpacity={0.25} />
                    <Radar name="Avg Peer Score" dataKey="B" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.05} />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  </RadarChart>
                </ResponsiveContainer>
              )}
            </div>
          </section>

          {/* Recommended Lessons Grid */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold dark:text-white">Recommended for you</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.slice(0, 2).map((course, idx) => (
                <article key={idx} className="p-4 rounded-xl border border-slate-200/50 bg-white dark:border-slate-800/50 dark:bg-slate-900 glass-panel flex justify-between items-center gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded">
                      {course.icon || 'PY'}
                    </span>
                    <h3 className="text-sm font-bold dark:text-white">{course.title}</h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">{course.summary}</p>
                  </div>
                  <Link to={`/courses/${course.id}`} className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-slate-300 transition-colors">
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                </article>
              ))}
            </div>
          </section>
        </div>

        {/* Right Single-Col Widgets */}
        <div className="space-y-8">
          
          {/* Pomodoro Focus Timer Panel */}
          <section className="rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm dark:border-slate-800/50 dark:bg-slate-900 glass-panel text-center space-y-6">
            <div className="border-b pb-3 dark:border-slate-800">
              <h2 className="text-base font-bold dark:text-white flex items-center gap-1.5 justify-center">
                <Clock className="h-4.5 w-4.5 text-teal-500" /> Focus Pomodoro
              </h2>
              <span className="text-[10px] text-slate-400 capitalize font-medium">{timerSession} session</span>
            </div>
            
            <div className="relative mx-auto flex h-36 w-36 items-center justify-center">
              {/* SVG Ring background indicator */}
              <svg className="absolute inset-0 h-full w-full transform -rotate-90">
                <circle cx="72" cy="72" r="64" strokeWidth="6" stroke="#f1f5f9" fill="transparent" className="dark:stroke-slate-800" />
                <circle
                  cx="72"
                  cy="72"
                  r="64"
                  strokeWidth="6"
                  stroke={timerSession === 'study' ? '#0d9488' : '#6366f1'}
                  fill="transparent"
                  strokeDasharray={402}
                  strokeDashoffset={402 - (402 * ((timerMinutes * 60 + timerSeconds) / (timerSession === 'study' ? 1500 : 300)))}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="text-3xl font-extrabold tracking-tight select-none dark:text-white">
                {String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}
              </div>
            </div>

            <div className="flex gap-2 justify-center">
              <button
                onClick={toggleTimer}
                className={`rounded-xl px-4 py-2 text-xs font-semibold shadow-md transition-colors ${
                  timerRunning
                    ? 'bg-amber-600 hover:bg-amber-500 text-white'
                    : 'bg-teal-600 hover:bg-teal-500 text-white dark:bg-teal-500 dark:hover:bg-teal-400'
                }`}
              >
                {timerRunning ? 'Pause' : 'Start'}
              </button>
              <button
                onClick={resetTimer}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-750 transition-colors"
              >
                Reset
              </button>
            </div>
          </section>

          {/* Interactive Exam Calendar Widget */}
          <section className="rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm dark:border-slate-800/50 dark:bg-slate-900 glass-panel">
            <h2 className="text-base font-bold dark:text-white flex items-center gap-1.5 mb-4">
              <CalendarIcon className="h-4.5 w-4.5 text-teal-500" /> Exam Schedule
            </h2>
            <div className="space-y-4">
              <article className="flex gap-4 border-l-2 border-teal-500 pl-3">
                <div className="text-center">
                  <strong className="block text-sm font-bold text-teal-600 dark:text-teal-400">12</strong>
                  <span className="text-[9px] uppercase font-semibold text-slate-400">July</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold dark:text-white">Pandas DataFrame Test</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">Available from 10:00 AM onwards</p>
                </div>
              </article>
              <article className="flex gap-4 border-l-2 border-slate-200 pl-3 dark:border-slate-800">
                <div className="text-center">
                  <strong className="block text-sm font-bold text-slate-400">28</strong>
                  <span className="text-[9px] uppercase font-semibold text-slate-400">July</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold dark:text-white">ML Modeling Quiz Exam</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">Requires Retake clearance approval</p>
                </div>
              </article>
            </div>
          </section>

          {/* Gamified Leaderboard */}
          <section className="rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm dark:border-slate-800/50 dark:bg-slate-900 glass-panel">
            <h2 className="text-base font-bold dark:text-white flex items-center gap-1.5 mb-4">
              <UserPlus className="h-4.5 w-4.5 text-teal-500" /> Peer Leaderboard
            </h2>
            <div className="space-y-3">
              {leaderboard.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`w-5 font-bold text-center ${item.rank <= 3 ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'}`}>
                      {item.rank}
                    </span>
                    <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300 text-[10px]">
                      {item.avatar}
                    </div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[110px]">{item.name}</span>
                  </div>
                  <strong className="font-bold text-slate-800 dark:text-white">{item.points} pts</strong>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
