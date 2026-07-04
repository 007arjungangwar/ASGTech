import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDatabaseStore } from '@/store/useDatabaseStore'
import { useAuthStore } from '@/store/useAuthStore'
import { motion } from 'framer-motion'
import { BookOpen, Award, Terminal, Compass, ArrowRight, Star } from 'lucide-react'

export const Home: React.FC = () => {
  const { courses, projectShowcase, loadAllSiteData } = useDatabaseStore()
  const { user } = useAuthStore()

  useEffect(() => {
    loadAllSiteData()
  }, [])

  const features = [
    { title: 'Premium Courses', desc: 'Structured Python, Data Analysis, Machine Learning, and Deep Learning modules.', icon: BookOpen, color: 'text-teal-600 dark:text-teal-400' },
    { title: 'LeetCode-Style Practice', desc: 'Solve actual coding challenges inside a browser-based Python sandbox.', icon: Terminal, color: 'text-amber-600 dark:text-amber-400' },
    { title: 'Proctored Assessment', desc: 'Appear for certification exams protected by automated anti-cheat focus sensors.', icon: Compass, color: 'text-indigo-600 dark:text-indigo-400' },
    { title: 'Verifiable Credentials', desc: 'Generate digital certificates with digital signatures and QR verifications.', icon: Award, color: 'text-violet-600 dark:text-violet-400' }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  }

  const cardVariants: any = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  }

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 px-6 text-center lg:py-32 bg-radial from-teal-500/10 via-transparent to-transparent">
        <div className="mx-auto max-w-4xl space-y-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-teal-200/50 bg-teal-50/50 px-3.5 py-1 text-xs font-semibold text-teal-800 dark:border-teal-900/50 dark:bg-teal-950/40 dark:text-teal-400"
          >
            <Star className="h-3 w-3 fill-current" />
            Empowering Next-Gen Innovators
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl font-extrabold tracking-tight sm:text-6xl text-slate-900 dark:text-white"
          >
            Master Practical Technology with{' '}
            <span className="bg-gradient-to-r from-teal-600 to-indigo-600 bg-clip-text text-transparent dark:from-teal-400 dark:to-indigo-400">
              ASG Tech
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400 leading-relaxed"
          >
            An interactive EdTech workspace featuring full-fledged courses, real-time Python compiler environments, automated examinations, and verifiable certifications.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            {user ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3 font-semibold text-white shadow-lg shadow-teal-500/25 hover:bg-teal-500 dark:bg-teal-500 dark:hover:bg-teal-400 transition-all transform hover:-translate-y-0.5"
              >
                Go to Workspace <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login?mode=register"
                  className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3 font-semibold text-white shadow-lg shadow-teal-500/25 hover:bg-teal-500 dark:bg-teal-500 dark:hover:bg-teal-400 transition-all transform hover:-translate-y-0.5"
                >
                  Start Learning Now <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-all"
                >
                  Sign In
                </Link>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="text-center space-y-2 mb-16">
          <h2 className="text-3xl font-bold dark:text-white">Why ASG Tech?</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Everything you need to grow your technology footprint</p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feat, idx) => {
            const Icon = feat.icon
            return (
              <motion.article
                key={idx}
                variants={cardVariants}
                className="group rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm hover:shadow-md dark:border-slate-800/50 dark:bg-slate-900 transition-all glass-panel"
              >
                <div className={`rounded-xl bg-slate-50 p-3 w-fit dark:bg-slate-800 group-hover:scale-110 transition-transform`}>
                  <Icon className={`h-6 w-6 ${feat.color}`} />
                </div>
                <h3 className="mt-4 text-lg font-bold dark:text-white">{feat.title}</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{feat.desc}</p>
              </motion.article>
            )
          })}
        </motion.div>
      </section>

      {/* Courses Catalog Highlights */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl font-bold dark:text-white">Explore Courses</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Beginner to advanced learning tracks</p>
          </div>
          <Link to="/courses" className="text-teal-600 dark:text-teal-400 text-sm font-semibold inline-flex items-center gap-1 hover:underline">
            View All Courses <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.slice(0, 3).map((course, idx) => (
            <article key={idx} className="group flex flex-col justify-between rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm hover:shadow-md dark:border-slate-800/50 dark:bg-slate-900 transition-all glass-panel">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100 font-bold text-teal-800 dark:bg-teal-950/40 dark:text-teal-400">
                  {course.icon || 'PY'}
                </div>
                <h3 className="mt-4 text-lg font-bold group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors dark:text-white">{course.title}</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">{course.summary}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">{course.price}</span>
                <Link to={`/login?next=/courses/${course.id}`} className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline">
                  Enroll Course
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Projects Showcase Preview */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl font-bold dark:text-white">Active Projects</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Build credible products for your resume</p>
          </div>
          <Link to="/projects" className="text-teal-600 dark:text-teal-400 text-sm font-semibold inline-flex items-center gap-1 hover:underline">
            Browse Projects <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projectShowcase.slice(0, 2).map((proj, idx) => (
            <article key={idx} className="rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm dark:border-slate-800/50 dark:bg-slate-900 glass-panel">
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-1 rounded">
                {proj.category}
              </span>
              <h3 className="mt-3 text-lg font-bold dark:text-white">{proj.title}</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{proj.summary}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {proj.skills.map((skill, sIdx) => (
                  <span key={sIdx} className="text-[10px] text-slate-500 bg-slate-100 dark:text-slate-400 dark:bg-slate-800 px-2 py-0.5 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
