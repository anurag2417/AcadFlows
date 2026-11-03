import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  CreditCard,
  CheckCircle2,
  Sparkles,
  Smartphone,
  BrainCircuit,
  Camera,
  Zap,
  ArrowRight,
  ShieldCheck,
  Check,
  Search,
  ChevronDown,
  Layers,
  GraduationCap,
  Users,
  TrendingUp,
} from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import Logo from '../components/ui/Logo';

/* ─────────────────────────────────────────────────────────────
   INTERACTIVE MINI-ROSTER FOR ATTENDANCE WIDGET
   ───────────────────────────────────────────────────────────── */

interface RosterStudent {
  id: string;
  name: string;
  roll: string;
  status: 'present' | 'absent' | 'late';
}

const INITIAL_ROSTER: RosterStudent[] = [
  { id: '1', name: 'Aarav Patel', roll: '01', status: 'present' },
  { id: '2', name: 'Diya Sharma', roll: '02', status: 'present' },
  { id: '3', name: 'Kabir Mehta', roll: '03', status: 'absent' },
  { id: '4', name: 'Ananya Roy', roll: '04', status: 'present' },
];

const FAQS = [
  {
    q: 'How does AcadFlows isolate data between schools?',
    a: 'Each database query is cryptographically scoped with tenant context middleware and compound indexes. Cross-tenant leakage is mathematically impossible.',
  },
  {
    q: 'Can parents pay fees via UPI like Google Pay and PhonePe?',
    a: 'Yes. On mobile, parents tap "Pay Fees" and their UPI app launches with pre-filled amounts. On desktop, they scan a dynamic QR code for instant confirmation.',
  },
  {
    q: 'How does VisionFlow protect student facial privacy?',
    a: 'VisionFlow only computes non-reversible 512-d mathematical vector embeddings. Raw photos can be deleted after registration, and embeddings are encrypted with AES-256.',
  },
  {
    q: 'Can we import our existing student roster from Excel or CSV?',
    a: 'Yes. Our bulk import engine validates your CSV row-by-row in real time and imports hundreds of students in seconds with zero data loss.',
  },
];

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'admin' | 'teacher' | 'student' | 'parent'>('admin');
  const [roster, setRoster] = useState<RosterStudent[]>(INITIAL_ROSTER);
  const [studentCount, setStudentCount] = useState<number>(1200);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleStudentStatus = (id: string) => {
    setRoster(prev =>
      prev.map(s => {
        if (s.id !== id) return s;
        const nextStatus = s.status === 'present' ? 'absent' : s.status === 'absent' ? 'late' : 'present';
        return { ...s, status: nextStatus };
      }),
    );
  };

  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-background text-foreground selection:bg-primary-500 selection:text-white">
      {/* ─── Ambient Glow Mesh ─── */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[450px] w-full -translate-x-1/2 bg-gradient-to-b from-primary-500/20 via-secondary-500/10 to-transparent blur-[140px]" />
        <div className="absolute top-[50%] right-0 h-[350px] w-[450px] bg-accent-500/10 blur-[140px]" />
      </div>

      {/* ─── 100% Full-Width Clean Navbar ─── */}
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-surface/85 backdrop-blur-xl">
        <nav className="w-full flex h-16 items-center justify-between px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
          <Logo to="/" size="md" showText={true} textClassName="text-xl font-black tracking-tight" />

          {/* Quick Anchor Links */}
          <div className="hidden items-center gap-6 md:flex text-xs font-bold uppercase tracking-wider text-muted">
            <a href="#showcase" className="hover:text-foreground transition">Platform</a>
            <a href="#features" className="hover:text-foreground transition">Features</a>
            <a href="#innovations" className="hover:text-foreground transition">Roadmap</a>
            <a href="#calculator" className="hover:text-foreground transition">Impact</a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/login"
              className="rounded-xl border border-border px-4 py-2 text-xs font-bold text-foreground hover:bg-elevated transition"
            >
              Sign In
            </Link>
            <Link
              to="/school/register"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5 transition"
            >
              Get Started
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </nav>
      </header>

      {/* ─── 100% Full-Width Minimal Hero ─── */}
      <section className="w-full pt-12 pb-10 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 text-center">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-primary-500/20 bg-primary-500/10 px-3.5 py-1 text-xs font-bold text-primary-600 dark:text-primary-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Gen School Operating System</span>
        </div>

        {/* Minimal Hero Headline */}
        <h1 className="mt-5 text-4xl sm:text-6xl lg:text-7xl 2xl:text-8xl font-black tracking-tight">
          Run Your Entire School in{' '}
          <span className="bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 bg-clip-text text-transparent">
            Pure Flow.
          </span>
        </h1>

        {/* Ultra-Short 1-Line Subtitle */}
        <p className="mt-3 text-base sm:text-lg text-muted font-medium max-w-xl mx-auto">
          Academics, 10s Attendance, Timetables, UPI Fees, and AI. Zero paper, zero chaos.
        </p>

        {/* CTAs */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            to="/school/register"
            className="rounded-xl bg-primary-500 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-primary-500/25 hover:bg-primary-600 hover:-translate-y-0.5 transition"
          >
            Register School Free
          </Link>
          <Link
            to="/login"
            className="rounded-xl border border-border bg-surface px-6 py-3 text-xs sm:text-sm font-bold text-foreground hover:bg-elevated transition"
          >
            Explore Live Demo
          </Link>
        </div>

        {/* Live Feature Ticker */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-[11px] font-bold text-muted">
          <span className="rounded-full bg-elevated px-3 py-1 border border-border">⚡ 10s Roll-Call</span>
          <span className="rounded-full bg-elevated px-3 py-1 border border-border">📅 Zero Conflicts</span>
          <span className="rounded-full bg-elevated px-3 py-1 border border-border">💳 1-Click UPI</span>
          <span className="rounded-full bg-elevated px-3 py-1 border border-border">🛡️ Multi-Tenant Isolated</span>
        </div>
      </section>

      {/* ─── 100% Full-Width Interactive Stage ─── */}
      <section id="showcase" className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 pb-16">
        <div className="w-full rounded-3xl border border-border/80 bg-surface/90 p-4 sm:p-6 shadow-2xl backdrop-blur-2xl">
          {/* Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-500/80" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-xs font-mono text-muted hidden sm:inline">acadflows.app/campus-hub</span>
            </div>

            <div className="flex items-center gap-1.5 bg-background p-1 rounded-xl border border-border">
              {(['admin', 'teacher', 'student', 'parent'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-lg px-3 py-1 text-xs font-bold capitalize transition ${
                    activeTab === tab
                      ? 'bg-primary-500 text-white shadow-sm'
                      : 'text-muted hover:text-foreground'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Screen Content */}
          <div className="mt-6 w-full rounded-2xl border border-border bg-background p-5 sm:p-8">
            {activeTab === 'admin' && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black">Springfield Academy Dashboard</h3>
                    <p className="text-xs text-muted">Academic Term 2026–2027 • Active Session</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 text-xs font-bold flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      Campus Online
                    </span>
                  </div>
                </div>

                {/* Metric Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="rounded-2xl border border-border bg-surface p-4">
                    <p className="text-xs text-muted font-bold">Students</p>
                    <p className="text-2xl sm:text-3xl font-black text-foreground mt-1">1,420</p>
                    <p className="text-[11px] text-emerald-500 font-semibold mt-1">96.4% Present Today</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-surface p-4">
                    <p className="text-xs text-muted font-bold">Faculty</p>
                    <p className="text-2xl sm:text-3xl font-black text-foreground mt-1">86</p>
                    <p className="text-[11px] text-primary-500 font-semibold mt-1">0 Schedule Conflicts</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-surface p-4">
                    <p className="text-xs text-muted font-bold">Fee Collections</p>
                    <p className="text-2xl sm:text-3xl font-black text-foreground mt-1">₹42.8 L</p>
                    <p className="text-[11px] text-accent-500 font-semibold mt-1">84% On-Time (UPI)</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-surface p-4">
                    <p className="text-xs text-muted font-bold">Active Classes</p>
                    <p className="text-2xl sm:text-3xl font-black text-foreground mt-1">36 Sections</p>
                    <p className="text-[11px] text-muted font-semibold mt-1">Grades 1 through 12</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'teacher' && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black">Class 9-B Roll-Call Desk</h3>
                    <p className="text-xs text-muted">Tap any student to change status instantly</p>
                  </div>
                  <button className="rounded-xl bg-primary-500 px-4 py-2 text-xs font-bold text-white shadow-sm">
                    Submit 10s Roll-Call
                  </button>
                </div>

                {/* Interactive Roster */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {roster.map(st => (
                    <div
                      key={st.id}
                      onClick={() => toggleStudentStatus(st.id)}
                      className="cursor-pointer rounded-2xl border border-border bg-surface p-4 flex items-center justify-between hover:border-primary-500 transition select-none"
                    >
                      <div>
                        <p className="text-xs font-bold text-muted">Roll #{st.roll}</p>
                        <p className="text-sm font-black text-foreground mt-0.5">{st.name}</p>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${
                          st.status === 'present'
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                            : st.status === 'absent'
                            ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                            : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        {st.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'student' && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black">Aarav Patel • Student Portal</h3>
                    <p className="text-xs text-muted">Grade 9, Section B • Roll #01</p>
                  </div>
                  <span className="rounded-full bg-accent-500/10 text-accent-600 dark:text-accent-400 px-3 py-1 text-xs font-bold">
                    Term 1 GPA: 3.85 / 4.0
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-border bg-surface p-4">
                    <p className="text-xs text-muted font-bold">Upcoming Period</p>
                    <p className="text-lg font-black text-foreground mt-1">Physics Lab</p>
                    <p className="text-xs text-primary-500 mt-1">Room 204 • 10:15 AM</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-surface p-4">
                    <p className="text-xs text-muted font-bold">Homework Due</p>
                    <p className="text-lg font-black text-foreground mt-1">Cell Biology Report</p>
                    <p className="text-xs text-amber-500 mt-1">Due Tomorrow 5:00 PM</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-surface p-4">
                    <p className="text-xs text-muted font-bold">Attendance Score</p>
                    <p className="text-lg font-black text-foreground mt-1">98.2%</p>
                    <p className="text-xs text-emerald-500 mt-1">Honors Standing</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'parent' && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black">Parent Desk • Aarav Patel</h3>
                    <p className="text-xs text-muted">Real-Time Daily Transparency</p>
                  </div>
                  <button className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-white shadow-sm flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5" />
                    Pay Term 2 Fee (UPI)
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-border bg-surface p-4">
                    <p className="text-xs text-muted font-bold">Campus Check-In</p>
                    <p className="text-lg font-black text-emerald-500 mt-1">08:14 AM Today</p>
                    <p className="text-xs text-muted mt-1">Roll-Call Verified</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-surface p-4">
                    <p className="text-xs text-muted font-bold">Term 2 Invoice</p>
                    <p className="text-lg font-black text-amber-500 mt-1">₹35,000</p>
                    <p className="text-xs text-muted mt-1">Due in 10 Days</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-surface p-4">
                    <p className="text-xs text-muted font-bold">Latest Test Score</p>
                    <p className="text-lg font-black text-foreground mt-1">94 / 100</p>
                    <p className="text-xs text-accent-500 mt-1">Math Mid-Term (Grade A+)</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── 100% Full-Width Visual Bento Grid (Widget Style, Zero Fluff) ─── */}
      <section id="features" className="w-full py-12 border-t border-border/60 bg-surface/30 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="w-full mb-8">
          <h2 className="text-2xl sm:text-3xl font-black">Core School Engine</h2>
          <p className="text-xs sm:text-sm text-muted mt-1">Everything an institution needs, zero unnecessary complexity.</p>
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1 */}
          <div className="rounded-2xl border border-border bg-surface p-5 hover:border-primary-500/50 transition">
            <div className="flex items-center justify-between mb-3">
              <span className="p-2 rounded-xl bg-elevated text-primary-500"><Calendar className="w-5 h-5" /></span>
              <span className="text-[10px] font-bold uppercase text-muted">Academics</span>
            </div>
            <h4 className="text-base font-black">Calendar & Terms</h4>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="rounded-md bg-elevated px-2 py-0.5 text-[11px] font-semibold text-muted">Grades 1–12</span>
              <span className="rounded-md bg-elevated px-2 py-0.5 text-[11px] font-semibold text-muted">Sections A–D</span>
              <span className="rounded-md bg-elevated px-2 py-0.5 text-[11px] font-semibold text-muted">Elective Subjects</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-border bg-surface p-5 hover:border-amber-500/50 transition">
            <div className="flex items-center justify-between mb-3">
              <span className="p-2 rounded-xl bg-elevated text-amber-500"><Clock className="w-5 h-5" /></span>
              <span className="text-[10px] font-bold uppercase text-muted">Timetable</span>
            </div>
            <h4 className="text-base font-black">Conflict-Free Scheduler</h4>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 text-[11px] font-semibold">0 Collisions</span>
              <span className="rounded-md bg-elevated px-2 py-0.5 text-[11px] font-semibold text-muted">Room Sync</span>
              <span className="rounded-md bg-elevated px-2 py-0.5 text-[11px] font-semibold text-muted">Teacher Slots</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-border bg-surface p-5 hover:border-emerald-500/50 transition">
            <div className="flex items-center justify-between mb-3">
              <span className="p-2 rounded-xl bg-elevated text-emerald-500"><CheckCircle2 className="w-5 h-5" /></span>
              <span className="text-[10px] font-bold uppercase text-muted">Attendance</span>
            </div>
            <h4 className="text-base font-black">10-Second Roll-Call</h4>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="rounded-md bg-elevated px-2 py-0.5 text-[11px] font-semibold text-muted">One-Tap Present</span>
              <span className="rounded-md bg-elevated px-2 py-0.5 text-[11px] font-semibold text-muted">Auto Parent SMS</span>
              <span className="rounded-md bg-elevated px-2 py-0.5 text-[11px] font-semibold text-muted">Monthly CSVs</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="rounded-2xl border border-border bg-surface p-5 hover:border-accent-500/50 transition">
            <div className="flex items-center justify-between mb-3">
              <span className="p-2 rounded-xl bg-elevated text-accent-500"><CreditCard className="w-5 h-5" /></span>
              <span className="text-[10px] font-bold uppercase text-muted">Billing</span>
            </div>
            <h4 className="text-base font-black">Fee Invoices & Receipts</h4>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="rounded-md bg-elevated px-2 py-0.5 text-[11px] font-semibold text-muted">UPI QR Intent</span>
              <span className="rounded-md bg-elevated px-2 py-0.5 text-[11px] font-semibold text-muted">Installments</span>
              <span className="rounded-md bg-elevated px-2 py-0.5 text-[11px] font-semibold text-muted">PDF Receipts</span>
            </div>
          </div>

          {/* Card 5 */}
          <div className="rounded-2xl border border-border bg-surface p-5 hover:border-purple-500/50 transition">
            <div className="flex items-center justify-between mb-3">
              <span className="p-2 rounded-xl bg-elevated text-purple-500"><GraduationCap className="w-5 h-5" /></span>
              <span className="text-[10px] font-bold uppercase text-muted">LMS</span>
            </div>
            <h4 className="text-base font-black">Homework & Gradebook</h4>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="rounded-md bg-elevated px-2 py-0.5 text-[11px] font-semibold text-muted">Turn-in Desk</span>
              <span className="rounded-md bg-elevated px-2 py-0.5 text-[11px] font-semibold text-muted">Weighted GPAs</span>
              <span className="rounded-md bg-elevated px-2 py-0.5 text-[11px] font-semibold text-muted">Batch Report Cards</span>
            </div>
          </div>

          {/* Card 6 */}
          <div className="rounded-2xl border border-border bg-surface p-5 hover:border-rose-500/50 transition">
            <div className="flex items-center justify-between mb-3">
              <span className="p-2 rounded-xl bg-elevated text-rose-500"><ShieldCheck className="w-5 h-5" /></span>
              <span className="text-[10px] font-bold uppercase text-muted">Security</span>
            </div>
            <h4 className="text-base font-black">Multi-Tenant Vault</h4>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="rounded-md bg-elevated px-2 py-0.5 text-[11px] font-semibold text-muted">Zero Cross-Leaks</span>
              <span className="rounded-md bg-elevated px-2 py-0.5 text-[11px] font-semibold text-muted">FERPA / COPPA</span>
              <span className="rounded-md bg-elevated px-2 py-0.5 text-[11px] font-semibold text-muted">Bcrypt 12</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 100% Full-Width Upcoming Innovations ─── */}
      <section id="innovations" className="w-full py-12 border-t border-border/60 bg-background px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="w-full flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black">Upcoming Breakthroughs</h2>
            <p className="text-xs sm:text-sm text-muted mt-1">Our active engineering pipeline for mobile and AI.</p>
          </div>
          <span className="text-xs font-bold text-secondary-500">Phases 2 & 3</span>
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Innovation 1 */}
          <div className="rounded-2xl border border-border bg-surface p-4 flex flex-col justify-between">
            <div>
              <Smartphone className="w-6 h-6 text-primary-500 mb-2" />
              <h5 className="text-sm font-black">Mobile App Hub</h5>
              <p className="text-xs text-muted mt-1">1-on-1 parent chat, push notices, circulars.</p>
            </div>
            <span className="mt-4 text-[10px] font-bold uppercase text-primary-500">React Native</span>
          </div>

          {/* Innovation 2 */}
          <div className="rounded-2xl border border-border bg-surface p-4 flex flex-col justify-between">
            <div>
              <CreditCard className="w-6 h-6 text-emerald-500 mb-2" />
              <h5 className="text-sm font-black">1-Click UPI Fees</h5>
              <p className="text-xs text-muted mt-1">GPay, PhonePe native intent & instant receipts.</p>
            </div>
            <span className="mt-4 text-[10px] font-bold uppercase text-emerald-500">Razorpay / Stripe</span>
          </div>

          {/* Innovation 3 */}
          <div className="rounded-2xl border border-border bg-surface p-4 flex flex-col justify-between">
            <div>
              <BrainCircuit className="w-6 h-6 text-accent-500 mb-2" />
              <h5 className="text-sm font-black">Perplexity AI Hub</h5>
              <p className="text-xs text-muted mt-1">Q&A research with verified source citations.</p>
            </div>
            <span className="mt-4 text-[10px] font-bold uppercase text-accent-500">RAG Workspace</span>
          </div>

          {/* Innovation 4 */}
          <div className="rounded-2xl border border-border bg-surface p-4 flex flex-col justify-between">
            <div>
              <Layers className="w-6 h-6 text-amber-500 mb-2" />
              <h5 className="text-sm font-black">Shiksha Sathi</h5>
              <p className="text-xs text-muted mt-1">NCERT/CBSE question banks & AI homework.</p>
            </div>
            <span className="mt-4 text-[10px] font-bold uppercase text-amber-500">Free Curriculum Suite</span>
          </div>

          {/* Innovation 5 */}
          <div className="rounded-2xl border border-border bg-surface p-4 flex flex-col justify-between">
            <div>
              <Camera className="w-6 h-6 text-purple-500 mb-2" />
              <h5 className="text-sm font-black">VisionFlow Face AI</h5>
              <p className="text-xs text-muted mt-1">Classroom photo ➔ 5-sec roll-call.</p>
            </div>
            <span className="mt-4 text-[10px] font-bold uppercase text-purple-500">Computer Vision</span>
          </div>
        </div>
      </section>

      {/* ─── 100% Full-Width Dynamic ROI Impact ─── */}
      <section id="calculator" className="w-full py-12 border-t border-border/60 bg-surface/30 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="w-full rounded-3xl border border-border bg-background p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5">
              <h3 className="text-xl sm:text-2xl font-black">Campus Efficiency Calculator</h3>
              <p className="text-xs text-muted mt-1">See paper and hours eliminated at your school size.</p>

              <div className="mt-5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>Enrolled Students</span>
                  <span className="text-xl font-black text-primary-500">{studentCount.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="5000"
                  step="50"
                  value={studentCount}
                  onChange={e => setStudentCount(Number(e.target.value))}
                  className="mt-2 w-full accent-primary-500 h-2 bg-elevated rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-border bg-surface p-4 text-center">
                <p className="text-[11px] font-bold text-muted uppercase">Hours Saved</p>
                <p className="text-2xl sm:text-3xl font-black text-foreground mt-1">~{Math.round(studentCount * 0.24)}h</p>
              </div>
              <div className="rounded-2xl border border-border bg-surface p-4 text-center">
                <p className="text-[11px] font-bold text-muted uppercase">Paper Saved</p>
                <p className="text-2xl sm:text-3xl font-black text-foreground mt-1">~{(studentCount * 12).toLocaleString()}</p>
              </div>
              <div className="rounded-2xl border border-border bg-surface p-4 text-center">
                <p className="text-[11px] font-bold text-muted uppercase">Fee Pace</p>
                <p className="text-2xl sm:text-3xl font-black text-emerald-500 mt-1">3.4x</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 100% Full-Width Ultra-Compact FAQ ─── */}
      <section className="w-full py-12 border-t border-border/60 bg-background px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <h3 className="text-xl sm:text-2xl font-black mb-4">Quick Answers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="rounded-2xl border border-border bg-surface p-4">
              <p className="text-xs font-black text-foreground">{faq.q}</p>
              <p className="text-xs text-muted mt-1 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 100% Full-Width Conversion CTA ─── */}
      <section className="w-full py-12 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="w-full rounded-3xl bg-gradient-to-r from-primary-600 to-secondary-600 p-8 sm:p-12 text-center text-white shadow-xl">
          <h2 className="text-3xl sm:text-4xl font-black">Ready to Run Your School in Flow?</h2>
          <p className="mt-2 text-xs sm:text-sm text-white/90">Zero setup fee. Onboard your campus in minutes.</p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <Link
              to="/school/register"
              className="rounded-xl bg-white px-6 py-2.5 text-xs sm:text-sm font-bold text-primary-600 hover:bg-neutral-100 transition shadow-md"
            >
              Register School Free
            </Link>
            <Link
              to="/login"
              className="rounded-xl border border-white/40 bg-white/10 px-5 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-white/20 transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 100% Full-Width Footer ─── */}
      <footer className="w-full border-t border-border/80 bg-surface py-6 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="w-full flex flex-col sm:flex-row items-center justify-between text-xs text-muted gap-3">
          <div className="flex items-center gap-2">
            <Logo to="/" size="sm" showText={true} textClassName="text-sm font-bold" />
            <span className="text-muted/60">|</span>
            <span>© {new Date().getFullYear()} AcadFlows Inc.</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <Link to="/login" className="hover:text-foreground">Login</Link>
            <Link to="/school/register" className="hover:text-foreground">Register</Link>
            <a href="https://github.com/anurag2417/AcadFlows" target="_blank" rel="noreferrer" className="hover:text-foreground">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
