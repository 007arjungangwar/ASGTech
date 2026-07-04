import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDatabaseStore } from '@/store/useDatabaseStore'
import { useAuthStore } from '@/store/useAuthStore'
import { Terminal, Play, AlertOctagon, Compass, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export const CodingPractice: React.FC = () => {
  const { codingChallenges, codingSubmissions, saveCodingSubmission, loadAllSiteData } = useDatabaseStore()
  const { profile } = useAuthStore()
  const [searchParams] = useSearchParams()

  const [activeChallengeId, setActiveChallengeId] = useState<string>('')
  const [userCode, setUserCode] = useState('')
  const [engineStatus, setEngineStatus] = useState<'unloaded' | 'loading' | 'ready' | 'error'>('unloaded')
  const [running, setRunning] = useState(false)
  const [results, setResults] = useState<any | null>(null)
  
  const pyodideRef = useRef<any>(null)

  useEffect(() => {
    loadAllSiteData()
  }, [])

  // Manage initial active challenge selection from URL
  useEffect(() => {
    const defaultId = searchParams.get('challenge') || (codingChallenges[0]?.id || '')
    if (defaultId) {
      setActiveChallengeId(defaultId)
    }
  }, [codingChallenges, searchParams])

  // Prepopulate editor with starter code
  useEffect(() => {
    const active = codingChallenges.find(c => c.id === activeChallengeId)
    if (active) {
      // Check if they have a saved submission first
      const saved = codingSubmissions.find(s => s.challengeId === active.id)
      setUserCode(saved?.code || active.starterCode || '# Enter python solution\ndef solution(*args):\n    pass\n')
      setResults(null)
    }
  }, [activeChallengeId, codingChallenges, codingSubmissions])

  // Load Pyodide script dynamically
  const loadPyodideEngine = async () => {
    if (pyodideRef.current) return pyodideRef.current
    setEngineStatus('loading')
    try {
      // Check if script already on page
      let script = document.querySelector("script[src*='pyodide.js']") as HTMLScriptElement
      if (!script) {
        script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js'
        script.async = true
        document.head.appendChild(script)
        await new Promise((resolve, reject) => {
          script.onload = resolve
          script.onerror = reject
        })
      }
      
      const loadPyodideFunc = (window as any).loadPyodide
      if (!loadPyodideFunc) throw new Error('loadPyodide not found on window')
      
      const engine = await loadPyodideFunc({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/'
      })
      pyodideRef.current = engine
      setEngineStatus('ready')
      return engine
    } catch (err) {
      console.error('Failed to load Pyodide Python engine:', err)
      setEngineStatus('error')
      toast.error('Failed to instantiate Python engine. Ensure you are online.')
      return null
    }
  }

  // Auto trigger pyodide loading on mount
  useEffect(() => {
    loadPyodideEngine()
  }, [])

  const activeChallenge = codingChallenges.find(c => c.id === activeChallengeId)

  // Build the Python runner script
  const buildPythonHarness = (code: string, tests: any[]) => {
    const codeLiteral = JSON.stringify(code)
    const testsLiteral = JSON.stringify(JSON.stringify(tests))

    return `
import contextlib
import io
import json
import traceback

USER_CODE = ${codeLiteral}
TESTS = json.loads(${testsLiteral})
payload = {"passed": 0, "total": len(TESTS), "results": [], "stdout": "", "setupStdout": "", "error": ""}
setup_buffer = io.StringIO()
namespace = {}

try:
    with contextlib.redirect_stdout(setup_buffer):
        exec(USER_CODE, namespace)
    payload["setupStdout"] = setup_buffer.getvalue()

    solution = namespace.get("solution")
    if not callable(solution):
        raise Exception("Define a function named solution.")

    for index, test in enumerate(TESTS, start=1):
        args = test.get("args", [])
        expected = test.get("expected")

        try:
            test_buffer = io.StringIO()
            with contextlib.redirect_stdout(test_buffer):
                result = solution(*args)
            passed = result == expected
            if passed:
                payload["passed"] += 1

            payload["results"].append({
                "index": index,
                "passed": passed,
                "args": args,
                "expected": expected,
                "got": result,
                "stdout": test_buffer.getvalue()
            })
        except Exception as test_error:
            payload["results"].append({
                "index": index,
                "passed": False,
                "args": args,
                "expected": expected,
                "got": "Error: " + str(test_error),
                "stdout": locals().get("test_buffer", io.StringIO()).getvalue()
            })
except Exception:
    payload["error"] = traceback.format_exc(limit=4)
    payload["setupStdout"] = setup_buffer.getvalue()

payload["stdout"] = payload["setupStdout"] + "".join([item.get("stdout", "") for item in payload["results"]])
json.dumps(payload, default=str)
`
  }

  const handleRunCode = async (submit = false) => {
    if (!activeChallenge || !profile) return
    
    // Load engine if not loaded
    const engine = await loadPyodideEngine()
    if (!engine) return

    setRunning(true)
    try {
      const harness = buildPythonHarness(userCode, activeChallenge.tests)
      const resJson = await engine.runPythonAsync(harness)
      const payload = JSON.parse(resJson)

      setResults(payload)

      if (submit) {
        // Submit code solution
        await saveCodingSubmission(profile.id, {
          challengeId: activeChallenge.id,
          challengeTitle: activeChallenge.title,
          courseId: activeChallenge.courseId || '',
          topicId: activeChallenge.topicId || '',
          code: userCode,
          passed: payload.passed,
          total: payload.total,
          percentage: payload.total ? Math.round((payload.passed / payload.total) * 100) : 0,
          results: payload.results || [],
          stdout: payload.stdout || '',
          submittedAt: new Date().toISOString()
        })
        toast.success(`Submission saved! Score: ${payload.passed}/${payload.total}`)
      } else {
        toast.info(`Tests completed. Passed: ${payload.passed}/${payload.total}`)
      }
    } catch (e: any) {
      toast.error('Execution encountered an unexpected system error.')
      console.error(e)
    } finally {
      setRunning(false)
    }
  }

  // Handle standard tab indenting in Textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const textarea = e.currentTarget
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const nextCode = userCode.substring(0, start) + '    ' + userCode.substring(end)
      setUserCode(nextCode)
      // Reset cursor position
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4
      }, 0)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6 pb-20">
      
      {/* Editor top header */}
      <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4 dark:border-slate-800">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold tracking-tight dark:text-white flex items-center gap-1.5">
            <Terminal className="h-5 w-5 text-teal-600 dark:text-teal-400" /> Interactive Compiler
          </h1>
          <p className="text-xs text-slate-500">Run and verify Python solutions in the browser.</p>
        </div>

        {/* Dropdown list of challenges */}
        <div className="relative">
          <select
            value={activeChallengeId}
            onChange={(e) => setActiveChallengeId(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            <option value="" disabled>Select Coding Exercise...</option>
            {codingChallenges.map((challenge, idx) => (
              <option key={idx} value={challenge.id}>
                {challenge.title} ({challenge.difficulty})
              </option>
            ))}
          </select>
        </div>
      </section>

      {!activeChallenge ? (
        <div className="text-center py-20 text-slate-400 space-y-3 border border-dashed rounded-2xl dark:border-slate-800">
          <Compass className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-700" />
          <h3 className="text-sm font-semibold">No challenges active</h3>
          <p className="text-xs">Assessments must be added by administrators first.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          
          {/* Left panel: Prompt Description and Tests */}
          <div className="space-y-6 flex flex-col">
            <article className="p-6 rounded-2xl border border-slate-200/50 bg-white dark:border-slate-800/50 dark:bg-slate-900 glass-panel flex-1 space-y-4">
              <div className="flex items-center justify-between gap-4 border-b pb-3 dark:border-slate-800">
                <span className="text-[9px] uppercase font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded dark:bg-teal-950/40 dark:text-teal-400">
                  {activeChallenge.difficulty}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  {activeChallenge.topic}
                </span>
              </div>
              <h2 className="text-lg font-bold dark:text-white leading-tight">
                {activeChallenge.title}
              </h2>
              <div className="prose dark:prose-invert max-w-none text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {activeChallenge.prompt}
              </div>

              {/* Sample tests cases list */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Example test case validations:</h4>
                <div className="space-y-1.5 font-mono text-[10px] text-slate-500">
                  {activeChallenge.tests?.slice(0, 2).map((test, idx) => (
                    <div key={idx} className="bg-slate-50 p-2 rounded border border-slate-100 dark:bg-slate-850 dark:border-slate-800/60">
                      <strong>Input:</strong> solution({test.args?.join(', ')}) &rarr; <strong>Expected:</strong> {String(test.expected)}
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </div>

          {/* Right panel: Monaco Editor and results */}
          <div className="space-y-6 flex flex-col">
            <div className="rounded-2xl border border-slate-200/50 bg-slate-900 shadow-xl overflow-hidden flex flex-col flex-1 dark:border-slate-800/50">
              {/* Editor toolbar */}
              <div className="flex items-center justify-between bg-slate-950 px-4 py-2 border-b border-slate-800 text-[10px] text-slate-400 font-mono select-none">
                <span>solution.py</span>
                <span>
                  {engineStatus === 'loading' && 'instantiating python...'}
                  {engineStatus === 'ready' && 'ready'}
                  {engineStatus === 'error' && 'failed'}
                </span>
              </div>

              {/* Monospace code area */}
              <textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                rows={12}
                className="w-full flex-1 bg-slate-900 p-4 text-xs font-mono text-emerald-400 outline-none resize-none border-0 leading-relaxed focus:ring-0 placeholder-slate-700"
              />

              {/* Controls footer */}
              <div className="bg-slate-950 px-4 py-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  onClick={() => handleRunCode(false)}
                  disabled={running || engineStatus === 'loading'}
                  className="rounded-lg border border-slate-700 hover:border-slate-500 bg-transparent px-4 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-all disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  {running ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5 fill-current" />}
                  Run Sandbox
                </button>
                <button
                  onClick={() => handleRunCode(true)}
                  disabled={running || engineStatus === 'loading'}
                  className="rounded-lg bg-teal-600 hover:bg-teal-500 px-4 py-1.5 text-xs font-semibold text-white shadow-md transition-all disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  Submit Code
                </button>
              </div>
            </div>

            {/* Results Console box */}
            {results && (
              <div className="rounded-2xl border border-slate-200/50 bg-white p-5 shadow-sm dark:border-slate-800/50 dark:bg-slate-900 glass-panel space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Compiler Outputs</h3>
                
                {/* Score indicators */}
                <div className="flex gap-4">
                  <div className="flex-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 block font-medium">Test score</span>
                    <strong className="text-base font-bold text-slate-800 dark:text-white">
                      {results.passed}/{results.total}
                    </strong>
                  </div>
                  <div className="flex-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 block font-medium">Outcome percentage</span>
                    <strong className="text-base font-bold text-teal-600 dark:text-teal-400">
                      {results.total ? Math.round((results.passed / results.total) * 100) : 0}%
                    </strong>
                  </div>
                </div>

                {/* Stdout prints */}
                {results.stdout && (
                  <div className="space-y-1">
                    <strong className="text-[10px] font-bold text-slate-400 block">Print statements:</strong>
                    <pre className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[10px] font-mono text-slate-600 dark:bg-slate-850 dark:border-slate-800 dark:text-slate-300 max-h-24 overflow-y-auto">
                      {results.stdout}
                    </pre>
                  </div>
                )}

                {/* Compilation errors */}
                {results.error && (
                  <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/20 text-xs font-mono text-rose-600 dark:border-rose-900/30 dark:bg-rose-950/20 max-h-36 overflow-y-auto whitespace-pre-wrap flex items-start gap-2">
                    <AlertOctagon className="h-4.5 w-4.5 text-rose-500 flex-shrink-0 mt-0.5" />
                    <span>{results.error}</span>
                  </div>
                )}

                {/* Assertion results rows */}
                <div className="space-y-1.5">
                  <strong className="text-[10px] font-bold text-slate-400 block">Assertions:</strong>
                  <div className="space-y-1 text-xs">
                    {results.results?.map((test: any, idx: number) => (
                      <div key={idx} className={`p-2.5 rounded-lg border flex items-center justify-between gap-4 ${
                        test.passed 
                          ? 'border-emerald-100 bg-emerald-50/20 text-emerald-800 dark:border-emerald-900/25 dark:bg-emerald-950/10 dark:text-emerald-400' 
                          : 'border-rose-100 bg-rose-50/20 text-rose-800 dark:border-rose-900/25 dark:bg-rose-950/10 dark:text-rose-400'
                      }`}>
                        <div className="font-mono text-[10px]">
                          Test {test.index}: solution({test.args?.join(', ')}) &rarr; got {String(test.got)}
                        </div>
                        <span className="font-bold text-[9px] uppercase tracking-wider">
                          {test.passed ? 'PASSED' : 'FAILED'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>
      )}
    </div>
  )
}
