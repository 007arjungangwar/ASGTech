import React, { useEffect } from 'react'
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { AuthGuard } from '@/components/AuthGuard'
import { AdminGuard } from '@/components/AdminGuard'

// Layouts
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { PublicLayout } from '@/layouts/PublicLayout'

// Public Pages
import { Home } from '@/pages/Home'
import { Login } from '@/pages/Login'
import { About } from '@/pages/About'
import { Blog } from '@/pages/Blog'
import { Projects } from '@/pages/Projects'
import { CertificateVerify } from '@/pages/CertificateVerify'

// Student Pages
import { StudentDashboard } from '@/pages/StudentDashboard'
import { Courses } from '@/pages/Courses'
import { CourseDetail } from '@/pages/CourseDetail'
import { LessonWorkspace } from '@/pages/LessonWorkspace'
import { Roadmap } from '@/pages/Roadmap'
import { Videos } from '@/pages/Videos'
import { Resources } from '@/pages/Resources'
import { Quiz } from '@/pages/Quiz'
import { CodingPractice } from '@/pages/CodingPractice'
import { ExamCenter } from '@/pages/ExamCenter'
import { ExamWorkspace } from '@/pages/ExamWorkspace'
import { Tracker } from '@/pages/Tracker'
import { Certificate } from '@/pages/Certificate'
import { AIAssistant } from '@/pages/AIAssistant'
import { Questions } from '@/pages/Questions'
import { Forum } from '@/pages/Forum'
import { Chat } from '@/pages/Chat'
import { Profile } from '@/pages/Profile'

// Admin Pages
import { AdminDashboard } from '@/pages/AdminDashboard'
import { AdminGuide } from '@/pages/AdminGuide'

const App: React.FC = () => {
  const { initialize } = useAuthStore()

  useEffect(() => {
    const cleanup = initialize()
    return cleanup
  }, [initialize])

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
          <Route path="/blog" element={<PublicLayout><Blog /></PublicLayout>} />
          <Route path="/projects" element={<PublicLayout><Projects /></PublicLayout>} />
          <Route path="/certificate-verify" element={<PublicLayout><CertificateVerify /></PublicLayout>} />
          <Route path="/login" element={<Login />} />

          {/* Student Protected Routes */}
          <Route path="/dashboard" element={<AuthGuard><DashboardLayout><StudentDashboard /></DashboardLayout></AuthGuard>} />
          <Route path="/courses" element={<AuthGuard><DashboardLayout><Courses /></DashboardLayout></AuthGuard>} />
          <Route path="/courses/:courseId" element={<AuthGuard><DashboardLayout><CourseDetail /></DashboardLayout></AuthGuard>} />
          <Route path="/courses/:courseId/topics/:topicId" element={<AuthGuard><DashboardLayout><LessonWorkspace /></DashboardLayout></AuthGuard>} />
          <Route path="/roadmap" element={<AuthGuard><DashboardLayout><Roadmap /></DashboardLayout></AuthGuard>} />
          <Route path="/videos" element={<AuthGuard><DashboardLayout><Videos /></DashboardLayout></AuthGuard>} />
          <Route path="/resources" element={<AuthGuard><DashboardLayout><Resources /></DashboardLayout></AuthGuard>} />
          <Route path="/quiz" element={<AuthGuard><DashboardLayout><Quiz /></DashboardLayout></AuthGuard>} />
          <Route path="/coding-practice" element={<AuthGuard><DashboardLayout><CodingPractice /></DashboardLayout></AuthGuard>} />
          <Route path="/exam-center" element={<AuthGuard><DashboardLayout><ExamCenter /></DashboardLayout></AuthGuard>} />
          <Route path="/tracker" element={<AuthGuard><DashboardLayout><Tracker /></DashboardLayout></AuthGuard>} />
          <Route path="/certificate" element={<AuthGuard><DashboardLayout><Certificate /></DashboardLayout></AuthGuard>} />
          <Route path="/assistant" element={<AuthGuard><DashboardLayout><AIAssistant /></DashboardLayout></AuthGuard>} />
          <Route path="/questions" element={<AuthGuard><DashboardLayout><Questions /></DashboardLayout></AuthGuard>} />
          <Route path="/forum" element={<AuthGuard><DashboardLayout><Forum /></DashboardLayout></AuthGuard>} />
          <Route path="/chat" element={<AuthGuard><DashboardLayout><Chat /></DashboardLayout></AuthGuard>} />
          <Route path="/profile" element={<AuthGuard><DashboardLayout><Profile /></DashboardLayout></AuthGuard>} />

          {/* Timed Focus Proctor Assessment Area */}
          <Route path="/quiz-exam/:quizId" element={<AuthGuard><ExamWorkspace examType="quiz" /></AuthGuard>} />
          <Route path="/coding-exam/:topic" element={<AuthGuard><ExamWorkspace examType="coding-exam" /></AuthGuard>} />

          {/* Admin Protected Routes */}
          <Route path="/admin" element={<AuthGuard><AdminGuard><DashboardLayout><AdminDashboard /></DashboardLayout></AdminGuard></AuthGuard>} />
          <Route path="/admin/guide" element={<AuthGuard><AdminGuard><DashboardLayout><AdminGuide /></DashboardLayout></AdminGuard></AuthGuard>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
