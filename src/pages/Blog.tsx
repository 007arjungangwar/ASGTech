import React, { useEffect, useState } from 'react'
import { useDatabaseStore } from '@/store/useDatabaseStore'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Clock, ArrowLeft, BookOpen } from 'lucide-react'

export const Blog: React.FC = () => {
  const { blogPosts, loadAllSiteData } = useDatabaseStore()
  const [selectedPost, setSelectedPost] = useState<any | null>(null)

  useEffect(() => {
    loadAllSiteData()
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight dark:text-white">ASG Tech Blog</h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-xl">
          Practical studies, learning roadmaps, syntax cheat sheets, and course updates.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!selectedPost ? (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {blogPosts.filter(p => p.status === 'active').map((post, idx) => (
              <article
                key={idx}
                onClick={() => setSelectedPost(post)}
                className="group cursor-pointer rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm hover:shadow-md dark:border-slate-800/50 dark:bg-slate-900 transition-all glass-panel flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-3">
                    <span className="bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400 px-2 py-0.5 rounded uppercase tracking-wider">
                      {post.category}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {post.readTime}</span>
                  </div>
                  <h2 className="text-xl font-bold dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {post.title}
                  </h2>
                  <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                    <User className="h-3.5 w-3.5" />
                    <span>{post.author}</span>
                  </div>
                  <span className="text-xs font-bold text-teal-600 dark:text-teal-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Read Article &rarr;
                  </span>
                </div>
              </article>
            ))}
          </motion.div>
        ) : (
          <motion.article
            key="detail"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="rounded-2xl border border-slate-200/50 bg-white p-8 shadow-sm dark:border-slate-800/50 dark:bg-slate-900 glass-panel space-y-6"
          >
            <button
              onClick={() => setSelectedPost(null)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Blog list
            </button>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-medium">
                <span className="bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400 px-2 py-0.5 rounded uppercase tracking-wider">
                  {selectedPost.category}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {selectedPost.readTime}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" /> {selectedPost.author}</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight dark:text-white leading-tight">
                {selectedPost.title}
              </h1>
            </div>

            <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed text-sm pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
              {/* If HTML template or markdown, we support displaying body text directly */}
              <p className="font-medium text-slate-800 dark:text-slate-200 text-base">{selectedPost.excerpt}</p>
              
              <div className="whitespace-pre-line">
                {selectedPost.body || "No further details available in this post fallback. Verify the article link above or explore standard courses."}
              </div>
              
              {selectedPost.url && (
                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <a
                    href={selectedPost.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-semibold text-white shadow hover:bg-teal-500 dark:bg-teal-500 dark:hover:bg-teal-400 transition-all"
                  >
                    <BookOpen className="h-4 w-4" /> Open Full Article Source
                  </a>
                </div>
              )}
            </div>
          </motion.article>
        )}
      </AnimatePresence>
    </div>
  )
}
