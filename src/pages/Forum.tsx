import React, { useState } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { MessageSquare, ArrowLeft, Send } from 'lucide-react'
import { toast } from 'sonner'

interface Thread {
  id: string
  title: string
  body: string
  category: string
  author: string
  replies: { author: string; body: string }[]
}

export const Forum: React.FC = () => {
  const { profile } = useAuthStore()

  const [threads, setThreads] = useState<Thread[]>([
    { id: '1', title: 'Suggestions for machine learning project frameworks', body: 'Which algorithms are best for credit risk classifications?', category: 'ML Projects', author: 'Asha Sharma', replies: [] },
    { id: '2', title: 'Introductory career tips for freshers in data roles', body: 'Should I focus more on coding structures or modeling logic?', category: 'Careers', author: 'ASG Director', replies: [] }
  ])

  const [selectedThread, setSelectedThread] = useState<Thread | null>(null)
  const [newTitle, setNewTitle] = useState('')
  const [newBody, setNewBody] = useState('')
  const [replyText, setReplyText] = useState('')
  const [showCreate, setShowCreate] = useState(false)

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim() || !newBody.trim() || !profile) return
    const next: Thread = {
      id: String(threads.length + 1),
      title: newTitle.trim(),
      body: newBody.trim(),
      category: 'General',
      author: profile.name,
      replies: []
    }
    setThreads([next, ...threads])
    setNewTitle('')
    setNewBody('')
    setShowCreate(false)
    toast.success('Forum thread published.')
  }

  const handlePostReply = (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim() || !selectedThread || !profile) return
    const updated = threads.map(t => {
      if (t.id === selectedThread.id) {
        return {
          ...t,
          replies: [...t.replies, { author: profile.name, body: replyText.trim() }]
        }
      }
      return t
    })
    setThreads(updated)
    const match = updated.find(t => t.id === selectedThread.id)
    if (match) setSelectedThread(match)
    setReplyText('')
    toast.success('Comment reply posted.')
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-10 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b pb-4 dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight dark:text-white">Community Forum</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Share learning experiences, advice, or suggestions.</p>
        </div>
        {!selectedThread && (
          <button onClick={() => setShowCreate(!showCreate)} className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white">
            Create Thread
          </button>
        )}
      </div>

      {showCreate && !selectedThread && (
        <form onSubmit={handleCreate} className="p-6 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">New Thread</h3>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500">Title</label>
            <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none dark:border-slate-800 dark:bg-slate-850" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500">Message</label>
            <textarea rows={4} value={newBody} onChange={(e) => setNewBody(e.target.value)} required className="w-full rounded-xl border border-slate-200 p-3 text-xs outline-none dark:border-slate-800 dark:bg-slate-850" />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white">Publish Thread</button>
            <button type="button" onClick={() => setShowCreate(false)} className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold">Cancel</button>
          </div>
        </form>
      )}

      {selectedThread ? (
        <div className="space-y-6">
          <button onClick={() => setSelectedThread(null)} className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-teal-600"><ArrowLeft className="h-4 w-4" /> Back to Threads</button>
          <article className="p-6 rounded-2xl border bg-white dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h2 className="text-xl font-bold dark:text-white">{selectedThread.title}</h2>
            <p className="text-xs text-slate-600 dark:text-slate-350">{selectedThread.body}</p>
            <div className="text-[10px] text-slate-400">Published by {selectedThread.author}</div>
          </article>

          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Comments ({selectedThread.replies.length})</h3>
            <div className="space-y-2">
              {selectedThread.replies.map((r, rIdx) => (
                <div key={rIdx} className="p-3 bg-slate-50 border border-slate-100 rounded-xl dark:border-slate-800 dark:bg-slate-855 text-xs">
                  <strong className="block text-[10px] text-slate-400 mb-1">{r.author}</strong>
                  <p className="text-slate-700 dark:text-slate-300">{r.body}</p>
                </div>
              ))}
            </div>
            <form onSubmit={handlePostReply} className="flex gap-2">
              <input type="text" value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Type comment reply..." required className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none dark:border-slate-800 dark:bg-slate-900" />
              <button type="submit" className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white flex items-center gap-1"><Send className="h-4 w-4" /> Reply</button>
            </form>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {threads.map((t, idx) => (
            <article key={idx} onClick={() => setSelectedThread(t)} className="cursor-pointer p-5 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 flex justify-between items-center gap-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold dark:text-white">{t.title}</h3>
                <span className="text-[10px] text-slate-400">By {t.author} • {t.category}</span>
              </div>
              <span className="text-xs text-slate-400 flex items-center gap-1"><MessageSquare className="h-4 w-4" /> {t.replies.length} replies</span>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
