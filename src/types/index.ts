export interface Profile {
  id: string
  name: string
  email: string
  role: 'student' | 'admin'
  join_date: string
  updated_at: string
}

export interface User {
  id: string
  name: string
  email: string
  role: 'student' | 'admin'
  joinDate: string
  provider: string
}

export interface Topic {
  id: string
  title: string
  content: string
  contentType: 'html' | 'pdf'
  contentFileName?: string
  contentDataUrl?: string
  contentUrl?: string
  contentStoragePath?: string
  quizHtml?: string
  quizFileName?: string
  quizRenderMode?: 'auto' | 'custom'
  videoUrl?: string
  order: number
  status: 'active' | 'draft'
  updatedAt?: string
}

export interface Course {
  id: string
  title: string
  summary: string
  icon: string
  price: string
  status: 'active' | 'draft'
  welcome: string
  cheatSheet: string
  topics: Topic[]
  order?: number
  updatedAt?: string
}

export interface QuizCatalog {
  id: string
  title: string
  topic: string
  description: string
  timeLimitMinutes: number
  order: number
  status: 'active' | 'draft'
  timeLimit: number
  summary?: string
  isExam?: boolean
  mode?: string
}

export interface QuizQuestionOption {
  id: string
  text: string
}

export interface QuizQuestion {
  id: string
  quizId: string
  title: string
  topic: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  prompt: string
  options: QuizQuestionOption[]
  correctOption: string
  explanation: string
  status: 'active' | 'draft'
  order: number
  updatedAt?: string
}

export interface CodingChallengeTestCase {
  args: any[]
  expected: any
}

export interface CodingChallenge {
  id: string
  title: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  topic: string
  prompt: string
  starterCode: string
  tests: CodingChallengeTestCase[]
  status: 'active' | 'draft'
  order: number
  examTopic?: string
  courseId?: string
  courseTitle?: string
  topicId?: string
  topicTitle?: string
}

export interface BlogPost {
  id: string
  title: string
  category: string
  excerpt: string
  body: string
  author: string
  readTime: string
  url: string
  featured: boolean
  status: 'active' | 'draft'
  order: number
  updatedAt?: string
}

export interface ProjectShowcase {
  id: string
  title: string
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  summary: string
  skills: string[]
  outcome: string
  url: string
  featured: boolean
  status: 'active' | 'draft'
  order: number
  updatedAt?: string
}

export interface VideoPlaylist {
  id: string
  title: string
  description: string
  level: string
  status: 'active' | 'draft'
  order: number
}

export interface VideoLibrary {
  id: string
  playlistId: string
  title: string
  category: string
  level: string
  duration: string
  description: string
  url: string
  status: 'active' | 'draft'
  order: number
  videoUrl?: string
  playlistTitle?: string
  summary?: string
  uploadedAt?: string
}

export interface RoadmapItem {
  id: string
  stage: string
  title: string
  duration: string
  focus: string
  outcomes: string[]
  videoUrl: string
  resourceUrl: string
  status: 'active' | 'draft'
  order: number
  completed?: boolean
  summary?: string
  skills?: string[]
  courseTitle?: string
  courseId?: string
}

export interface ResourceLibrary {
  id: string
  title: string
  category: string
  format: string
  description: string
  url: string
  actionLabel: string
  status: 'active' | 'draft'
  order: number
  fileSize?: string
  summary?: string
  fileUrl?: string
}

export interface Announcement {
  title: string
  body: string
  active: boolean
  updatedAt?: string
}

export interface QuizAttemptAnswer {
  questionId: string
  prompt: string
  selectedOption: string
  selectedText: string
  correctOption: string
  correctText: string
  explanation: string
  isCorrect: boolean
}

export interface QuizAttempt {
  quizId: string
  quizTitle: string
  score: number
  total: number
  percentage: number
  answers: QuizAttemptAnswer[]
  proctorReason?: string
  autoSubmitted?: boolean
  date?: string
  submittedAt: string
}

export interface CodingSubmissionResult {
  index: number
  passed: boolean
  args: any[]
  expected: any
  got: any
  stdout: string
}

export interface CodingSubmission {
  challengeId: string
  challengeTitle: string
  courseId?: string
  courseTitle?: string
  topicId?: string
  topicTitle?: string
  passed: number
  total: number
  percentage: number
  code: string
  results: CodingSubmissionResult[]
  stdout: string
  submittedAt?: string
}

export interface ExamAttempt {
  examType: 'quiz' | 'coding-exam'
  examId: string
  examTitle: string
  score: number
  total: number
  percentage: number
  status: string
  reason: string
  details: {
    answers?: QuizAttemptAnswer[]
    code?: string
    results?: CodingSubmissionResult[]
    stdout?: string
  }
  date?: string
  submittedAt: string
  quizTitle?: string
}

export interface CourseAccessRequest {
  id: string
  requestToken: string
  userId: string
  name: string
  email: string
  courseId: string
  courseTitle: string
  price: string
  note: string
  status: 'pending' | 'approved' | 'revoked'
  requestedAt: string
  updatedAt: string
  updatedBy?: {
    email: string
    role: string
  }
}

export interface ExamRetakePermission {
  id: string
  permissionKey: string
  userId: string
  name: string
  email: string
  examType: 'quiz' | 'coding-exam'
  examId: string
  examTitle: string
  allowed: boolean
  note: string
  allowedAt?: string
  usedAt?: string
  updatedAt: string
  updatedBy?: {
    uid: string
    email: string
    role: string
  }
}
