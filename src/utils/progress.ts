import { Course, Topic, CodingChallenge, CodingSubmission } from '@/types'

export interface TopicCompletionStep {
  key: 'content' | 'quiz' | 'coding'
  label: string
  required: boolean
  done: boolean
}

export interface TopicCompletionState {
  topicId: string
  topicTitle: string
  contentViewed: boolean
  quizRequired: boolean
  quizCompleted: boolean
  codingRequired: boolean
  codingCompleted: boolean
  codingChallengeCount: number
  solvedCodingCount: number
  completed: boolean
  completedSteps: number
  totalSteps: number
  steps: TopicCompletionStep[]
  lastTab: string
  updatedAt: string
}

export interface CourseProgressRecord {
  userId: string
  email: string
  name: string
  courseId: string
  courseTitle: string
  topicId: string
  topicTitle: string
  topicIndex: number
  totalTopics: number
  completedTopicIds: string[]
  completedSteps: number
  totalSteps: number
  topicStatusById: Record<string, {
    contentViewed: boolean
    quizCompleted: boolean
    codingCompleted: boolean
    completed: boolean
    completedAt?: string
    lastCodingChallengeId?: string
    lastCodingPassedAt?: string
    lastTab?: string
    updatedAt?: string
  }>
  topicStates: TopicCompletionState[]
  progressPercent: number
  nextTopicId: string
  nextTopicTitle: string
  tab: string
  updatedAt: string
}

export function topicHasQuiz(topic: Topic): boolean {
  return Boolean(String(topic && topic.quizHtml || '').trim())
}

export function getTopicCompletionState(
  _userId: string,
  course: Course,
  topic: Topic,
  storedProgress: any | null,
  allCodingChallenges: CodingChallenge[],
  codingSubmissions: CodingSubmission[]
): TopicCompletionState {
  const topicStatusById = storedProgress && storedProgress.topicStatusById ? storedProgress.topicStatusById : {}
  const status = topicStatusById[topic.id] || {}
  
  // Filter coding challenges for this course & topic
  // Note: we identify challenges by matching courseId and topicId
  const challenges = allCodingChallenges.filter(c => c.courseId === course.id && c.topicId === topic.id)
  
  // Filter solved submissions for this topic
  const solvedChallengeIds = new Set(
    codingSubmissions
      .filter(s => s.courseId === course.id && s.topicId === topic.id && s.passed === s.total && s.total > 0)
      .map(s => s.challengeId)
  )

  const codingRequired = challenges.length > 0
  const codingCompleted = !codingRequired || challenges.every(c => solvedChallengeIds.has(c.id))
  
  const quizRequired = topicHasQuiz(topic)
  const contentViewed = Boolean(status.contentViewed)
  const quizCompleted = !quizRequired || Boolean(status.quizCompleted)
  
  const completed = contentViewed && quizCompleted && codingCompleted

  const steps: TopicCompletionStep[] = [
    { key: 'content', label: 'Lesson', required: true, done: contentViewed },
    { key: 'quiz', label: 'Quiz', required: quizRequired, done: quizCompleted },
    { key: 'coding', label: 'Coding', required: codingRequired, done: codingCompleted }
  ].filter(step => step.required) as TopicCompletionStep[]

  return {
    topicId: topic.id,
    topicTitle: topic.title,
    contentViewed,
    quizRequired,
    quizCompleted,
    codingRequired,
    codingCompleted,
    codingChallengeCount: challenges.length,
    solvedCodingCount: solvedChallengeIds.size,
    completed,
    completedSteps: steps.filter(step => step.done).length,
    totalSteps: steps.length,
    steps,
    lastTab: status.lastTab || '',
    updatedAt: status.updatedAt || ''
  }
}

export function buildCourseProgressRecord(
  userId: string,
  userEmail: string,
  userName: string,
  course: Course,
  storedProgress: any | null,
  activeTopic: Topic | null,
  tab: string,
  allCodingChallenges: CodingChallenge[],
  codingSubmissions: CodingSubmission[]
): CourseProgressRecord {
  const topics = Array.isArray(course.topics) ? course.topics.filter(t => t.status !== 'draft') : []
  const stored = storedProgress || {}
  const topicStatusById = { ...(stored.topicStatusById || {}) }
  const activeTopicId = activeTopic ? activeTopic.id : stored.topicId || (topics[0] ? topics[0].id : '')

  const topicStates = topics.map(topic => {
    const state = getTopicCompletionState(
      userId,
      course,
      topic,
      { ...stored, topicStatusById },
      allCodingChallenges,
      codingSubmissions
    )
    topicStatusById[topic.id] = {
      ...(topicStatusById[topic.id] || {}),
      contentViewed: state.contentViewed,
      quizCompleted: state.quizCompleted,
      codingCompleted: state.codingCompleted,
      completed: state.completed,
      completedAt: state.completed ? (topicStatusById[topic.id]?.completedAt || new Date().toISOString()) : ''
    }
    return state
  })

  const completedTopicIds = topicStates.filter(s => s.completed).map(s => s.topicId)
  const completedSteps = topicStates.reduce((sum, s) => sum + s.completedSteps, 0)
  const totalSteps = topicStates.reduce((sum, s) => sum + s.totalSteps, 0)
  const progressPercent = totalSteps ? Math.round((completedSteps / totalSteps) * 100) : 0

  const topicIndex = Math.max(0, topics.findIndex(t => t.id === activeTopicId))
  const activeTopicRecord = topics[topicIndex] || activeTopic || topics[0] || null
  const nextTopic = topics.find(t => !completedTopicIds.includes(t.id)) || null

  return {
    userId,
    email: userEmail,
    name: userName,
    courseId: course.id,
    courseTitle: course.title,
    topicId: activeTopicRecord ? activeTopicRecord.id : '',
    topicTitle: activeTopicRecord ? activeTopicRecord.title : '',
    topicIndex: activeTopicRecord ? topicIndex + 1 : 0,
    totalTopics: topics.length,
    completedTopicIds,
    completedSteps,
    totalSteps,
    topicStatusById,
    topicStates,
    progressPercent,
    nextTopicId: nextTopic ? nextTopic.id : '',
    nextTopicTitle: nextTopic ? nextTopic.title : '',
    tab: tab || stored.tab || 'content',
    updatedAt: new Date().toISOString()
  }
}
