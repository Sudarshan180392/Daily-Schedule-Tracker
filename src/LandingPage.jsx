import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from './AuthWrapper'

export default function LandingPage() {
  const { session } = useAuth()
  const [activeFaq, setActiveFaq] = useState(null)
  
  /* ── Mockup Interactive State ── */
  const [mockTasks, setMockTasks] = useState([
    { id: 1, label: 'Laxmikanth Polity — Chapter 12', checked: true, hours: 2 },
    { id: 2, label: 'Ramesh Singh Economy — Chapter 4', checked: false, hours: 1.5 },
    { id: 3, label: 'The Hindu Editorial & Notes', checked: true, hours: 1 },
    { id: 4, label: 'Daily Mains Answer Writing (2 Questions)', checked: false, hours: 1 },
  ])
  const [timerActive, setTimerActive] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(16330) // 4h 32m 10s
  const [toastMessage, setToastMessage] = useState(null)

  // Toggle tasks in landing mockup
  const toggleMockTask = (id) => {
    setMockTasks(prev => prev.map(t => t.id === id ? { ...t, checked: !t.checked } : t))
  }

  // Calculate progress stats for mockup
  const totalTasks = mockTasks.length
  const completedTasks = mockTasks.filter(t => t.checked).length
  const progressPercent = Math.round((completedTasks / totalTasks) * 100)
  const actualStudyHours = mockTasks
    .filter(t => t.checked)
    .reduce((sum, t) => sum + t.hours, 0)
    .toFixed(1)

  // ticking study clock simulation
  useEffect(() => {
    let interval = null
    if (timerActive) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [timerActive])

  const formatMockTimer = (sec) => {
    const h = Math.floor(sec / 3600)
    const m = Math.floor((sec % 3600) / 60)
    const s = sec % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const triggerToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // FAQs data
  const faqs = [
    {
      q: 'Is this Prep Tracker really free?',
      a: 'Yes, the core 30-Day Prep Tracker, including the Day Sheet, Mock Test Analytics, Current Affairs Log, and Community features, is 100% free. You can create your account and start your sprint immediately.'
    },
    {
      q: 'Can I use it for State PSC or other exams?',
      a: 'Absolutely! While configured by default with core UPSC subjects, you can fully customize your exam date, sprint names, and subject lists via the Settings panel to align with state PSCs (like UPPSC, MPSC, BPSC) or other competitive exams.'
    },
    {
      q: 'How does the Mock Test Percentile estimation work?',
      a: 'The Mock analyzer uses a statistical standard normal cumulative distribution function (CDF). It plots your GS mock scores to estimate your percentile rank, helping you target safe margins.'
    },
    {
      q: 'What are the Spaced Revision cycles supported by the tracker?',
      a: 'The planner teaches you to log revisions. In the core tracker, you can maintain logs for up to 5 revision passes (R1 through R5) to combat the forgetting curve, ensuring you revise crucial static content (like Lakshmikanth or Spectrum) at optimal intervals.'
    },
    {
      q: 'Is my study data secure and private?',
      a: 'Yes. Your data is private, associated strictly with your Google account and your browsers only.'
    }
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* ── Background Glow Effects ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px]" />
        <div className="absolute top-2/3 left-10 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[140px]" />
      </div>

      {/* ── Toast Alerts ── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-indigo-500/30 text-indigo-300 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-fadeSlideIn">
          <span>🎯</span>
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* ── HEADER / NAVIGATION ── */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <span className="text-xl">🎯</span>
          </div>
          <div>
            <span className="font-bold text-white tracking-tight text-lg">My Prep Tracker</span>
            <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider block leading-none">30-Day Sprint</span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#comparison" className="hover:text-white transition-colors">Why Us</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#faqs" className="hover:text-white transition-colors">FAQs</a>
        </nav>

        {/* CTAs */}
        <div className="flex items-center gap-3">
          {session ? (
            <Link
              to="/tracker"
              className="text-xs md:text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-4 md:px-5 py-2 rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
            >
              <span>Go to Dashboard</span>
              <span>→</span>
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-xs md:text-sm text-slate-300 hover:text-white font-medium px-3.5 py-2 rounded-xl transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/login"
                className="text-xs md:text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 md:px-4.5 rounded-xl transition-all shadow-md shadow-indigo-600/20"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </header>

      {/* ── HERO SECTION ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-20 md:py-28 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Copy Column */}
        <div className="lg:col-span-6 space-y-6 md:space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-full text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <span>🚀</span>
            <span>UPSC/State PSC Exam Prep Tracker</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] md:leading-[1.15]">
            Transform Your Prep Journey<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-300">
              From Chaos to Structure
            </span>
          </h1>

          <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
            Forget chaotic spreadsheets, messy notebooks, and fragmented calendars. 
            Track your exam's syllabus, log daily study hours, schedule revisions, and diagnose mock test performance inside one hyper-focused digital workspace.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            {session ? (
              <Link
                to="/tracker"
                className="w-full sm:w-auto text-center font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
              >
                <span>Go to Your Tracker</span>
                <span className="text-xl">📊</span>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="w-full sm:w-auto text-center font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 group"
                >
                  <span>Start Your 30-Day Sprint (Free)</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
                <a
                  href="#features"
                  className="w-full sm:w-auto text-center font-semibold bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white px-6 py-4 rounded-2xl transition-all"
                >
                  Explore Features
                </a>
              </>
            )}
          </div>

          {/* Value Badges */}
          <div className="pt-4 grid grid-cols-3 gap-4 border-t border-slate-900 max-w-md mx-auto lg:mx-0">
            <div>
              <p className="text-white font-bold text-lg md:text-xl">100% Free</p>
              <p className="text-slate-500 text-xs mt-0.5">Core Features</p>
            </div>
            <div>
              <p className="text-white font-bold text-lg md:text-xl">Secure</p>
              <p className="text-slate-500 text-xs mt-0.5">Database</p>
            </div>
            <div>
              <p className="text-white font-bold text-lg md:text-xl">Flexible</p>
              <p className="text-slate-500 text-xs mt-0.5">Subjects' Addition</p>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive CSS Mockup */}
        <div className="lg:col-span-6 relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-3xl blur-2xl opacity-60 pointer-events-none" />
          
          {/* Main Mockup Card Container */}
          <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
            
            {/* Mockup Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-indigo-500 flex items-center justify-center text-[8px]">🎯</span>
                <div>
                  <h3 className="text-xs font-bold text-white tracking-wide uppercase">Interactive Preview</h3>
                  <p className="text-[10px] text-slate-500">UPSC Sprint Day 12 / 30</p>
                </div>
              </div>
              
              {/* Mock Exam Countdown */}
              <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-right">
                <span className="text-[10px] text-slate-400 block leading-none font-semibold">UPSC 2027</span>
                <span className="text-xs font-mono font-bold text-amber-400 leading-none"> 300 Days Left</span>
              </div>
            </div>

            {/* Grid of Mock widgets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Daily Timer Log widget */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">⏱ Study Stopwatch</span>
                  <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded-md font-semibold">Day log</span>
                </div>
                
                <div className="space-y-1">
                  <div className="text-2xl font-mono font-bold text-white tracking-wider">
                    {formatMockTimer(timerSeconds)}
                  </div>
                  <p className="text-[10px] text-slate-500">Ticking active study sessions</p>
                </div>

                <button
                  onClick={() => setTimerActive(!timerActive)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    timerActive
                      ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-500/25'
                      : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/10'
                  }`}
                >
                  {timerActive ? (
                    <>
                      <span>⏸ Pause Focus</span>
                    </>
                  ) : (
                    <>
                      <span>▶ Start Timer</span>
                    </>
                  )}
                </button>
              </div>

              {/* Progress Summary Pie Mockup */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">📊 Today's Metrics</span>
                  <span className="text-[9px] bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded-md font-semibold font-mono">{progressPercent}% Done</span>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* CSS Circular Progress Ring */}
                  <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="32" cy="32" r="26" stroke="#1e293b" strokeWidth="6" fill="transparent" />
                      <circle
                        cx="32"
                        cy="32"
                        r="26"
                        stroke="#6366f1"
                        strokeWidth="6"
                        fill="transparent"
                        strokeDasharray={163.36}
                        strokeDashoffset={163.36 - (163.36 * progressPercent) / 100}
                        className="transition-all duration-500 ease-out"
                      />
                    </svg>
                    <span className="absolute text-xs font-bold font-mono text-white">{progressPercent}%</span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-white text-sm font-bold">{actualStudyHours}h</p>
                    <p className="text-[10px] text-slate-400 leading-tight">Studied out of 5.5 hours targeted</p>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 italic leading-tight">
                  💡 Check off tasks on the list to watch this progress ring update in real-time!
                </div>
              </div>
            </div>

            {/* Day Sheet Checklist */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white tracking-wide uppercase">Day Sheet Planner Tasks</h4>
                <span className="text-[10px] text-slate-500">{completedTasks} / {totalTasks} Completed</span>
              </div>
              
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1 scrollbar-thin">
                {mockTasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => toggleMockTask(t.id)}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer ${
                      t.checked
                        ? 'bg-indigo-950/20 border-indigo-500/20 text-slate-300'
                        : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 text-slate-400'
                    }`}
                  >
                    <div className={`w-4.5 h-4.5 rounded-md border flex items-center justify-center transition-all ${
                      t.checked
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'border-slate-600 bg-slate-950'
                    }`}>
                      {t.checked && <span className="text-[10px]">✓</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium truncate ${t.checked ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {t.label}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{t.hours}h</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Streak & Mock Diagnostics Widgets footer row */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[9px] font-medium text-slate-500 block uppercase">Habit Streak</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-white font-bold font-mono">🔥 21 Days</span>
                  {/* mini heat cells */}
                  <div className="flex gap-0.5">
                    <span className="w-1.5 h-1.5 bg-indigo-950 rounded-sm"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-700 rounded-sm"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-sm"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-sm"></span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[9px] font-medium text-slate-500 block uppercase">Mock Score</span>
                <span className="text-xs text-white font-bold font-mono">🎯 111.67 <span className="text-[9px] font-normal text-slate-500">GS 1 </span></span>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE SECTION (Why US) ── */}
      <section id="comparison" className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-slate-900">
        <div className="text-center space-y-4 mb-16">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Why My Prep Tracker?</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Stop Preparing In Chaos. Start Preparing In Structure.
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm">
            Compare our custom execution-driven workflow against standard spreadsheets and generic todo apps.
          </p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900/30 p-6 max-w-4xl mx-auto shadow-2xl">
          <table className="w-full min-w-[600px] text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="p-4 text-left">Feature</th>
                <th className="p-4 text-center">Traditional</th>
                <th className="p-4 text-center">Other Apps</th>
                <th className="p-4 text-center text-indigo-400 font-bold">My Prep Tracker</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              <tr className="hover:bg-slate-900/10 transition-colors">
                <td className="p-4 font-medium text-slate-200">Structured System</td>
                <td className="p-4 text-center text-slate-600 font-bold text-lg">✕</td>
                <td className="p-4 text-center text-slate-600 font-bold text-lg">—</td>
                <td className="p-4 text-center">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-xs">✓</span>
                </td>
              </tr>
              <tr className="hover:bg-slate-900/10 transition-colors">
                <td className="p-4 font-medium text-slate-200">Performance Analytics</td>
                <td className="p-4 text-center text-slate-600 font-bold text-lg">✕</td>
                <td className="p-4 text-center text-slate-600 font-bold text-lg">—</td>
                <td className="p-4 text-center">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-xs">✓</span>
                </td>
              </tr>
              <tr className="hover:bg-slate-900/10 transition-colors">
                <td className="p-4 font-medium text-slate-200">Revision Tracking</td>
                <td className="p-4 text-center text-slate-600 font-bold text-lg">✕</td>
                <td className="p-4 text-center text-slate-600 font-bold text-lg">✕</td>
                <td className="p-4 text-center">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-xs">✓</span>
                </td>
              </tr>
              <tr className="hover:bg-slate-900/10 transition-colors">
                <td className="p-4 font-medium text-slate-200">UPSC-Specific Focus</td>
                <td className="p-4 text-center text-slate-600 font-bold text-lg">✕</td>
                <td className="p-4 text-center text-slate-600 font-bold text-lg">—</td>
                <td className="p-4 text-center">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-xs">✓</span>
                </td>
              </tr>
              <tr className="hover:bg-slate-900/10 transition-colors">
                <td className="p-4 font-medium text-slate-200">Mobile Friendly</td>
                <td className="p-4 text-center text-slate-600 font-bold text-lg">✕</td>
                <td className="p-4 text-center">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-xs">✓</span>
                </td>
                <td className="p-4 text-center">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-xs">✓</span>
                </td>
              </tr>
              <tr className="hover:bg-slate-900/10 transition-colors">
                <td className="p-4 font-medium text-slate-200">Execution Driven</td>
                <td className="p-4 text-center text-slate-600 font-bold text-lg">✕</td>
                <td className="p-4 text-center text-slate-600 font-bold text-lg">✕</td>
                <td className="p-4 text-center">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-xs">✓</span>
                </td>
              </tr>
              <tr className="hover:bg-slate-900/10 transition-colors">
                <td className="p-4 font-medium text-slate-200">Accountability Feed</td>
                <td className="p-4 text-center text-slate-600 font-bold text-lg">✕</td>
                <td className="p-4 text-center text-slate-600 font-bold text-lg">✕</td>
                <td className="p-4 text-center">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-xs">✓</span>
                </td>
              </tr>
              <tr className="hover:bg-slate-900/10 transition-colors">
                <td className="p-4 font-medium text-slate-200">Mock Analysis</td>
                <td className="p-4 text-center text-slate-600 font-bold text-lg">✕</td>
                <td className="p-4 text-center text-slate-600 font-bold text-lg">—</td>
                <td className="p-4 text-center">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-xs">✓</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── WHO NEEDS THIS APP SECTION ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-slate-900 bg-slate-950/20">
        <div className="text-center space-y-3 mb-16">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Built For You</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Who Is This For?</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {/* Card 1 */}
          <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-3xl space-y-4 hover:border-indigo-500/10 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-xl">
                🎓
              </div>
              <h3 className="font-bold text-white text-base">First-time Aspirants</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Overwhelmed by the vast syllabus? Log, Track & get a clear roadmap from day one, of what you are doing & how it is helping you.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-3xl space-y-4 hover:border-indigo-500/10 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-xl">
                💼
              </div>
              <h3 className="font-bold text-white text-base">Working Professionals</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Limited hours? Maximize every minute with structured daily targets and smart prioritization.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-3xl space-y-4 hover:border-indigo-500/10 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-xl">
                🔄
              </div>
              <h3 className="font-bold text-white text-base">Repeat Aspirants</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Know the syllabus but lack consistency? Use data to fill gaps and stay disciplined.
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-3xl space-y-4 hover:border-indigo-500/10 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-xl">
                🏆
              </div>
              <h3 className="font-bold text-white text-base">Rank-Focused Candidates</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Already putting in hours? Optimize with analytics, revision tracking, and mock deep-dives.
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-400 text-xs md:text-sm mt-12 leading-relaxed">
           <strong className="text-white font-semibold">If you're serious about cracking the exam you are preparing for, this is built for you.</strong>
        </p>
      </section>

      {/* ── FEATURES GRID SECTION ── */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-slate-900">
        
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Core Features</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Designed Specifically For Civil Services Aspirants
          </h3>
          <p className="text-slate-400 max-w-xl mx-auto text-sm">
            No generic task managers. Every feature inside the app addresses the unique complexities of civil services preparation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Day Sheet Card */}
          <div className="bg-slate-900/40 border border-slate-800 hover:border-indigo-500/20 p-6 rounded-3xl transition-all group">
            <span className="text-3xl block mb-4">📅</span>
            <h4 className="text-white font-bold text-lg mb-2">Day Sheet / Study Clock</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Log daily subject-wise study hours and topic-specific notes. Use the built-in stopwatch to clock your actual study sessions to keep your reports highly accurate.
            </p>
          </div>

          {/* Spaced Revision Card */}
          <div className="bg-slate-900/40 border border-slate-800 hover:border-indigo-500/20 p-6 rounded-3xl transition-all group">
            <span className="text-3xl block mb-4">🔄</span>
            <h4 className="text-white font-bold text-lg mb-2">Spaced Revision Logs</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Keep your revision rounds disciplined. Log when you complete revision stages (R1 to R5) to combat the forgetting curve of static content.
            </p>
          </div>

          {/* Mock Diagnostics Card */}
          <div className="bg-slate-900/40 border border-slate-800 hover:border-indigo-500/20 p-6 rounded-3xl transition-all group">
            <span className="text-3xl block mb-4">🎯</span>
            <h4 className="text-white font-bold text-lg mb-2">Mock Test Analytics</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Input test papers, evaluate your score details, accuracy percentages, and notes. Instantly plot estimated percentile trends and subject-wise diagnostics.
            </p>
          </div>

          {/* Current Affairs Log Card */}
          <div className="bg-slate-900/40 border border-slate-800 hover:border-indigo-500/20 p-6 rounded-3xl transition-all group">
            <span className="text-3xl block mb-4">📰</span>
            <h4 className="text-white font-bold text-lg mb-2">Current Affairs Repository</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Maintain a digital inventory of current affairs articles. Classify by priority, subject paper category, reading status, and export list reports.
            </p>
          </div>

          {/* Leaderboard & Community Card */}
          <div className="bg-slate-900/40 border border-slate-800 hover:border-indigo-500/20 p-6 rounded-3xl transition-all group">
            <span className="text-3xl block mb-4">🤝</span>
            <h4 className="text-white font-bold text-lg mb-2">Leaderboard & Feeds</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Learn in public. Post updates to the community feed, climb the weekly study hours leaderboard, and cheer on other aspirants to stay motivated.
            </p>
          </div>

          {/* Study Metrics Card */}
          <div className="bg-slate-900/40 border border-slate-800 hover:border-indigo-500/20 p-6 rounded-3xl transition-all group">
            <span className="text-3xl block mb-4">📈</span>
            <h4 className="text-white font-bold text-lg mb-2">Analytics & Wellbeing</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Analyze monthly charts of your study consistency, sleep hours, water intake, and mood logs to optimize your body and mind for the long preparation journey.
            </p>
          </div>

        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-slate-900">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-indigo-400">The Workflow</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            How The 30-Day Sprint Works
          </h3>
          <p className="text-slate-400 max-w-xl mx-auto text-sm">
            Simple steps to transition from disorganization to a highly disciplined preparation pattern.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div className="space-y-4 relative">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-sm">
              1
            </div>
            <h4 className="text-white font-bold text-base">Setup Your Targets</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Configure your upcoming exam date, target sprint names, and customize your subject lists in the settings panel to align with your focus.
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-sm">
              2
            </div>
            <h4 className="text-white font-bold text-base">Log Daily Activities</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              List the topics you study, notes/bookmarks, and time study hours using the active stopwatch. Register sleep and wellbeing metrics to track overall health.
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-sm">
              3
            </div>
            <h4 className="text-white font-bold text-base">Evaluate Performance</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Log mock tests, analyze test accuracy, track subject weaknesses, log current affairs, and monitor revision stages as they progress.
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-sm">
              4
            </div>
            <h4 className="text-white font-bold text-base">Build Habits & Connect</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              View habit consistency streaks on your dashboard, participate in the community board feed, cheer peers, and view leaderboard metrics.
            </p>
          </div>

        </div>
      </section>

      {/* ── PRICING SECTION ── */}
      <section id="pricing" className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-slate-900">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Plans</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Start Structuring Today
          </h3>
          <p className="text-slate-400 max-w-xl mx-auto text-sm">
            Get started for free or register your interest for advanced premium features in development.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Free Card */}
          <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <h4 className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Free Plan</h4>
              <div className="flex items-baseline gap-1 text-white">
                <span className="text-4xl font-extrabold font-mono">₹0</span>
                <span className="text-slate-500 text-sm">/ forever</span>
              </div>
              <p className="text-slate-400 text-xs">
                Perfect for individual aspirants looking to track their core subjects, daily hours, and mocks.
              </p>
              
              <ul className="space-y-3 pt-4 border-t border-slate-800 text-slate-300 text-xs">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> 30-Day Sprint core day sheet
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> Active study stopwatch log
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> Mock test performance diagnostics
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> Current Affairs inventory log
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> Public leaderboard & community feed
                </li>
              </ul>
            </div>

            {session ? (
              <Link
                to="/tracker"
                className="w-full text-center py-3 px-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl transition-all text-sm block"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                className="w-full text-center py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all text-sm block shadow-md shadow-indigo-600/10"
              >
                Get Started Free
              </Link>
            )}
          </div>

          {/* Premium Waitlist Card */}
          <div className="bg-indigo-950/10 border border-indigo-500/20 rounded-3xl p-8 flex flex-col justify-between space-y-8 relative">
            <div className="absolute top-4 right-4 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-wider py-1 px-2.5 rounded-full">
              In Development
            </div>

            <div className="space-y-4">
              <h4 className="text-indigo-400 text-sm font-semibold uppercase tracking-wider">Premium Features</h4>
              <div className="flex items-baseline gap-1 text-white">
                <span className="text-4xl font-extrabold font-mono">Coming Soon</span>
                <span className="text-slate-500 text-sm"></span>
              </div>
              <p className="text-slate-400 text-xs">
                Advanced features and analytics built to optimize full-scale study calendars and detailed micro-syllabus lists.
              </p>

              <ul className="space-y-3 pt-4 border-t border-slate-800 text-slate-300 text-xs">
                <li className="flex items-center gap-2 text-indigo-300/80">
                  <span className="text-indigo-400">★</span> Unlimited Sprints & Year-long planners
                </li>
                <li className="flex items-center gap-2 text-indigo-300/80">
                  <span className="text-indigo-400">★</span> AI-scheduled revision alerts & cycles
                </li>
                <li className="flex items-center gap-2 text-indigo-300/80">
                  <span className="text-indigo-400">★</span> Detailed Prelims & Mains micro-syllabus lists
                </li>
                <li className="flex items-center gap-2 text-indigo-300/80">
                  <span className="text-indigo-400">★</span> Advanced Mock error analytics & reports
                </li>
                <li className="flex items-center gap-2 text-indigo-300/80">
                  <span className="text-indigo-400">★</span> Custom study calendar export & calendar syncing
                </li>
              </ul>
            </div>

            <button
              onClick={() => triggerToast('Success! You have been added to the Pro Waitlist.')}
              className="w-full text-center py-3 px-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-all text-sm block"
            >
              Join Pro Waitlist
            </button>
          </div>

        </div>
      </section>
      

      {/* ── FAQS SECTION ── */}
      <section id="faqs" className="relative z-10 max-w-4xl mx-auto px-6 py-20 border-t border-slate-900">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Support</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-slate-900/30 border border-slate-800 rounded-2xl overflow-hidden transition-colors"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full py-5 px-6 flex items-center justify-between text-left focus:outline-none"
              >
                <span className="font-semibold text-white text-sm md:text-base">{faq.q}</span>
                <span className={`text-slate-500 font-bold transition-transform duration-200 ${activeFaq === idx ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              
              <div
                className={`transition-all duration-300 ease-in-out ${
                  activeFaq === idx ? 'max-h-60 border-t border-slate-800/50 opacity-100 py-4 px-6' : 'max-h-0 opacity-0 overflow-hidden'
                }`}
              >
                <p className="text-slate-400 text-xs md:text-sm leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CALL TO ACTION BANNER ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-16 mb-20">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-3xl border border-indigo-500/20 blur-sm pointer-events-none" />
        
        <div className="relative bg-slate-900/40 border border-slate-800 rounded-3xl p-8 md:p-12 text-center space-y-6 max-w-4xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Stop Planning In Chaos. Start Preparing In Structure.
          </h3>
          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto">
            Join other UPSC and State SPSC aspirants who have converted their preparation into a structured, highly analytical system. 13 of our users who used this tracker have qualified UPSC-CSE(P)-2026. Start your 30-Day Sprint today. 
          </p>

          <div className="pt-2">
            {session ? (
              <Link
                to="/tracker"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-lg shadow-indigo-600/30 text-sm"
              >
                <span>Go to Dashboard</span>
                <span>→</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-lg shadow-indigo-600/30 text-sm"
              >
                <span>Create Your Free Account</span>
                <span>→</span>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-900 bg-slate-950/50 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎯</span>
            <span className="font-bold text-white tracking-tight text-sm">My Prep Tracker</span>
          </div>

          <p className="text-slate-500 text-xs text-center md:text-right leading-relaxed">
            © {new Date().getFullYear()} My Prep Tracker. For support or queries, contact us at{' '}
            <a href="mailto:sudarshan.contactwebdev@gmail.com" className="text-slate-400 hover:underline">
              sudarshan.contactwebdev@gmail.com
            </a>
            <br />
            Disclaimer: This is a utility tracker tool designed for student preparation management purposes only.
          </p>
        </div>
      </footer>

    </div>
  )
}
