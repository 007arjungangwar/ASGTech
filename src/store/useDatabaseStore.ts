import { create } from 'zustand'
import { supabase } from '@/lib/supabaseClient'
import { ASG_PUBLISHED_LEARNING_DATA } from '@/lib/publishedFallbackData'
import {
  Course,
  QuizCatalog,
  QuizQuestion,
  CodingChallenge,
  BlogPost,
  ProjectShowcase,
  VideoPlaylist,
  VideoLibrary,
  RoadmapItem,
  ResourceLibrary,
  Announcement,
  QuizAttempt,
  CodingSubmission,
  ExamAttempt,
  CourseAccessRequest,
  ExamRetakePermission,
  User
} from '@/types'

interface DatabaseState {
  // Site Data Content
  courses: Course[]
  quizCatalog: QuizCatalog[]
  quizQuestions: QuizQuestion[]
  codingChallenges: CodingChallenge[]
  blogPosts: BlogPost[]
  projectShowcase: ProjectShowcase[]
  videoPlaylists: VideoPlaylist[]
  videoLibrary: VideoLibrary[]
  roadmapItems: RoadmapItem[]
  resourceLibrary: ResourceLibrary[]
  studentAnnouncement: Announcement | null
  
  // Loading and Sync States
  loading: boolean
  syncing: boolean
  
  // Student Progress (Filtered for current user, unless admin)
  quizAttempts: QuizAttempt[]
  codingSubmissions: CodingSubmission[]
  examAttempts: ExamAttempt[]
  courseAccessRequests: CourseAccessRequest[]
  examRetakePermissions: ExamRetakePermission[]
  
  // Admin monitoring lists
  studentsList: User[]
  allAccessRequests: CourseAccessRequest[]
  allExamPermissions: ExamRetakePermission[]
  allAttempts: { userEmail: string; userName: string; attempts: ExamAttempt[] }[]
  
  // Database Operations
  loadAllSiteData: () => Promise<void>
  saveSiteDataKey: (key: string, value: any) => Promise<void>
  loadUserProgress: (userId: string, userEmail: string, isAdmin: boolean) => Promise<void>
  
  // Quizzes & Exams Attempts saving
  saveQuizAttempt: (userId: string, attempt: QuizAttempt) => Promise<void>
  saveCodingSubmission: (userId: string, submission: CodingSubmission) => Promise<void>
  saveExamAttempt: (userId: string, attempt: ExamAttempt) => Promise<void>
  
  // Course Access requests
  createCourseAccessRequest: (request: Omit<CourseAccessRequest, 'id' | 'requestedAt' | 'updatedAt'>) => Promise<void>
  updateCourseAccessRequestStatus: (requestToken: string, status: 'approved' | 'revoked', adminEmail: string) => Promise<void>
  
  // Exam Retake permissions
  grantExamRetakePermission: (permission: Omit<ExamRetakePermission, 'id' | 'updatedAt'>, adminEmail: string) => Promise<void>
  consumeExamRetakePermission: (userId: string, userEmail: string, examType: 'quiz' | 'coding-exam', examId: string) => Promise<boolean>
  
  // Storage upload
  uploadFile: (file: File, path: string) => Promise<string>
  
  // Realtime subscription setup
  subscribeToRealtime: (onUpdate: (key: string, value: any) => void) => () => void
}

const STORAGE_KEYS_MAP: Record<string, string> = {
  courses: 'asgCourses',
  quizCatalog: 'asgQuizCatalog',
  quizQuestions: 'asgQuizQuestions',
  codingChallenges: 'asgCodingChallenges',
  blogPosts: 'asgBlogPosts',
  projectShowcase: 'asgProjectShowcase',
  videoPlaylists: 'asgVideoPlaylists',
  roadmapItems: 'asgRoadmapItems',
  videoLibrary: 'asgVideoLibrary',
  resourceLibrary: 'asgResourceLibrary',
  studentAnnouncement: 'studentAnnouncement'
}

export const useDatabaseStore = create<DatabaseState>((set, get) => ({
  courses: [],
  quizCatalog: [],
  quizQuestions: [],
  codingChallenges: [],
  blogPosts: [],
  projectShowcase: [],
  videoPlaylists: [],
  videoLibrary: [],
  roadmapItems: [],
  resourceLibrary: [],
  studentAnnouncement: null,
  
  loading: false,
  syncing: false,
  
  quizAttempts: [],
  codingSubmissions: [],
  examAttempts: [],
  courseAccessRequests: [],
  examRetakePermissions: [],
  
  studentsList: [],
  allAccessRequests: [],
  allExamPermissions: [],
  allAttempts: [],

  loadAllSiteData: async () => {
    set({ loading: true })
    try {
      // Query site_data
      const { data: rows, error } = await supabase
        .from('site_data')
        .select('key, value')

      if (error) throw error

      const rawData = rows || []
      const dbMap = new Map(rawData.map(r => [r.key, r.value]))

      const loadedState: Partial<DatabaseState> = {}

      // Map keys and handle fallback
      for (const [stateKey, dbKey] of Object.entries(STORAGE_KEYS_MAP)) {
        let value = dbMap.get(dbKey)
        
        // Fallback to static seed data if database is empty/null
        if (value === undefined || value === null) {
          const fallbackData = ASG_PUBLISHED_LEARNING_DATA?.data?.[stateKey] || []
          value = fallbackData
          
          // Seed back to supabase in background if they are currently logged in as admin
          // (Wait, we can't trigger seed write automatically without permission or check if session is admin,
          // so we just load locally. If they write later, it will seed.)
        }

        // Parse list formats
        if (stateKey === 'studentAnnouncement') {
          loadedState.studentAnnouncement = value as Announcement
        } else {
          // Ensure it is an array
          (loadedState as any)[stateKey] = Array.isArray(value) ? value : []
        }
      }

      set({ ...loadedState, loading: false })
    } catch (e) {
      console.error('Failed to load site data from Supabase, loading static fallbacks:', e)
      
      // Complete offline fallback loading
      const loadedState: Partial<DatabaseState> = {}
      for (const stateKey of Object.keys(STORAGE_KEYS_MAP)) {
        const fallbackData = ASG_PUBLISHED_LEARNING_DATA?.data?.[stateKey] || null
        if (stateKey === 'studentAnnouncement') {
          loadedState.studentAnnouncement = fallbackData as Announcement
        } else {
          (loadedState as any)[stateKey] = Array.isArray(fallbackData) ? fallbackData : []
        }
      }
      set({ ...loadedState, loading: false })
    }
  },

  saveSiteDataKey: async (key: string, value: any) => {
    set({ syncing: true })
    const dbKey = STORAGE_KEYS_MAP[key] || key
    try {
      const { error } = await supabase
        .from('site_data')
        .upsert({ key: dbKey, value, updated_at: new Date().toISOString() })

      if (error) throw error

      set({ [key]: value, syncing: false })
    } catch (e) {
      set({ syncing: false })
      throw e
    }
  },

  loadUserProgress: async (userId: string, userEmail: string, isAdmin: boolean) => {
    if (!userId) return
    set({ loading: true })
    try {
      // 1. Fetch user_activity records
      const { data: activityRows, error: activityError } = await supabase
        .from('user_activity')
        .select('key, value')
        .eq('user_id', userId)

      if (activityError) throw activityError

      const progressState: Partial<DatabaseState> = {
        quizAttempts: [],
        codingSubmissions: [],
        examAttempts: [],
        examRetakePermissions: [],
        courseAccessRequests: []
      }

      const activityMap = new Map((activityRows || []).map(r => [r.key, r.value]))
      
      progressState.quizAttempts = (activityMap.get('asgQuizAttempts') as QuizAttempt[]) || []
      progressState.codingSubmissions = (activityMap.get('asgCodingSubmissions') as CodingSubmission[]) || []
      progressState.examAttempts = (activityMap.get('asgExamAttempts') as ExamAttempt[]) || []

      // 2. Fetch specific tables (Course requests & retakes)
      const { data: requestRows } = await supabase
        .from('course_access_requests')
        .select('*')
        .or(`user_id.eq.${userId},email.eq.${userEmail.toLowerCase()}`)

      progressState.courseAccessRequests = (requestRows as any[])?.map(r => ({
        id: r.id,
        requestToken: r.request_token,
        userId: r.user_id,
        name: r.name,
        email: r.email,
        courseId: r.course_id,
        courseTitle: r.course_title,
        price: r.price,
        note: r.note,
        status: r.status,
        requestedAt: r.requested_at,
        updatedAt: r.updated_at,
        updatedBy: r.updated_by
      })) || []

      const { data: retakeRows } = await supabase
        .from('exam_retake_permissions')
        .select('*')
        .or(`user_id.eq.${userId},email.eq.${userEmail.toLowerCase()}`)

      progressState.examRetakePermissions = (retakeRows as any[])?.map(r => ({
        id: r.id,
        permissionKey: r.permission_key,
        userId: r.user_id,
        name: r.name,
        email: r.email,
        examType: r.exam_type,
        examId: r.exam_id,
        examTitle: r.exam_title,
        allowed: r.allowed,
        note: r.note,
        allowedAt: r.allowed_at,
        usedAt: r.used_at,
        updatedAt: r.updated_at,
        updatedBy: r.updated_by
      })) || []

      set({ ...progressState, loading: false })

      // 3. Admin specific loading
      if (isAdmin) {
        // Load Students List via RPC
        const { data: studentRows, error: studentError } = await supabase.rpc('asg_list_student_directory', {
          p_admin_email: userEmail.toLowerCase()
        })

        if (!studentError && studentRows) {
          set({
            studentsList: studentRows.map((r: any) => ({
              id: r.id,
              name: r.name,
              email: r.email,
              role: r.role,
              joinDate: r.join_date,
              provider: r.provider
            }))
          })
        }

        // Load all access requests
        const { data: allRequests } = await supabase.rpc('asg_list_course_access_requests', {
          p_admin_email: userEmail.toLowerCase()
        })
        if (allRequests) {
          set({
            allAccessRequests: allRequests.map((r: any) => ({
              id: r.id,
              requestToken: r.request_token,
              userId: r.user_id,
              name: r.name,
              email: r.email,
              courseId: r.course_id,
              courseTitle: r.course_title,
              price: r.price,
              note: r.note,
              status: r.status,
              requestedAt: r.requested_at,
              updatedAt: r.updated_at,
              updatedBy: r.updated_by
            }))
          })
        }

        // Load all exam retake permissions
        const { data: allRetakes } = await supabase
          .from('exam_retake_permissions')
          .select('*')
          .order('updated_at', { ascending: false })
        if (allRetakes) {
          set({
            allExamPermissions: allRetakes.map((r: any) => ({
              id: r.id,
              permissionKey: r.permission_key,
              userId: r.user_id,
              name: r.name,
              email: r.email,
              examType: r.exam_type,
              examId: r.exam_id,
              examTitle: r.exam_title,
              allowed: r.allowed,
              note: r.note,
              allowedAt: r.allowed_at,
              usedAt: r.used_at,
              updatedAt: r.updated_at,
              updatedBy: r.updated_by
            }))
          })
        }

        // Load all student activities for audit/monitoring
        const { data: allUserActivities } = await supabase
          .from('user_activity')
          .select('user_id, key, value, updated_at')
          .eq('key', 'asgExamAttempts')

        if (allUserActivities) {
          // Quick aggregation map
          const userAttemptsMap = new Map<string, ExamAttempt[]>()
          allUserActivities.forEach((activity: any) => {
            const userId = activity.user_id
            const attempts = Array.isArray(activity.value) ? activity.value : []
            userAttemptsMap.set(userId, attempts)
          })

          // We'll map them during dashboard rendering by matching with profiles
        }
      }
    } catch (e) {
      console.warn('Failed to load user progress details from Supabase:', e)
      set({ loading: false })
    }
  },

  saveQuizAttempt: async (userId, attempt) => {
    const attempts = [...get().quizAttempts, attempt]
    set({ quizAttempts: attempts })
    try {
      await supabase
        .from('user_activity')
        .upsert({
          user_id: userId,
          key: 'asgQuizAttempts',
          value: attempts,
          updated_at: new Date().toISOString()
        })
    } catch (e) {
      console.warn('Failed to upload quiz progress to Supabase:', e)
    }
  },

  saveCodingSubmission: async (userId, submission) => {
    const submissions = [...get().codingSubmissions, submission]
    set({ codingSubmissions: submissions })
    try {
      await supabase
        .from('user_activity')
        .upsert({
          user_id: userId,
          key: 'asgCodingSubmissions',
          value: submissions,
          updated_at: new Date().toISOString()
        })
    } catch (e) {
      console.warn('Failed to upload coding submission progress to Supabase:', e)
    }
  },

  saveExamAttempt: async (userId, attempt) => {
    const attempts = [...get().examAttempts, attempt]
    set({ examAttempts: attempts })
    try {
      await supabase
        .from('user_activity')
        .upsert({
          user_id: userId,
          key: 'asgExamAttempts',
          value: attempts,
          updated_at: new Date().toISOString()
        })
    } catch (e) {
      console.warn('Failed to upload exam attempt to Supabase:', e)
    }
  },

  createCourseAccessRequest: async (request) => {
    try {
      const { error } = await supabase
        .from('course_access_requests')
        .insert({
          request_token: request.requestToken,
          user_id: request.userId,
          name: request.name,
          email: request.email.toLowerCase(),
          course_id: request.courseId,
          course_title: request.courseTitle,
          price: request.price,
          note: request.note,
          status: 'pending'
        })
      if (error) throw error
    } catch (e) {
      console.error('Failed to create course request:', e)
      throw e
    }
  },

  updateCourseAccessRequestStatus: async (requestToken, status, adminEmail) => {
    try {
      const { error } = await supabase.rpc('asg_update_course_access_request_status', {
        p_admin_email: adminEmail.toLowerCase(),
        p_request_token: requestToken,
        p_status: status
      })
      if (error) throw error
    } catch (e) {
      console.error('Failed to update course request status:', e)
      throw e
    }
  },

  grantExamRetakePermission: async (permission, adminEmail) => {
    try {
      const { error } = await supabase
        .from('exam_retake_permissions')
        .insert({
          permission_key: permission.permissionKey,
          user_id: permission.userId,
          name: permission.name,
          email: permission.email.toLowerCase(),
          exam_type: permission.examType,
          exam_id: permission.examId,
          exam_title: permission.examTitle,
          allowed: true,
          note: permission.note,
          allowed_at: new Date().toISOString(),
          updated_by: { email: adminEmail.toLowerCase(), role: 'admin' }
        })
      if (error) throw error
    } catch (e) {
      console.error('Failed to grant exam retake:', e)
      throw e
    }
  },

  consumeExamRetakePermission: async (userId, userEmail, examType, examId) => {
    try {
      const { data, error } = await supabase.rpc('asg_consume_exam_retake_permission', {
        p_user_id: userId,
        p_email: userEmail.toLowerCase(),
        p_exam_type: examType,
        p_exam_id: examId
      })
      if (error) throw error
      // Returns true if a permission row was matched and successfully updated (allowed = false)
      return Array.isArray(data) && data.length > 0
    } catch (e) {
      console.warn('Could not consume exam permission:', e)
      return false
    }
  },

  uploadFile: async (file, path) => {
    const bucket = 'asg-content'
    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      })
    if (error) throw error
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)
      
    return publicUrl
  },

  subscribeToRealtime: (onUpdate) => {
    const channel = supabase
      .channel('site-data-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'site_data' },
        (payload) => {
          const key = payload.new ? (payload.new as any).key : null
          const value = payload.new ? (payload.new as any).value : null
          if (key) {
            // Find matched state key
            const stateKey = Object.keys(STORAGE_KEYS_MAP).find(k => STORAGE_KEYS_MAP[k] === key)
            if (stateKey) {
              set({ [stateKey]: value })
              onUpdate(stateKey, value)
            }
          }
        }
      )
      .subscribe()
      
    return () => {
      supabase.removeChannel(channel)
    }
  }
}))
