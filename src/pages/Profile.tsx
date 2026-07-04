import React, { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { useTheme } from '@/contexts/ThemeContext'
import { User as UserIcon, Lock, Settings, Moon, Sun, Laptop } from 'lucide-react'
import { toast } from 'sonner'

export const Profile: React.FC = () => {
  const { profile, updatePassword } = useAuthStore()
  const { theme, setTheme } = useTheme()

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [updating, setUpdating] = useState(false)

  // AI webhook settings
  const [webhookUrl, setWebhookUrl] = useState('')

  useEffect(() => {
    const savedWebhook = localStorage.getItem('asg_ai_webhook') || 'https://primary-production.up.railway.app/webhook/asg-tech-ai-tutor'
    setWebhookUrl(savedWebhook)
  }, [profile])

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPassword) return
    if (newPassword !== confirmPassword) {
      return toast.error('Passwords do not match.')
    }

    setUpdating(true)
    try {
      await updatePassword(newPassword)
      toast.success('Account password updated successfully!')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      toast.error(err.message || 'Failed to update password.')
    } finally {
      setUpdating(false)
    }
  }

  const handleSaveAIConfig = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem('asg_ai_webhook', webhookUrl)
    toast.success('AI webhook target updated successfully.')
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-10 pb-20">
      <div className="space-y-2 border-b pb-4 dark:border-slate-800">
        <h1 className="text-3xl font-extrabold tracking-tight dark:text-white">Account Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Configure your student preferences and API configurations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Profile Card and Change Password */}
        <div className="space-y-8">
          <section className="p-6 rounded-2xl border border-slate-200/50 bg-white dark:border-slate-800/50 dark:bg-slate-900 glass-panel space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <UserIcon className="h-4.5 w-4.5" /> Identity Details
            </h3>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 font-semibold block">Full Name</span>
                <strong className="text-slate-800 dark:text-slate-200 mt-0.5 block">{profile?.name}</strong>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block">Email Address</span>
                <strong className="text-slate-800 dark:text-slate-200 mt-0.5 block">{profile?.email}</strong>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block">Joined Date</span>
                <strong className="text-slate-800 dark:text-slate-200 mt-0.5 block">
                  {new Date(profile?.join_date || '').toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </strong>
              </div>
            </div>
          </section>

          <section className="p-6 rounded-2xl border border-slate-200/50 bg-white dark:border-slate-800/50 dark:bg-slate-900 glass-panel space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Lock className="h-4.5 w-4.5" /> Change Password
            </h3>
            <form onSubmit={handleUpdatePassword} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs outline-none focus:border-teal-500 dark:border-slate-800 dark:bg-slate-850"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs outline-none focus:border-teal-500 dark:border-slate-800 dark:bg-slate-850"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={updating}
                className="w-full rounded-xl bg-teal-600 py-2.5 text-xs font-semibold text-white shadow hover:bg-teal-500 disabled:opacity-50"
              >
                Update Password
              </button>
            </form>
          </section>
        </div>

        {/* Configurations Settings & Webhook */}
        <div className="space-y-8">
          <section className="p-6 rounded-2xl border border-slate-200/50 bg-white dark:border-slate-800/50 dark:bg-slate-900 glass-panel space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Settings className="h-4.5 w-4.5" /> Workspace Display
            </h3>
            
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-500 block">Workspace Appearance Theme</span>
              <div className="flex gap-2">
                {[
                  { id: 'light', label: 'Light', icon: Sun },
                  { id: 'dark', label: 'Dark', icon: Moon },
                  { id: 'system', label: 'System', icon: Laptop }
                ].map(opt => {
                  const Icon = opt.icon
                  const active = theme === opt.id
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setTheme(opt.id as any)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                        active
                          ? 'border-teal-500 bg-teal-50/30 text-teal-700 dark:bg-teal-950/20 dark:text-teal-400'
                          : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-850 text-slate-500'
                      }`}
                    >
                      <Icon className="h-4 w-4" /> {opt.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </section>

          <section className="p-6 rounded-2xl border border-slate-200/50 bg-white dark:border-slate-800/50 dark:bg-slate-900 glass-panel space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Settings className="h-4.5 w-4.5" /> AI Webhook Configurations
            </h3>
            <form onSubmit={handleSaveAIConfig} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500">n8n Custom Webhook Endpoint URL</label>
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs outline-none focus:border-teal-500 dark:border-slate-800 dark:bg-slate-850"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-teal-600 py-2.5 text-xs font-semibold text-white shadow hover:bg-teal-500"
              >
                Save configurations URL
              </button>
            </form>
          </section>
        </div>

      </div>
    </div>
  )
}
