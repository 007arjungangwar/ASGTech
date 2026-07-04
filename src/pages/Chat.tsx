import React, { useState, useEffect, useRef } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { Send, User as UserIcon } from 'lucide-react'

interface ChatMessage {
  id: number
  text: string
  userName: string
  userId: string
  time: number
}

export const Chat: React.FC = () => {
  const { profile } = useAuthStore()

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputText, setInputText] = useState('')
  const [userName, setUserName] = useState('')

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (profile) {
      setUserName(profile.name)
    }
  }, [profile])

  // Load chat messages from localStorage
  const loadMessages = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('asg_chat_messages') || '[]')
      // If empty, seed mock discussions
      if (stored.length === 0) {
        const seed: ChatMessage[] = [
          { id: 1, text: 'Hello everyone! Ready for the Pandas exam today?', userName: 'Asha Sharma', userId: 'user1', time: Date.now() - 600000 },
          { id: 2, text: 'Getting index errors in lists slicing. Let me check the doubts forum.', userName: 'Ravi Verma', userId: 'user2', time: Date.now() - 300000 }
        ]
        localStorage.setItem('asg_chat_messages', JSON.stringify(seed))
        setMessages(seed)
      } else {
        setMessages(stored)
      }
    } catch (e) {
      setMessages([])
    }
  }

  // Monitor storage events to update messages across tabs
  useEffect(() => {
    loadMessages()
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'asg_chat_messages') {
        loadMessages()
      }
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim() || !profile) return

    const newMsg: ChatMessage = {
      id: Date.now(),
      text: inputText.trim(),
      userName: userName.trim() || profile.name,
      userId: profile.id,
      time: Date.now()
    }

    const nextList = [...messages, newMsg]
    localStorage.setItem('asg_chat_messages', JSON.stringify(nextList))
    setMessages(nextList)
    setInputText('')
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] max-w-4xl mx-auto border border-slate-200/50 rounded-2xl bg-white shadow-sm overflow-hidden dark:border-slate-800/50 dark:bg-slate-900 glass-panel">
      {/* Header */}
      <header className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
        <div>
          <h2 className="text-sm font-bold dark:text-white">Community Chat</h2>
          <span className="text-[10px] text-slate-400 font-semibold">Active lobby</span>
        </div>
        <div className="text-xs font-semibold text-slate-400">
          <span className="h-2 w-2 rounded-full bg-teal-500 inline-block mr-1.5 animate-pulse" />
          Active peers online
        </div>
      </header>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, idx) => {
          const isMe = profile && msg.userId === profile.id
          return (
            <div key={idx} className={`flex gap-3 max-w-[85%] ${isMe ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className="h-8 w-8 rounded-full bg-slate-150 flex items-center justify-center text-slate-500 dark:bg-slate-800 flex-shrink-0">
                <UserIcon className="h-4 w-4" />
              </div>
              <div className={`p-3.5 rounded-2xl text-xs space-y-1 ${
                isMe
                  ? 'bg-teal-600 text-white rounded-tr-none'
                  : 'bg-slate-100 text-slate-800 rounded-tl-none dark:bg-slate-800 dark:text-slate-200'
              }`}>
                <strong className={`block text-[9px] uppercase tracking-wider font-bold ${
                  isMe ? 'text-teal-200' : 'text-teal-600 dark:text-teal-400'
                }`}>
                  {msg.userName}
                </strong>
                <p>{msg.text}</p>
                <span className="block text-[8px] text-right opacity-60">
                  {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Footer controls */}
      <footer className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/20">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            placeholder="Discuss assignment questions..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs outline-none focus:border-teal-500 dark:border-slate-800 dark:bg-slate-900"
            required
          />
          <button type="submit" className="rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-teal-500 flex items-center justify-center gap-1.5 transition-colors">
            <Send className="h-4 w-4" /> Send
          </button>
        </form>
      </footer>
    </div>
  )
}
