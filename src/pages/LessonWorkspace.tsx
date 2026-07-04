import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDatabaseStore } from '@/store/useDatabaseStore'
import { useAuthStore } from '@/store/useAuthStore'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, ChevronLeft, ChevronRight, Video, FileText,
  HelpCircle, MessageCircle, PenTool, BookOpen, Terminal
} from 'lucide-react'

export const LessonWorkspace: React.FC = () => {
  const { courseId, topicId } = useParams<{ courseId: string; topicId: string }>()
  const {
    courses, codingChallenges, courseAccessRequests
  } = useDatabaseStore()
  const { profile } = useAuthStore()

  const [activeTab, setActiveTab] = useState<'lesson' | 'video' | 'pdf' | 'quiz' | 'coding' | 'discussion' | 'notes'>('lesson')
  const [personalNotes, setPersonalNotes] = useState('')
  const [discussText, setDiscussText] = useState('')
  const [comments, setComments] = useState<{ author: string; text: string; date: string }[]>([
    { author: 'Meera Nair', text: 'Does anyone have trouble with scope binding inside loops?', date: '1 day ago' },
    { author: 'ASG Tutor', text: 'Use closures or let definitions to isolate scope in loops.', date: '18 hours ago' }
  ])

  // Get active course and topic
  const course = courses.find(c => c.id === courseId)
  const activeTopics = course?.topics?.filter(t => t.status === 'active') || []
  const topic = activeTopics.find(t => t.id === topicId)
  const topicIndex = activeTopics.findIndex(t => t.id === topicId)

  // Load and save personal notes from local cache matching student needs
  useEffect(() => {
    if (profile && topicId) {
      const saved = localStorage.getItem(`notes_${profile.id}_${topicId}`) || ''
      setPersonalNotes(saved)
    }
  }, [profile, topicId])

  const handleSaveNotes = () => {
    if (profile && topicId) {
      localStorage.setItem(`notes_${profile.id}_${topicId}`, personalNotes)
      toast.success('Notes saved locally.')
    }
  }

  if (!course || !topic) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-bold dark:text-white">Lesson not found</h2>
        <Link to="/courses" className="text-teal-600 hover:underline mt-4 inline-block">Back to courses</Link>
      </div>
    )
  }

  // Check paid access
  const isFree = course.price.toUpperCase() === 'FREE'
  const matchedRequest = courseAccessRequests.find(r => r.courseId === course.id)
  const accessGranted = isFree || matchedRequest?.status === 'approved'

  if (!accessGranted) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-xl font-bold dark:text-white">Course access is locked</h2>
        <p className="text-xs text-slate-500">Please unlock this course from the details page before launching the workspace.</p>
        <Link to={`/courses/${course.id}`} className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 hover:underline">
          Go to Course Details
        </Link>
      </div>
    )
  }

  // Handle YouTube embed urls conversions
  const getEmbedUrl = (url: string) => {
    const value = String(url || '').trim()
    if (!value) return ''
    if (value.includes('youtube.com/watch?v=')) {
      return value.replace('watch?v=', 'embed/')
    }
    if (value.includes('youtu.be/')) {
      return `https://www.youtube.com/embed/${value.split('youtu.be/')[1].split(/[?&]/)[0]}`
    }
    return value
  }

  // Filter coding challenges for this course & topic
  const challenges = codingChallenges.filter(c => c.courseId === course.id && c.topicId === topic.id)

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!discussText.trim() || !profile) return
    setComments([
      ...comments,
      { author: profile.name, text: discussText.trim(), date: 'Just now' }
    ])
    setDiscussText('')
    toast.success('Comment posted.')
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 pb-20 max-w-7xl mx-auto">
      
      {/* Sidebar - Course Topics Modules */}
      <aside className="w-full lg:w-72 flex-shrink-0 space-y-4">
        <div className="p-4 rounded-xl border border-slate-200/50 bg-white dark:border-slate-800/50 dark:bg-slate-900 glass-panel">
          <Link to={`/courses/${course.id}`} className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 mb-4">
            <ArrowLeft className="h-4 w-4" /> Course Details
          </Link>
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Module Modules</h2>
          <div className="space-y-1">
            {activeTopics.sort((a,b) => a.order - b.order).map((item, idx) => {
              const active = item.id === topicId
              return (
                <Link
                  key={idx}
                  to={`/courses/${course.id}/topics/${item.id}`}
                  className={`flex items-center gap-3 p-2.5 rounded-lg text-xs font-semibold transition-all ${
                    active
                      ? 'bg-teal-50 text-teal-700 border border-teal-100 dark:bg-teal-950/40 dark:text-teal-400 dark:border-teal-900/50'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/40 dark:hover:text-slate-100'
                  }`}
                >
                  <span className="text-[10px] w-4 text-center font-bold text-slate-400">{item.order}</span>
                  <span className="truncate">{item.title}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="flex-1 space-y-6">
        
        {/* Dynamic Video Player */}
        {topic.videoUrl && (
          <section className="overflow-hidden rounded-2xl border border-slate-200/50 bg-slate-950 shadow-lg dark:border-slate-800/50">
            <div className="aspect-video w-full">
              <iframe
                title="Lesson video lecture"
                src={getEmbedUrl(topic.videoUrl)}
                className="h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </section>
        )}

        {/* Tab Controls */}
        <div className="flex flex-wrap gap-2 border-b pb-3 dark:border-slate-800">
          {[
            { id: 'lesson', label: 'Lesson', icon: BookOpen },
            { id: 'video', label: 'Video', icon: Video, hide: !topic.videoUrl },
            { id: 'pdf', label: 'PDF Notes', icon: FileText, hide: topic.contentType !== 'pdf' && !topic.contentStoragePath },
            { id: 'quiz', label: 'Assessment', icon: HelpCircle, hide: !topic.quizHtml },
            { id: 'coding', label: 'Coding Practice', icon: Terminal, hide: challenges.length === 0 },
            { id: 'discussion', label: 'Doubts', icon: MessageCircle },
            { id: 'notes', label: 'Notes', icon: PenTool }
          ].filter(tab => !tab.hide).map(tab => {
            const Icon = tab.icon
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  active
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-500/20 dark:bg-teal-500'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-850'
                }`}
              >
                <Icon className="h-4 w-4" /> {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab Workspaces */}
        <section className="min-h-96 rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm dark:border-slate-800/50 dark:bg-slate-900 glass-panel">
          <AnimatePresence mode="wait">
            {activeTab === 'lesson' && (
              <motion.div
                key="lesson"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 text-sm leading-relaxed space-y-4"
              >
                {topic.contentType === 'html' ? (
                  <div dangerouslySetInnerHTML={{ __html: topic.content }} />
                ) : (
                  <div className="text-center py-12 space-y-3">
                    <FileText className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-700" />
                    <h3 className="font-semibold text-slate-700 dark:text-slate-300">PDF Document Lesson</h3>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">This topic consists of a PDF worksheet. Open the PDF Notes tab to view or download it.</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'pdf' && (
              <motion.div
                key="pdf"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4 text-center"
              >
                <h3 className="text-sm font-bold dark:text-white">PDF Materials</h3>
                <p className="text-xs text-slate-500">Download or read PDF notes for this course module directly.</p>
                <a
                  href={topic.contentStoragePath || topic.contentUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-semibold text-white shadow hover:bg-teal-500 dark:bg-teal-500 dark:hover:bg-teal-400 transition-colors"
                >
                  <FileText className="h-4.5 w-4.5" /> Download PDF Notes
                </a>
              </motion.div>
            )}

            {activeTab === 'quiz' && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="prose dark:prose-invert max-w-none text-sm leading-relaxed"
              >
                {topic.quizHtml ? (
                  <div dangerouslySetInnerHTML={{ __html: topic.quizHtml }} />
                ) : (
                  <p className="text-slate-500">No inline quizzes attached. Complete topic evaluations via assessments.</p>
                )}
              </motion.div>
            )}

            {activeTab === 'coding' && (
              <motion.div
                key="coding"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h3 className="text-sm font-bold dark:text-white">Coding Challenges</h3>
                  <p className="text-xs text-slate-500">Solve these interactive compiler tasks to fulfill module requirements.</p>
                </div>
                <div className="space-y-3">
                  {challenges.map((challenge, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 dark:border-slate-800/50 dark:bg-slate-850/40">
                      <div>
                        <h4 className="text-xs font-bold dark:text-white">{challenge.title}</h4>
                        <p className="text-[10px] text-slate-400 mt-1">{challenge.difficulty} • {challenge.topic}</p>
                      </div>
                      <Link
                        to={`/coding-practice?challenge=${challenge.id}`}
                        className="rounded-xl bg-teal-600 px-4 py-2 text-[10px] font-semibold text-white hover:bg-teal-500 flex items-center gap-1 dark:bg-teal-500 dark:hover:bg-teal-400"
                      >
                        <Terminal className="h-3.5 w-3.5" /> Launch Compiler
                      </Link>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'discussion' && (
              <motion.div
                key="discussion"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="space-y-2 border-b pb-4 dark:border-slate-800">
                  <h3 className="text-sm font-bold dark:text-white">Discussion Board</h3>
                  <p className="text-xs text-slate-400">Ask coding queries, seek debugging checks, or collaborate with peers.</p>
                </div>

                <form onSubmit={handlePostComment} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ask a question..."
                    value={discussText}
                    onChange={(e) => setDiscussText(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs outline-none focus:border-teal-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800/40 dark:focus:border-teal-500"
                    required
                  />
                  <button type="submit" className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-teal-500 dark:bg-teal-500 dark:hover:bg-teal-400">
                    Post
                  </button>
                </form>

                <div className="space-y-4">
                  {comments.map((comment, idx) => (
                    <article key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50/30 dark:border-slate-800/40 dark:bg-slate-850/20 space-y-1">
                      <div className="flex items-center justify-between gap-4 text-[10px]">
                        <strong className="font-bold dark:text-slate-200">{comment.author}</strong>
                        <span className="text-slate-400">{comment.date}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {comment.text}
                      </p>
                    </article>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'notes' && (
              <motion.div
                key="notes"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <h3 className="text-sm font-bold dark:text-white">Topic Notebook</h3>
                  <p className="text-xs text-slate-500">Draft study reviews and code snippets. Saved in browser cache.</p>
                </div>
                <textarea
                  rows={8}
                  placeholder="Paste syntax summaries or personal comments here..."
                  value={personalNotes}
                  onChange={(e) => setPersonalNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-xs font-mono outline-none focus:border-teal-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800/30 dark:focus:border-teal-500"
                />
                <button
                  onClick={handleSaveNotes}
                  className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-teal-500 dark:bg-teal-500 dark:hover:bg-teal-400"
                >
                  Save Notes
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Footer Navigation */}
        <nav className="flex items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-850">
          {topicIndex > 0 ? (
            <Link
              to={`/courses/${course.id}/topics/${activeTopics[topicIndex - 1].id}`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 transition-colors"
            >
              <ChevronLeft className="h-4.5 w-4.5" /> Previous Module
            </Link>
          ) : (
            <span className="text-xs text-slate-300 dark:text-slate-700 select-none">Start of Course</span>
          )}

          {topicIndex < activeTopics.length - 1 ? (
            <Link
              to={`/courses/${course.id}/topics/${activeTopics[topicIndex + 1].id}`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 transition-colors"
            >
              Next Module <ChevronRight className="h-4.5 w-4.5" />
            </Link>
          ) : (
            <span className="text-xs text-slate-300 dark:text-slate-700 select-none">Course Complete</span>
          )}
        </nav>

      </div>
    </div>
  )
}
