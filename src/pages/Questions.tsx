import React, { useState } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, ArrowLeft, Send, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

interface Doubt {
  id: string
  title: string
  category: string
  body: string
  authorName: string
  createdAt: string
  replies: { authorName: string; body: string; createdAt: string }[]
  resolved: boolean
}

export const Questions: React.FC = () => {
  const { profile } = useAuthStore()

  const [doubts, setDoubts] = useState<Doubt[]>([
    {
      id: '1',
      title: 'IndexError: single-dimensional list indexing mismatch',
      category: 'Python Basics',
      body: 'I am getting index errors when trying to slices lists inside loops. How does Python slice stop parameters execute?',
      authorName: 'Ravi Verma',
      createdAt: '1 day ago',
      resolved: true,
      replies: [
        { authorName: 'ASG Tutor', body: 'The stop index in Python slicing is exclusive. Use list[start:stop] where stop is the index you want to stop BEFORE.', createdAt: '18 hours ago' }
      ]
    },
    {
      id: '2',
      title: 'Pandas merge vs join performance difference?',
      category: 'Pandas & DataFrames',
      body: 'When dealing with millions of rows, is merge significantly faster than joining on indices?',
      authorName: 'Meera Nair',
      createdAt: '2 days ago',
      resolved: false,
      replies: []
    }
  ])

  const [selectedDoubt, setSelectedDoubt] = useState<Doubt | null>(null)
  const [newTitle, setNewTitle] = useState('')
  const [newCategory, setNewCategory] = useState('Python Basics')
  const [newBody, setNewBody] = useState('')
  const [replyText, setReplyText] = useState('')
  const [showCreate, setShowCreate] = useState(false)

  const handleCreateDoubt = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim() || !newBody.trim() || !profile) return

    const newDoubt: Doubt = {
      id: String(doubts.length + 1),
      title: newTitle.trim(),
      category: newCategory,
      body: newBody.trim(),
      authorName: profile.name,
      createdAt: 'Just now',
      resolved: false,
      replies: []
    }

    setDoubts([newDoubt, ...doubts])
    setNewTitle('')
    setNewBody('')
    setShowCreate(false)
    toast.success('Doubt question posted to community forum.')
  }

  const handlePostReply = (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim() || !selectedDoubt || !profile) return

    const updated = doubts.map(d => {
      if (d.id === selectedDoubt.id) {
        const nextReplies = [
          ...d.replies,
          { authorName: profile.name, body: replyText.trim(), createdAt: 'Just now' }
        ]
        return { ...d, replies: nextReplies }
      }
      return d
    })

    setDoubts(updated)
    const match = updated.find(d => d.id === selectedDoubt.id)
    if (match) setSelectedDoubt(match)
    
    setReplyText('')
    toast.success('Reply submitted.')
  }

  const handleToggleResolve = (id: string) => {
    const updated = doubts.map(d => {
      if (d.id === id) return { ...d, resolved: !d.resolved }
      return d
    })
    setDoubts(updated)
    const match = updated.find(d => d.id === id)
    if (match) setSelectedDoubt(match)
    toast.success('Status toggled.')
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-10 pb-20">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b pb-4 dark:border-slate-800">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight dark:text-white">Doubt Forum</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Ask the community or direct tutors for help with syntax bugs.</p>
        </div>

        {!selectedDoubt && (
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-teal-500 transition-colors"
          >
            Ask a Doubt
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        
        {/* Create Doubt overlay Form */}
        {showCreate && !selectedDoubt && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-6 rounded-2xl border border-slate-200/50 bg-white dark:border-slate-800/50 dark:bg-slate-900 glass-panel"
          >
            <form onSubmit={handleCreateDoubt} className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Post New Question</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ValueError during data alignment"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs outline-none focus:border-teal-500 dark:border-slate-800 dark:bg-slate-850"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500">Category Tag</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-teal-500 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-300"
                  >
                    <option value="Python Basics">Python Basics</option>
                    <option value="Pandas & DataFrames">Pandas & DataFrames</option>
                    <option value="Machine Learning">Machine Learning</option>
                    <option value="Neural Networks">Neural Networks</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Description</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Paste error logs, expected outputs, or code details..."
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-xs font-mono outline-none focus:border-teal-500 dark:border-slate-800 dark:bg-slate-850"
                />
              </div>

              <div className="flex gap-2">
                <button type="submit" className="rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-teal-500">
                  Publish Question
                </button>
                <button type="button" onClick={() => setShowCreate(false)} className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300">
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Doubt detail viewer */}
        {selectedDoubt ? (
          <motion.article
            key="detail"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="space-y-6"
          >
            <button
              onClick={() => setSelectedDoubt(null)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-teal-600 mb-2 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Q&amp;A List
            </button>

            <div className="p-6 rounded-2xl border border-slate-200/50 bg-white dark:border-slate-800/50 dark:bg-slate-900 glass-panel space-y-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[10px] uppercase font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded dark:bg-teal-950/40 dark:text-teal-400">
                  {selectedDoubt.category}
                </span>
                <button
                  onClick={() => handleToggleResolve(selectedDoubt.id)}
                  className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                    selectedDoubt.resolved ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {selectedDoubt.resolved ? 'Resolved' : 'Mark Resolved'}
                </button>
              </div>

              <h2 className="text-xl font-bold dark:text-white leading-snug">{selectedDoubt.title}</h2>
              <pre className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs font-mono text-slate-600 dark:bg-slate-850 dark:border-slate-800 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                {selectedDoubt.body}
              </pre>

              <div className="text-[10px] text-slate-400 font-medium">
                Asked by <strong>{selectedDoubt.authorName}</strong> • {selectedDoubt.createdAt}
              </div>
            </div>

            {/* Replies section */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold dark:text-white flex items-center gap-1">
                <MessageSquare className="h-4 w-4 text-teal-500" /> Replies ({selectedDoubt.replies.length})
              </h3>
              
              <div className="space-y-3">
                {selectedDoubt.replies.map((reply, rIdx) => (
                  <article key={rIdx} className="p-4 rounded-xl border border-slate-100 bg-slate-50/30 dark:border-slate-805/40 dark:bg-slate-850/20 space-y-1.5">
                    <div className="flex justify-between items-center gap-4 text-[10px] font-medium text-slate-400">
                      <strong className="text-slate-800 dark:text-slate-200">{reply.authorName}</strong>
                      <span>{reply.createdAt}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {reply.body}
                    </p>
                  </article>
                ))}
              </div>

              {/* Submit replies form */}
              <form onSubmit={handlePostReply} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Provide reply explanation or solutions..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs outline-none focus:border-teal-500 dark:border-slate-800 dark:bg-slate-900"
                  required
                />
                <button type="submit" className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-teal-500 flex items-center gap-1">
                  <Send className="h-3.5 w-3.5" /> Send
                </button>
              </form>
            </div>
          </motion.article>
        ) : (
          /* Doubt catalog list view */
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {doubts.map((doubt, idx) => (
              <article
                key={idx}
                onClick={() => setSelectedDoubt(doubt)}
                className="group cursor-pointer p-5 rounded-2xl border border-slate-200/50 bg-white shadow-sm hover:shadow-md dark:border-slate-800/50 dark:bg-slate-900 transition-all glass-panel flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] uppercase font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded dark:bg-teal-950/40 dark:text-teal-400">
                      {doubt.category}
                    </span>
                    {doubt.resolved && (
                      <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded dark:bg-emerald-950/40 dark:text-emerald-400 flex items-center gap-0.5">
                        <CheckCircle className="h-3 w-3" /> Resolved
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {doubt.title}
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    By {doubt.authorName} • {doubt.createdAt}
                  </p>
                </div>

                <div className="text-xs text-slate-400 font-semibold flex items-center gap-1.5 text-right">
                  <MessageSquare className="h-4.5 w-4.5 text-slate-300" /> {doubt.replies.length} replies
                </div>
              </article>
            ))}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
