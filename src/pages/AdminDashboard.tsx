import React, { useState, useEffect } from 'react'
import { useDatabaseStore } from '@/store/useDatabaseStore'
import { useAuthStore } from '@/store/useAuthStore'
import { toast } from 'sonner'
import { ShieldCheck, UserCheck, Key, Megaphone, Users, RefreshCw, Send, CheckCircle, XCircle } from 'lucide-react'

export const AdminDashboard: React.FC = () => {
  const { profile } = useAuthStore()
  const {
    studentsList,
    allAccessRequests,
    allExamPermissions,
    studentAnnouncement,
    saveSiteDataKey,
    updateCourseAccessRequestStatus,
    grantExamRetakePermission,
    loadUserProgress,
    loadAllSiteData
  } = useDatabaseStore()

  // Form states
  const [annTitle, setAnnTitle] = useState('')
  const [annBody, setAnnBody] = useState('')
  const [annActive, setAnnActive] = useState(false)
  const [annSaving, setAnnSaving] = useState(false)

  // Retake grant states
  const [grantEmail, setGrantEmail] = useState('')
  const [grantExamId, setGrantExamId] = useState('')
  const [grantExamTitle, setGrantExamTitle] = useState('')
  const [grantNote, setGrantNote] = useState('')
  const [granting, setGranting] = useState(false)

  // Selected tab
  const [activeTab, setActiveTab] = useState<'requests' | 'retakes' | 'announcements' | 'students'>('requests')

  const refreshData = async () => {
    if (!profile) return
    toast.info('Reloading admin data metrics...')
    await loadAllSiteData()
    await loadUserProgress(profile.id, profile.email, true)
    toast.success('Admin data metrics synchronized.')
  }

  useEffect(() => {
    if (studentAnnouncement) {
      setAnnTitle(studentAnnouncement.title || '')
      setAnnBody(studentAnnouncement.body || '')
      setAnnActive(Boolean(studentAnnouncement.active))
    }
  }, [studentAnnouncement])

  const handleUpdateAnnouncements = async (e: React.FormEvent) => {
    e.preventDefault()
    setAnnSaving(true)
    try {
      const nextAnn = {
        title: annTitle.trim(),
        body: annBody.trim(),
        active: annActive,
        updatedAt: new Date().toISOString()
      }
      await saveSiteDataKey('studentAnnouncement', nextAnn)
      toast.success('Institute announcement updated successfully!')
    } catch (err: any) {
      toast.error(err.message || 'Failed to update announcements.')
    } finally {
      setAnnSaving(false)
    }
  }

  const handleGrantPermission = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile || !grantEmail || !grantExamId) return
    setGranting(true)

    // Generate random 16 character permission key matching original backend.js format
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let token = 'ASG-PERM-'
    for (let i = 0; i < 12; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    try {
      await grantExamRetakePermission({
        permissionKey: token,
        userId: 'admin-granted',
        name: 'Clearance retake user',
        email: grantEmail.trim().toLowerCase(),
        examType: 'quiz',
        examId: grantExamId.trim(),
        examTitle: grantExamTitle.trim() || 'Custom Exam',
        allowed: true,
        note: grantNote.trim() || 'Exam retake cleared.'
      }, profile.email)

      toast.success('Exam retake clearance granted successfully!')
      setGrantEmail('')
      setGrantExamId('')
      setGrantExamTitle('')
      setGrantNote('')
      
      // reload
      await loadUserProgress(profile.id, profile.email, true)
    } catch (err: any) {
      toast.error(err.message || 'Failed to grant retake permission.')
    } finally {
      setGranting(false)
    }
  }

  const handleUpdateRequestStatus = async (token: string, status: 'approved' | 'revoked') => {
    if (!profile) return
    try {
      await updateCourseAccessRequestStatus(token, status, profile.email)
      toast.success(`Access request ${status} successfully!`)
      await loadUserProgress(profile.id, profile.email, true)
    } catch (err: any) {
      toast.error(err.message || 'Failed to update request.')
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10 pb-20">
      
      {/* Header toolbar */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b pb-4 dark:border-slate-800">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight dark:text-white flex items-center gap-2">
            <ShieldCheck className="h-7 w-7 text-teal-600 dark:text-teal-400" /> Administrative Panel
          </h1>
          <p className="text-sm text-slate-500">Monitor course clearances, retake overrides, and announcements.</p>
        </div>

        <button
          onClick={refreshData}
          className="rounded-xl border border-slate-200 hover:border-slate-400 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm flex items-center gap-1.5 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-350 dark:hover:bg-slate-800 transition-colors"
        >
          <RefreshCw className="h-4.5 w-4.5" /> Sync Data
        </button>
      </section>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b pb-3 dark:border-slate-850">
        {[
          { id: 'requests', label: 'Access Requests', icon: UserCheck },
          { id: 'retakes', label: 'Exam Clearances', icon: Key },
          { id: 'announcements', label: 'Announcements', icon: Megaphone },
          { id: 'students', label: 'Student Directory', icon: Users }
        ].map(tab => {
          const Icon = tab.icon
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                active
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-850'
              }`}
            >
              <Icon className="h-4.5 w-4.5" /> {tab.label}
            </button>
          )
        })}
      </div>

      {/* Main tab sections */}
      <div className="min-h-96 rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm dark:border-slate-800/50 dark:bg-slate-900 glass-panel">
        
        {/* Course Requests approvals list */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Locked Course Access Requests</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b dark:border-slate-800 text-slate-400">
                    <th className="py-3 px-4 font-semibold">Student Name</th>
                    <th className="py-3 px-4 font-semibold">Email</th>
                    <th className="py-3 px-4 font-semibold">Course Title</th>
                    <th className="py-3 px-4 font-semibold">Note</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allAccessRequests.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400 italic">No access request files on record.</td>
                    </tr>
                  ) : (
                    allAccessRequests.map((req, idx) => (
                      <tr key={idx} className="border-b dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-850/20">
                        <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">{req.name}</td>
                        <td className="py-3 px-4 font-mono text-slate-500">{req.email}</td>
                        <td className="py-3 px-4 font-semibold text-teal-600 dark:text-teal-400">{req.courseTitle}</td>
                        <td className="py-3 px-4 text-slate-500 max-w-xs truncate">{req.note}</td>
                        <td className="py-3 px-4">
                          <span className={`font-bold px-1.5 py-0.5 rounded capitalize ${
                            req.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          {req.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleUpdateRequestStatus(req.requestToken, 'approved')}
                                className="p-1 text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded"
                                title="Approve Access"
                              >
                                <CheckCircle className="h-4.5 w-4.5" />
                              </button>
                              <button
                                onClick={() => handleUpdateRequestStatus(req.requestToken, 'revoked')}
                                className="p-1 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded"
                                title="Revoke Request"
                              >
                                <XCircle className="h-4.5 w-4.5" />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Retake clearances panel */}
        {activeTab === 'retakes' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Grant Permission Form */}
            <div className="md:col-span-1 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Grant retake clearance</h3>
              <form onSubmit={handleGrantPermission} className="space-y-3 bg-slate-50/50 p-4 rounded-xl border dark:bg-slate-850/30 dark:border-slate-800 space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500">Student Email</label>
                  <input
                    type="email"
                    required
                    placeholder="student@example.com"
                    value={grantEmail}
                    onChange={(e) => setGrantEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-teal-500 dark:border-slate-800 dark:bg-slate-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500">Exam ID (Slug)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. data-science-assessment"
                    value={grantExamId}
                    onChange={(e) => setGrantExamId(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-teal-500 dark:border-slate-800 dark:bg-slate-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500">Exam Title Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pandas Core Assessment"
                    value={grantExamTitle}
                    onChange={(e) => setGrantExamTitle(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-teal-500 dark:border-slate-800 dark:bg-slate-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500">Justification Note</label>
                  <input
                    type="text"
                    placeholder="e.g. Requested on Slack"
                    value={grantNote}
                    onChange={(e) => setGrantNote(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-teal-500 dark:border-slate-800 dark:bg-slate-900"
                  />
                </div>
                <button
                  type="submit"
                  disabled={granting}
                  className="w-full rounded-xl bg-teal-600 py-2 text-xs font-semibold text-white shadow hover:bg-teal-500 flex items-center justify-center gap-1"
                >
                  <Send className="h-3.5 w-3.5" /> Grant retake override
                </button>
              </form>
            </div>

            {/* Clearances audit grid */}
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Clearances Log</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b dark:border-slate-800 text-slate-400">
                      <th className="py-2.5 px-3">Email</th>
                      <th className="py-2.5 px-3">Exam ID</th>
                      <th className="py-2.5 px-3">Clearance Key</th>
                      <th className="py-2.5 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allExamPermissions.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-400 italic">No retake permissions granted.</td>
                      </tr>
                    ) : (
                      allExamPermissions.map((perm, idx) => (
                        <tr key={idx} className="border-b dark:border-slate-800">
                          <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">{perm.email}</td>
                          <td className="py-2.5 px-3 font-mono text-indigo-600 dark:text-indigo-400">{perm.examTitle}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-500 select-all">{perm.permissionKey}</td>
                          <td className="py-2.5 px-3 text-right">
                            <span className={`font-bold px-1.5 py-0.5 rounded ${
                              perm.allowed ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-650'
                            }`}>
                              {perm.allowed ? 'Approved' : 'Used'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Announcements editor */}
        {activeTab === 'announcements' && (
          <form onSubmit={handleUpdateAnnouncements} className="space-y-4 max-w-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Institute Announcements Banner</h3>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Banner Title</label>
                <input
                  type="text"
                  placeholder="Maintenance or Exam schedules announcement title..."
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs outline-none focus:border-teal-500 dark:border-slate-800 dark:bg-slate-850"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Detailed Message Body</label>
                <textarea
                  rows={4}
                  placeholder="Write clear instructions for students..."
                  value={annBody}
                  onChange={(e) => setAnnBody(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs outline-none focus:border-teal-500 dark:border-slate-800 dark:bg-slate-850"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="annActive"
                  checked={annActive}
                  onChange={(e) => setAnnActive(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="annActive" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Activate Announcement Banner for all Students
                </label>
              </div>
              <button
                type="submit"
                disabled={annSaving}
                className="rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-semibold text-white shadow hover:bg-teal-500 disabled:opacity-50"
              >
                Save Announcement
              </button>
            </div>
          </form>
        )}

        {/* Students list */}
        {activeTab === 'students' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Student Directory List</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b dark:border-slate-800 text-slate-400">
                    <th className="py-3 px-4 font-semibold">Name</th>
                    <th className="py-3 px-4 font-semibold">Email</th>
                    <th className="py-3 px-4 font-semibold">Role</th>
                    <th className="py-3 px-4 font-semibold">Registration Date</th>
                  </tr>
                </thead>
                <tbody>
                  {studentsList.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400 italic">No student profiles synchronized.</td>
                    </tr>
                  ) : (
                    studentsList.map((student, idx) => (
                      <tr key={idx} className="border-b dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-850/20">
                        <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">{student.name}</td>
                        <td className="py-3 px-4 font-mono text-slate-500">{student.email}</td>
                        <td className="py-3 px-4 capitalize font-semibold">{student.role}</td>
                        <td className="py-3 px-4 text-slate-400">
                          {new Date(student.joinDate || '').toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
