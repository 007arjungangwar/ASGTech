import React from 'react'
import { Award, ShieldCheck, HelpCircle } from 'lucide-react'

export const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight dark:text-white">About ASG Tech</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
          We build structured pathways to help tech enthusiasts acquire practical, verifiable skills in coding, data science, and artificial intelligence.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <article className="p-6 rounded-2xl border border-slate-200/50 bg-white dark:border-slate-800/50 dark:bg-slate-900 glass-panel space-y-3">
          <div className="p-2.5 bg-teal-100 rounded-xl w-fit dark:bg-teal-950/40 text-teal-600 dark:text-teal-400">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold dark:text-white">High Integrity</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            All coding exercises run inside sandboxed compilers, and exams are proctored using full-screen enforcement to ensure authentic assessments.
          </p>
        </article>

        <article className="p-6 rounded-2xl border border-slate-200/50 bg-white dark:border-slate-800/50 dark:bg-slate-900 glass-panel space-y-3">
          <div className="p-2.5 bg-indigo-100 rounded-xl w-fit dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
            <Award className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold dark:text-white">Verifiable Proof</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Students earn unique verifiable certificates complete with digital signatures and validation QR codes for their portfolio and resumes.
          </p>
        </article>

        <article className="p-6 rounded-2xl border border-slate-200/50 bg-white dark:border-slate-800/50 dark:bg-slate-900 glass-panel space-y-3">
          <div className="p-2.5 bg-violet-100 rounded-xl w-fit dark:bg-violet-950/40 text-violet-600 dark:text-violet-400">
            <HelpCircle className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold dark:text-white">AI-Assisted Guidance</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Students can query our AI Tutor powered by local knowledge databases and web references, helping them troubleshoot code bugs instantly.
          </p>
        </article>
      </section>

      <section className="p-8 rounded-2xl border border-slate-200/50 bg-white dark:border-slate-800/50 dark:bg-slate-900 glass-panel">
        <h2 className="text-2xl font-bold dark:text-white mb-4">Founder's Note</h2>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
          "ASG Tech was founded by Arjun Singh Gangwar with a clear mandate: decouple tech education from passive video lectures. Learning technology requires active implementation. We focus on providing instant compiler feedback, structured roadmap timelines, and credential evaluations that give students real-world leverage."
        </p>
      </section>
    </div>
  )
}
