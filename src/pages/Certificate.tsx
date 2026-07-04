import React, { useState, useEffect, useRef } from 'react'
import { useDatabaseStore } from '@/store/useDatabaseStore'
import { useAuthStore } from '@/store/useAuthStore'
import { asgBuildCertificateVerificationUrl } from '@/utils/certificate'
import { Award, Download, Lock, AlertCircle, RefreshCw } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { toast } from 'sonner'

export const Certificate: React.FC = () => {
  const { quizAttempts, examAttempts, courses, loadAllSiteData } = useDatabaseStore()
  const { profile } = useAuthStore()

  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [studentName, setStudentName] = useState('')
  const [isNameLocked, setIsNameLocked] = useState(false)
  const [certId, setCertId] = useState('')
  const [issueDate, setIssueDate] = useState('')
  const [rendering, setRendering] = useState(false)

  const certRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadAllSiteData()
    if (profile) {
      setStudentName(profile.name)
    }
  }, [profile])

  // Get eligible completed courses: Course is eligible if exam attempts score >= 70% or quiz attempts best score >= 70%
  const eligibleCourses = courses.filter(course => {
    // If course is free or has a quiz attempt >= 70%
    const bestQuiz = Math.max(0, ...quizAttempts.filter(a => a.quizId.includes(course.id)).map(a => a.percentage))
    const bestExam = Math.max(0, ...examAttempts.filter(a => a.examId.includes(course.id)).map(a => a.score))
    return bestQuiz >= 70 || bestExam >= 70
  })

  // Set default selected course
  useEffect(() => {
    if (eligibleCourses.length > 0 && !selectedCourseId) {
      setSelectedCourseId(eligibleCourses[0].id)
    }
  }, [eligibleCourses, selectedCourseId])

  // Generate unique certificate ID and date based on selection
  useEffect(() => {
    if (!profile || !selectedCourseId) return

    // Derive deterministic certificate ID matching user/course context
    const certKey = `cert_${profile.id}_${selectedCourseId}`
    let savedId = localStorage.getItem(`${certKey}_id`)
    let savedDate = localStorage.getItem(`${certKey}_date`)

    if (!savedId) {
      savedId = `ASG-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`
      localStorage.setItem(`${certKey}_id`, savedId)
    }
    if (!savedDate) {
      savedDate = new Date().toISOString()
      localStorage.setItem(`${certKey}_date`, savedDate)
    }

    setCertId(savedId)
    setIssueDate(savedDate)
  }, [profile, selectedCourseId])

  const selectedCourse = courses.find(c => c.id === selectedCourseId)

  // QR verification payload URL
  const verificationUrl = selectedCourse
    ? asgBuildCertificateVerificationUrl({
        certificateId: certId,
        name: studentName.trim() || 'ASG Tech Student',
        course: selectedCourse.title,
        issued: issueDate
      })
    : ''

  const handleDownloadPDF = async () => {
    if (!certRef.current) return
    setRendering(true)
    toast.info('Generating high-resolution credential document...')

    try {
      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#f8fafc'
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      })

      const imgWidth = 297 // A4 size landscape
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
      pdf.save(`ASG-Certificate-${certId}.pdf`)
      toast.success('Certificate downloaded successfully!')
    } catch (err) {
      console.error(err)
      toast.error('Failed to generate PDF document.')
    } finally {
      setRendering(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10 pb-20">
      <div className="space-y-2 border-b pb-4 dark:border-slate-800">
        <h1 className="text-3xl font-extrabold tracking-tight dark:text-white">Credentials Portal</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Generate, preview, and print verifiable certificates for completed course programs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Certificate Configurations panel */}
        <div className="space-y-6">
          <section className="p-6 rounded-2xl border border-slate-200/50 bg-white dark:border-slate-800/50 dark:bg-slate-900 glass-panel space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Certificate settings</h3>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Target Course Track</label>
                {eligibleCourses.length === 0 ? (
                  <p className="text-xs text-rose-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-4 w-4" /> No courses eligible. Pass an exam with &ge; 70% first.
                  </p>
                ) : (
                  <select
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-teal-500 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-300"
                  >
                    {eligibleCourses.map((c, idx) => (
                      <option key={idx} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-500">Student Name</label>
                  {isNameLocked && (
                    <span className="text-[10px] text-teal-600 dark:text-teal-400 inline-flex items-center gap-1 font-semibold">
                      <Lock className="h-3 w-3" /> Locked
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => !isNameLocked && setStudentName(e.target.value)}
                  readOnly={isNameLocked}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-semibold outline-none focus:border-teal-500 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-300 read-only:bg-slate-100 dark:read-only:bg-slate-800"
                  placeholder="Student Name on certificate"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setIsNameLocked(!isNameLocked)}
                  className="w-full py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                >
                  {isNameLocked ? 'Unlock Name Editor' : 'Lock Name on Credential'}
                </button>
              </div>
            </div>
          </section>

          {eligibleCourses.length > 0 && (
            <button
              onClick={handleDownloadPDF}
              disabled={rendering}
              className="w-full rounded-xl bg-teal-600 hover:bg-teal-500 py-3 text-xs font-bold text-white shadow-lg flex items-center justify-center gap-2"
            >
              {rendering ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Download Certificate PDF
            </button>
          )}
        </div>

        {/* Certificate visual canvas drawer */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-base font-bold dark:text-white">Live Certificate Preview</h2>

          {eligibleCourses.length === 0 ? (
            <div className="text-center py-20 text-slate-400 space-y-3 rounded-2xl border border-dashed dark:border-slate-800">
              <Award className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-700" />
              <h3 className="text-sm font-semibold">No credentials generated</h3>
              <p className="text-xs max-w-xs mx-auto">Complete a course track by passing its assessments with a score of 70% or more.</p>
            </div>
          ) : (
            <div className="overflow-x-auto p-4 bg-slate-100 dark:bg-slate-950 rounded-2xl border dark:border-slate-800">
              {/* Actual HTML node for printing */}
              <div
                ref={certRef}
                className="w-[842px] h-[595px] bg-slate-50 p-[30px] border-[12px] border-double border-teal-800 rounded-xl relative shadow-inner mx-auto text-slate-900 select-none"
              >
                {/* Certificate inner boundary */}
                <div className="h-full border border-teal-700/20 p-[20px] flex flex-col justify-between items-center text-center">
                  
                  {/* Top line with Logo and verify metrics */}
                  <div className="w-full flex justify-between items-center border-b border-teal-800/10 pb-4">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 bg-teal-800 text-white rounded font-extrabold flex items-center justify-center text-sm">
                        ASG
                      </div>
                      <div className="text-left leading-none">
                        <strong className="block text-xs font-extrabold text-slate-800">ASG Tech</strong>
                        <span className="text-[8px] uppercase tracking-wider font-bold text-slate-400">Institute of Technology</span>
                      </div>
                    </div>
                    <div className="text-right leading-none">
                      <strong className="block text-xs font-bold text-slate-800">{certId}</strong>
                      <span className="text-[8px] uppercase tracking-wider font-bold text-slate-400">Credential ID</span>
                    </div>
                  </div>

                  {/* Main credential text body */}
                  <div className="space-y-4">
                    <span className="text-teal-700 font-serif italic text-base block">Certificate of Completion</span>
                    <h2 className="text-4xl font-extrabold tracking-tight text-slate-800 capitalize font-serif my-2">
                      {studentName || 'ASG Tech Student'}
                    </h2>
                    <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
                      has successfully fulfilled the curriculum requirements and demonstrated mastery of concepts in the course pathway
                    </p>
                    <h3 className="text-xl font-bold text-teal-800 font-sans tracking-tight">
                      {selectedCourse?.title || 'Data Science & Machine Learning'}
                    </h3>
                  </div>

                  {/* Footer with Signatures and QR */}
                  <div className="w-full flex justify-between items-end border-t border-teal-800/10 pt-4 mt-4">
                    <div className="text-left space-y-1">
                      <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block">Issued on</span>
                      <strong className="text-[10px] font-bold text-slate-800">
                        {new Date(issueDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                      </strong>
                    </div>

                    {/* QR Code */}
                    <div className="flex flex-col items-center gap-1">
                      {verificationUrl && (
                        <div className="p-1 bg-white border border-slate-100 rounded">
                          <QRCodeSVG value={verificationUrl} size={50} />
                        </div>
                      )}
                      <span className="text-[8px] uppercase tracking-wider font-bold text-slate-400 block">Verify QR</span>
                    </div>

                    <div className="text-right space-y-1">
                      <div className="font-serif italic text-teal-800 text-xs">Arjun Singh Gangwar</div>
                      <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block">Director signature</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
