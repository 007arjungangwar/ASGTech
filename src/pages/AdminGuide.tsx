import { FileText, Code, GitBranch } from 'lucide-react'

export const AdminGuide: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-10 pb-20">
      <div className="space-y-2 border-b pb-4 dark:border-slate-800">
        <h1 className="text-3xl font-extrabold tracking-tight dark:text-white">Admin Developer Handbook</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Instructions, schemas, prompt structures, and n8n webhook pipelines setups.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Course Generation Section */}
        <section className="p-6 rounded-2xl border border-slate-200/50 bg-white dark:border-slate-800/50 dark:bg-slate-900 glass-panel space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <FileText className="h-4.5 w-4.5 text-teal-600 dark:text-teal-400" /> Course Prompt templates
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Copy and paste this structured prompt to guide AI models when creating new lesson content tags:
          </p>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 font-mono text-[9px] text-slate-600 dark:bg-slate-850 dark:border-slate-800 dark:text-slate-350 leading-relaxed select-all">
            "Generate a course module on [TOPIC] in HTML. Include section divs, sample code tags, and a summary. Ensure the markdown structure contains clear explanations and sample datasets."
          </div>
        </section>

        {/* n8n setup Section */}
        <section className="p-6 rounded-2xl border border-slate-200/50 bg-white dark:border-slate-800/50 dark:bg-slate-900 glass-panel space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <GitBranch className="h-4.5 w-4.5 text-teal-600 dark:text-teal-400" /> Webhook Setup Workflow
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Configure n8n workflows with a Webhook node accepting HTTP POST requests. Map response nodes to return:
          </p>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 font-mono text-[9px] text-slate-600 dark:bg-slate-850 dark:border-slate-800 dark:text-slate-350 select-all">
            {`{
  "output": "Markdown-formatted explanation response detailing coding query help, references, and logic diagrams..."
}`}
          </div>
        </section>

        {/* Assessment schemas */}
        <section className="p-6 rounded-2xl border border-slate-200/50 bg-white dark:border-slate-800/50 dark:bg-slate-900 glass-panel space-y-4 md:col-span-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Code className="h-4.5 w-4.5 text-teal-600 dark:text-teal-400" /> Assessment Questions JSON formats
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Ensure quiz catalog entries use the following format schema before pushing to site_data:
          </p>
          <pre className="p-4 bg-slate-50 rounded-xl border border-slate-100 font-mono text-[9px] text-slate-600 dark:bg-slate-850 dark:border-slate-800 dark:text-slate-350 select-all overflow-x-auto">
{`{
  "id": "quiz-python-constructs",
  "title": "Core Python Constructs Assessment",
  "timeLimit": 15,
  "questions": [
    {
      "question": "What is the expected outcome of range(1, 5)?",
      "options": ["[1, 2, 3, 4, 5]", "[1, 2, 3, 4]", "[0, 1, 2, 3, 4]", "Syntax error"],
      "correctOption": 1
    }
  ]
}`}
          </pre>
        </section>

      </div>
    </div>
  )
}
