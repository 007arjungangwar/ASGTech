import React, { useState, useEffect, useRef } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Settings, User as UserIcon, Bot, Loader2, Info } from 'lucide-react'
import { toast } from 'sonner'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export const AIAssistant: React.FC = () => {
  const { profile } = useAuthStore()

  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: `Hello! I am your AI Tutor. Ask me any Python syntax, data science logic, or debugging queries.`, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ])
  const [inputText, setInputText] = useState('')
  const [sending, setSending] = useState(false)
  const [showConfig, setShowConfig] = useState(false)
  
  // Custom webhook URL (defaults to n8n triggers)
  const [webhookUrl, setWebhookUrl] = useState(() => {
    return localStorage.getItem('asg_ai_webhook') || 'https://primary-production.up.railway.app/webhook/asg-tech-ai-tutor'
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim() || !profile) return

    const userMessage: Message = {
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setSending(true)

    try {
      // Trigger webhook call
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          student: {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role
          },
          context: {
            page: 'AI Tutor Assistant',
            timestamp: new Date().toISOString()
          }
        })
      })

      if (!response.ok) throw new Error('Webhook responded with an error.')

      const data = await response.json()
      const answer = data.output || data.response || data.text || 'I received your query but did not get a structured response back from the webhook.'
      
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ])
    } catch (err: any) {
      console.warn('AI Webhook call failed, returning offline mock fallback:', err)
      // Provide robust fallback answer for student
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: `AI Webhook is unreachable. Here is a simulated tutor response: \n\nTo solve this, verify your syntax logic or review the official courses. If you are debugging code, try running it inside the **Coding Practice compiler sandbox**.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ])
      }, 800)
    } finally {
      setSending(false)
    }
  }

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem('asg_ai_webhook', webhookUrl)
    toast.success('AI Tutor webhook updated successfully!')
    setShowConfig(false)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] max-w-5xl mx-auto border border-slate-200/50 rounded-2xl bg-white shadow-sm overflow-hidden dark:border-slate-800/50 dark:bg-slate-900 glass-panel">
      {/* Header bar */}
      <header className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center select-none bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-teal-600 rounded-xl flex items-center justify-center text-white dark:bg-teal-500 shadow-sm">
            <Bot className="h-4.5 w-4.5" />
          </div>
          <div>
            <h2 className="text-sm font-bold dark:text-white">AI Tutor Assistant</h2>
            <span className="text-[10px] text-slate-400 font-medium">Powered by customized n8n workflows</span>
          </div>
        </div>

        <button
          onClick={() => setShowConfig(!showConfig)}
          className="p-2 rounded-lg border border-slate-200 hover:border-slate-400 dark:border-slate-800 dark:hover:border-slate-700 text-slate-500 transition-colors"
          aria-label="Settings configuration"
        >
          <Settings className="h-4.5 w-4.5" />
        </button>
      </header>

      {/* Settings overlay drawer */}
      <AnimatePresence>
        {showConfig && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-5 border-b border-slate-200/50 bg-slate-50 dark:bg-slate-850 dark:border-slate-800/50 z-30"
          >
            <form onSubmit={handleSaveConfig} className="space-y-4 max-w-lg">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="h-4 w-4 text-teal-600 dark:text-teal-400" /> Webhook Integrations
              </h4>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 block">n8n Custom Webhook Endpoint URL</label>
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-teal-500 dark:border-slate-800 dark:bg-slate-900"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-500">
                  Save settings
                </button>
                <button type="button" onClick={() => setShowConfig(false)} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300">
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user'
          return (
            <div key={idx} className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 text-white ${
                isUser ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-teal-600 dark:bg-teal-500'
              }`}>
                {isUser ? <UserIcon className="h-4.5 w-4.5" /> : <Bot className="h-4.5 w-4.5" />}
              </div>
              <div className={`p-4 rounded-2xl text-xs space-y-1.5 leading-relaxed ${
                isUser 
                  ? 'bg-slate-100 text-slate-800 rounded-tr-none dark:bg-slate-805 dark:text-slate-200' 
                  : 'bg-teal-50/30 text-slate-800 rounded-tl-none border border-teal-100/50 dark:bg-slate-850/30 dark:border-slate-800/40 dark:text-slate-200'
              }`}>
                <p className="whitespace-pre-line">{msg.content}</p>
                <span className="block text-[8px] text-slate-400 text-right font-medium select-none">{msg.timestamp}</span>
              </div>
            </div>
          )
        })}
        {sending && (
          <div className="flex gap-3 max-w-[85%]">
            <div className="h-8 w-8 rounded-full flex items-center justify-center bg-teal-600 text-white dark:bg-teal-500">
              <Bot className="h-4.5 w-4.5 animate-pulse" />
            </div>
            <div className="p-4 rounded-2xl bg-teal-50/20 text-xs border border-teal-100/30 dark:bg-slate-850/20 dark:border-slate-800/30 flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-teal-600 dark:text-teal-400" />
              <span className="text-slate-400 italic">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input controls footer */}
      <footer className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={sending}
            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs outline-none focus:border-teal-500 dark:border-slate-800 dark:bg-slate-900"
            required
          />
          <button
            type="submit"
            disabled={sending}
            className="rounded-xl bg-teal-600 hover:bg-teal-500 px-4 py-2.5 text-xs font-semibold text-white shadow-sm flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 dark:bg-teal-500 dark:hover:bg-teal-400"
          >
            <Send className="h-4 w-4" /> Send
          </button>
        </form>
      </footer>
    </div>
  )
}
