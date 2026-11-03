import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Smartphone,
  BrainCircuit,
  Camera,
  Zap,
  ArrowRight,
  ChevronDown,
  Activity,
  Layers,
  BookOpen,
  Bell,
  Check,
  FileText,
  Lock,
} from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import Logo, { LogoIcon } from '../components/ui/Logo';

/* ─────────────────────────────────────────────────────────────
   ROLE PREVIEWS DATA (Clean, Visual, Punchy)
   ───────────────────────────────────────────────────────────── */

type RoleKey = 'admin' | 'teacher' | 'student' | 'guardian' | 'platform';

interface RolePreview {
  id: RoleKey;
  label: string;
  badge: string;
  title: string;
  tagline: string;
  chips: string[];
  metrics: { label: string; value: string; color: string }[];
  actionBtn: string;
}

const ROLE_PREVIEWS: Record<RoleKey, RolePreview> = {
  admin: {
    id: 'admin',
    label: 'Principal / Admin',
    badge: 'Campus Command',
    title: 'Institutional Control Center',
    tagline: 'Admissions, staff allocations, conflict-free timetables, and fee structures.',
    chips: ['Conflict-Free Schedules', 'Bulk Admissions', 'Audit Logs', 'Fee Structures'],
    metrics: [
      { label: 'Enrolled Students', value: '1,420', color: 'text-primary-500' },
      { label: 'Today Attendance', value: '96.4%', color: 'text-emerald-500' },
      { label: 'Fees Collected', value: '₹42.8 L', color: 'text-amber-500' },
      { label: 'Active Faculty', value: '86', color: 'text-accent-500' },
    ],
    actionBtn: 'Open Admin Workspace',
  },
  teacher: {
    id: 'teacher',
    label: 'Educator',
    badge: 'Classroom Copilot',
    title: 'Fast Roll-Call & Smart Gradebook',
    tagline: '10-second class attendance, homework issuance, and continuous grading.',
    chips: ['10-Sec Roll Call', 'Rubric Grading', 'Live Roster', 'Automated Absentees'],
    metrics: [
      { label: 'Class Sections', value: '4 Active', color: 'text-primary-500' },
      { label: 'Roll-Call Today', value: 'Verified', color: 'text-emerald-500' },
      { label: 'Pending Submissions', value: '14', color: 'text-amber-500' },
      { label: 'Class Average', value: '88.5%', color: 'text-accent-500' },
    ],
    actionBtn: 'Launch Classroom Desk',
  },
  student: {
    id: 'student',
    label: 'Student',
    badge: 'Learning Hub',
    title: 'Personal Schedule & Homework Desk',
    tagline: 'Interactive daily timetables, instant assignment turn-in, and report cards.',
    chips: ['Daily Timetable', 'Instant Turn-in', 'GPA Analytics', 'Verified Report Card'],
    metrics: [
      { label: 'Next Class', value: 'Physics (Lab 2)', color: 'text-primary-500' },
      { label: 'Attendance Score', value: '98.2%', color: 'text-emerald-500' },
      { label: 'Homework Due', value: '1 Tomorrow', color: 'text-amber-500' },
      { label: 'Term Ranking', value: '#3 in Section', color: 'text-accent-500' },
    ],
    actionBtn: 'Open Student Desk',
  },
  guardian: {
    id: 'guardian',
    label: 'Parent',
    badge: 'Family Transparency',
    title: 'Real-Time Student Safety & Fees',
    tagline: 'Instant arrival notifications, academic marks, and 1-click UPI fee settlements.',
    chips: ['Arrival Alerts', '1-Click UPI Payment', 'Direct Teacher Chat', 'Live Marks'],
    metrics: [
      { label: 'Campus Arrival', value: '08:14 AM', color: 'text-emerald-500' },
      { label: 'Term 2 Fee Status', value: 'Due in 10d', color: 'text-amber-500' },
      { label: 'Latest Exam Score', value: '94 / 100', color: 'text-primary-500' },
      { label: 'Teacher Notes', value: 'Excellent Focus', color: 'text-accent-500' },
    ],
    actionBtn: 'Pay Term Fee (UPI)',
  },
  platform: {
    id: 'platform',
    label: 'Platform Founder',
    badge: 'Super-Admin',
    title: 'Multi-Tenant Governance Hub',
    tagline: 'Instant KYC approval, tenant status toggling, and global telemetry.',
    chips: ['Instant KYC', 'Zero Cross-Leak', 'Global Health', 'Tenant Freeze'],
    metrics: [
      { label: 'Partner Schools', value: '18 Active', color: 'text-primary-500' },
      { label: 'Cross-Tenant Users', value: '24,800+', color: 'text-emerald-500' },
      { label: 'System Uptime', value: '99.98%', color: 'text-accent-500' },
      { label: 'API Latency', value: '42 ms', color: 'text-purple-500' },
    ],
    actionBtn: 'Review Pending Schools',
  },
};

/* ─────────────────────────────────────────────────────────────
   VISUAL BENTO CARDS (Concise, Graphical)
   ───────────────────────────────────────────────────────────── */

const BENTO_FEATURES = [
  {
    icon: <Calendar className="w-5 h-5 text-primary-500" />,
    badge: 'Curriculum',
    title: 'Academic Structure',
    desc: 'Multi-year calendar modeling with seamless section branching and grading rubrics.',
    colSpan: 'col-span-12 md:col-span-6 lg:col-span-4',
  },
  {
    icon: <Clock className="w-5 h-5 text-amber-500" />,
    badge: 'Scheduling',
    title: 'Conflict-Free Timetables',
    desc: 'Algorithmic room and teacher sync that mathematically prevents double-booking.',
    colSpan: 'col-span-12 md:col-span-6 lg:col-span-4',
  },
  {
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    badge: 'Roll-Call',
    title: '10-Second Attendance',
    desc: 'Instant class roll-call with automated SMS/push alerts dispatched to absent parents.',
    colSpan: 'col-span-12 md:col-span-6 lg:col-span-4',
  },
  {
    icon: <CreditCard className="w-5 h-5 text-accent-500" />,
    badge: 'Billing',
    title: 'Fee Invoices & Receipts',
    desc: 'Itemized tuition, transport, and lab fee tracking with partial installments and PDF receipts.',
    colSpan: 'col-span-12 md:col-span-6 lg:col-span-4',
  },
  {
    icon: <BookOpen className="w-5 h-5 text-purple-500" />,
    badge: 'LMS Engine',
    title: 'Homework & Report Cards',
    desc: 'Continuous grading, assignment turn-in, and 1-click batch generation of official report cards.',
    colSpan: 'col-span-12 md:col-span-6 lg:col-span-4',
  },
  {
    icon: <Lock className="w-5 h-5 text-rose-500" />,
    badge: 'Sovereignty',
    title: 'Cryptographic Isolation',
    desc: 'Strict query-level tenant scoping, Bcrypt 12, and full FERPA/COPPA compliance.',
    colSpan: 'col-span-12 md:col-span-6 lg:col-span-4',
  },
];

/* ─────────────────────────────────────────────────────────────
   UPCOMING INNOVATIONS (Clean, High-Tech Pills)
   ───────────────────────────────────────────────────────────── */

const UPCOMING_INNOVATIONS = [
  {
    icon: <Smartphone className="w-6 h-6 text-primary-500" />,
    phase: 'Phase 3 • Cross-Platform',
    title: 'Native Mobile App & Chat',
    desc: 'Teacher-parent 1-on-1 messaging, digital circulars with read-receipts, and push alerts.',
    tag: 'React Native / FCM',
  },
  {
    icon: <CreditCard className="w-6 h-6 text-emerald-500" />,
    phase: 'Phase 2 • Web & Mobile',
    title: '1-Click UPI Fee Payments',
    desc: 'Native UPI intent (GPay, PhonePe, Paytm) with automated ledgers and instant tax receipts.',
    tag: 'Razorpay / Stripe',
  },
  {
    icon: <BrainCircuit className="w-6 h-6 text-accent-500" />,
    phase: 'Phase 2 • AI Workspace',
    title: 'Perplexity AI Research Hub',
    desc: 'Academic Q&A workspace with persistent threads, verified citations, and Socratic student tutor.',
    tag: 'RAG Pipeline / Citations',
  },
  {
    icon: <Layers className="w-6 h-6 text-amber-500" />,
    phase: 'Phase 2 • Social Good',
    title: 'Shiksha Sathi (NCERT/CBSE)',
    desc: 'Curated question banks for Classes 1–12 and 1-click AI homework generation at zero cost.',
    tag: 'NEP 2020 Aligned',
  },
  {
    icon: <Camera className="w-6 h-6 text-purple-500" />,
    phase: 'Phase 3 • Computer Vision',
    title: 'VisionFlow AI Face Attendance',
    desc: 'Teacher snaps a single classroom photo on mobile; AI matches and records 40+ students in 5s.',
    tag: 'RetinaFace / ArcFace',
  },
];

/* ─────────────────────────────────────────────────────────────
   FAQ DATA (Crisp)
   ───────────────────────────────────────────────────────────── */

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

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT (100% DISPLAY WIDTH • PUNCHY & VISUAL)
   ───────────────────────────────────────────────────────────── */

export default function LandingPage() {
  const [selectedRole, setSelectedRole] = useState<RoleKey>('admin');
  const [studentSlider, setStudentSlider] = useState<number>(1200);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const hoursSavedPerYear = Math.round(studentSlider * 0.24);
  const sheetsPaperSaved = Math.round(studentSlider * 12);

  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-background text-foreground selection:bg-primary-500 selection:text-white">
      {/* ─── Ambient Glow Mesh ─── */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-[500px] w-full -translate-x-1/2 bg-gradient-to-b from-primary-500/15 via-secondary-500/10 to-transparent blur-[120px]" />
        <div className="absolute top-[45%] right-0 h-[400px] w-[500px] bg-accent-500/10 blur-[140px]" />
        <div className="absolute top-[75%] left-0 h-[400px] w-[500px] bg-primary-500/10 blur-[140px]" />
      </div>

      {/* ─── 100% Full-Width Floating Header ─── */}
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-surface/85 backdrop-blur-xl">
        <nav className="w-full flex h-16 items-center justify-between px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
          <Logo to="/" size="md" showText={true} textClassName="text-xl font-black tracking-tight" />

          {/* Navigation Links */}
          <div className="hidden items-center gap-1 md:flex">
            <a href="#features" className="rounded-xl px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-muted hover:bg-elevated hover:text-foreground transition">
              Features
            </a>
            <a href="#showcase" className="rounded-xl px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-muted hover:bg-elevated hover:text-foreground transition">
              Portals
            </a>
            <a href="#innovations" className="rounded-xl px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-muted hover:bg-elevated hover:text-foreground transition">
              Roadmap
            </a>
            <a href="#calculator" className="rounded-xl px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-muted hover:bg-elevated hover:text-foreground transition">
              ROI
            </a>
            <a href="#faqs" className="rounded-xl px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-muted hover:bg-elevated hover:text-foreground transition">
              FAQs
            </a>
          </div>

          {/* Action Buttons */}
          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />
            <Link
              to="/login"
              className="rounded-xl border border-border px-4 py-2 text-xs font-bold text-foreground hover:bg-elevated transition"
            >
              Sign In
            </Link>
            <Link
              to="/school/register"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5 transition"
            >
              Register School
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-surface text-foreground"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full border-b border-border bg-surface px-6 py-4 md:hidden"
            >
              <div className="flex flex-col gap-2.5 font-semibold text-sm">
                <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-muted hover:text-foreground">Features</a>
                <a href="#showcase" onClick={() => setMobileMenuOpen(false)} className="text-muted hover:text-foreground">Role Portals</a>
                <a href="#innovations" onClick={() => setMobileMenuOpen(false)} className="text-muted hover:text-foreground">Upcoming Roadmap</a>
                <a href="#calculator" onClick={() => setMobileMenuOpen(false)} className="text-muted hover:text-foreground">ROI Calculator</a>
                <a href="#faqs" onClick={() => setMobileMenuOpen(false)} className="text-muted hover:text-foreground">FAQs</a>
                <div className="my-1.5 h-px bg-border" />
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-foreground">Sign In</Link>
                <Link to="/school/register" onClick={() => setMobileMenuOpen(false)} className="rounded-xl bg-primary-500 py-2.5 text-center font-bold text-white">
                  Register Your School
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ─── 100% Full-Width Hero Section ─── */}
      <section className="w-full pt-10 pb-16 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="w-full flex flex-col items-center text-center">
          {/* Top Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary-500/20 bg-primary-500/10 px-3.5 py-1 text-xs font-bold text-primary-600 dark:text-primary-400"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AcadFlows 2.0 • Modern School Operating System</span>
          </motion.div>

          {/* High-Impact Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-5 text-4xl sm:text-6xl lg:text-7xl 2xl:text-8xl font-black tracking-tight"
          >
            Run Your School in{' '}
            <span className="bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 bg-clip-text text-transparent">
              Pure Digital Flow.
            </span>
          </motion.h1>

          {/* Short 1-Line Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 max-w-2xl text-base sm:text-lg text-muted font-medium"
          >
            Unified multi-tenant software for academic calendars, 10-second attendance, conflict-free schedules, fee billing, and LMS gradebooks.
          </motion.p>

          {/* Quick CTA Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              to="/school/register"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary-500 to-secondary-500 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5 transition"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-2xl border border-border bg-surface px-6 py-3.5 text-sm font-bold text-foreground hover:bg-elevated transition"
            >
              Live Demo Sign In
            </Link>
          </motion.div>

          {/* 4 Feature Ticker Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-semibold text-muted">
            <span className="rounded-full bg-elevated px-3 py-1.5 border border-border/80">⚡ 10-Sec Roll Call</span>
            <span className="rounded-full bg-elevated px-3 py-1.5 border border-border/80">🛡️ Zero Cross-Tenant Leaks</span>
            <span className="rounded-full bg-elevated px-3 py-1.5 border border-border/80">📄 100% Paperless Ops</span>
            <span className="rounded-full bg-elevated px-3 py-1.5 border border-border/80">🚀 99.98% Cloud SLA</span>
          </div>
        </div>

        {/* ─── 100% Full-Width Interactive Workspace Preview ─── */}
        <div id="showcase" className="mt-12 w-full">
          <div className="w-full rounded-3xl border border-border/80 bg-surface/90 p-4 sm:p-6 lg:p-8 shadow-2xl backdrop-blur-2xl">
            {/* Role Switcher Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 border-b border-border pb-5">
              {(Object.keys(ROLE_PREVIEWS) as RoleKey[]).map(roleKey => {
                const item = ROLE_PREVIEWS[roleKey];
                const isActive = selectedRole === roleKey;
                return (
                  <button
                    key={roleKey}
                    onClick={() => setSelectedRole(roleKey)}
                    className={`relative rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-primary-500 text-white shadow-md shadow-primary-500/25'
                        : 'text-muted hover:bg-elevated hover:text-foreground'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Dynamic Screen Viewport */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedRole}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="mt-5 w-full rounded-2xl border border-border bg-background p-5 sm:p-8"
              >
                {/* Screen Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
                  <div>
                    <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary-500">
                      <Activity className="w-3.5 h-3.5" />
                      {ROLE_PREVIEWS[selectedRole].badge}
                    </div>
                    <h3 className="mt-1 text-2xl font-black">{ROLE_PREVIEWS[selectedRole].title}</h3>
                    <p className="mt-1 text-xs sm:text-sm text-muted">{ROLE_PREVIEWS[selectedRole].tagline}</p>
                  </div>
                  <button className="self-start sm:self-auto rounded-xl bg-primary-500 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-primary-500/25 hover:bg-primary-600 transition">
                    {ROLE_PREVIEWS[selectedRole].actionBtn}
                  </button>
                </div>

                {/* Live Metric Cards Grid */}
                <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {ROLE_PREVIEWS[selectedRole].metrics.map((m, i) => (
                    <div key={i} className="rounded-2xl border border-border/80 bg-surface p-4">
                      <p className="text-xs font-medium text-muted">{m.label}</p>
                      <p className={`mt-1.5 text-2xl sm:text-3xl font-black ${m.color}`}>{m.value}</p>
                    </div>
                  ))}
                </div>

                {/* Visual Chips Row */}
                <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-border/60">
                  {ROLE_PREVIEWS[selectedRole].chips.map((chip, cIdx) => (
                    <span
                      key={cIdx}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-elevated px-3 py-1.5 text-xs font-semibold text-muted"
                    >
                      <Check className="w-3.5 h-3.5 text-primary-500" />
                      {chip}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ─── 100% Full-Width Feature Bento Grid ─── */}
      <section id="features" className="w-full py-16 border-t border-border/60 bg-surface/30 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary-500">Core Engine</span>
            <h2 className="mt-1.5 text-3xl sm:text-4xl font-black">All Modules in One Place</h2>
          </div>
          <p className="text-sm text-muted max-w-md">
            Engineered to replace fragmented software with one unified school operating database.
          </p>
        </div>

        <div className="w-full grid grid-cols-12 gap-4 sm:gap-6">
          {BENTO_FEATURES.map((feat, idx) => (
            <div
              key={idx}
              className={`rounded-2xl border border-border/80 bg-surface p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-200 ${feat.colSpan}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-elevated">{feat.icon}</div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted">{feat.badge}</span>
              </div>
              <h3 className="text-lg font-black text-foreground">{feat.title}</h3>
              <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 100% Full-Width Upcoming Innovations ─── */}
      <section id="innovations" className="w-full py-16 border-t border-border/60 bg-background px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-secondary-500">Active Roadmap</span>
            <h2 className="mt-1.5 text-3xl sm:text-4xl font-black">Upcoming Breakthrough Features</h2>
          </div>
          <Link to="/school/register" className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-500 hover:text-primary-600">
            <span>Early Access Program</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {UPCOMING_INNOVATIONS.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-border/80 bg-surface p-5 flex flex-col justify-between hover:border-primary-500/60 hover:shadow-lg transition"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-elevated">{item.icon}</div>
                  <span className="rounded-md bg-elevated px-2 py-0.5 text-[10px] font-bold text-muted">{item.tag}</span>
                </div>
                <h4 className="text-base font-black text-foreground">{item.title}</h4>
                <p className="mt-2 text-xs text-muted leading-relaxed">{item.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-border/60 text-[11px] font-semibold text-primary-600 dark:text-primary-400">
                {item.phase}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 100% Full-Width Interactive Campus ROI Calculator ─── */}
      <section id="calculator" className="w-full py-16 border-t border-border/60 bg-surface/40 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="w-full rounded-3xl border border-border/80 bg-background p-6 sm:p-10 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Slider */}
            <div className="lg:col-span-5">
              <span className="text-xs font-bold uppercase tracking-widest text-primary-500">Live ROI Impact</span>
              <h3 className="mt-2 text-2xl sm:text-3xl font-black">Interactive Campus Calculator</h3>
              <p className="mt-2 text-xs sm:text-sm text-muted">
                Drag the student count to see annual administrative hours recovered and paper eliminated.
              </p>

              <div className="mt-6">
                <div className="flex items-center justify-between text-sm font-bold">
                  <span>Enrolled Students:</span>
                  <span className="text-2xl font-black text-primary-500">{studentSlider.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="5000"
                  step="50"
                  value={studentSlider}
                  onChange={e => setStudentSlider(Number(e.target.value))}
                  className="mt-3 w-full accent-primary-500 h-2 bg-elevated rounded-lg cursor-pointer"
                />
                <div className="mt-1.5 flex justify-between text-[11px] font-medium text-muted">
                  <span>100 Students</span>
                  <span>2,500</span>
                  <span>5,000+</span>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-2xl border border-border bg-surface p-5">
                <Clock className="w-6 h-6 text-primary-500 mb-2" />
                <p className="text-[11px] font-bold uppercase text-muted">Hours Saved</p>
                <p className="mt-1 text-2xl sm:text-3xl font-black text-foreground">~{hoursSavedPerYear}h</p>
                <p className="mt-1 text-[11px] text-muted">Manual registers eliminated</p>
              </div>

              <div className="rounded-2xl border border-border bg-surface p-5">
                <FileText className="w-6 h-6 text-emerald-500 mb-2" />
                <p className="text-[11px] font-bold uppercase text-muted">Paper Sheets</p>
                <p className="mt-1 text-2xl sm:text-3xl font-black text-foreground">~{sheetsPaperSaved.toLocaleString()}</p>
                <p className="mt-1 text-[11px] text-muted">Printed notices replaced</p>
              </div>

              <div className="rounded-2xl border border-border bg-surface p-5">
                <Zap className="w-6 h-6 text-amber-500 mb-2" />
                <p className="text-[11px] font-bold uppercase text-muted">Fee Settlement</p>
                <p className="mt-1 text-2xl sm:text-3xl font-black text-foreground">3.4x Faster</p>
                <p className="mt-1 text-[11px] text-muted">Via instant UPI reminders</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 100% Full-Width FAQ Section ─── */}
      <section id="faqs" className="w-full py-16 border-t border-border/60 bg-background px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="w-full mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-primary-500">Questions & Answers</span>
          <h2 className="mt-1 text-2xl sm:text-3xl font-black">Frequently Asked Questions</h2>
        </div>

        <div className="w-full space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div key={idx} className="rounded-2xl border border-border/80 bg-surface overflow-hidden">
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between p-5 text-left font-bold text-sm sm:text-base hover:bg-elevated/40 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-muted transition-transform ${isOpen ? 'rotate-180 text-primary-500' : ''}`} />
                </button>
                {isOpen && (
                  <div className="border-t border-border/60 px-5 pb-5 pt-3 text-xs sm:text-sm text-muted leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── 100% Full-Width Conversion Banner ─── */}
      <section className="w-full py-16 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="w-full rounded-3xl bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-600 p-8 sm:p-14 text-center text-white shadow-2xl">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">Ready to Run Your School in Flow?</h2>
          <p className="mt-3 text-sm sm:text-base text-white/90 max-w-xl mx-auto">
            Get started with zero installation. Onboard your campus today.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/school/register"
              className="rounded-xl bg-white px-7 py-3 text-xs sm:text-sm font-bold text-primary-600 shadow-lg hover:bg-neutral-100 transition"
            >
              Register Your School Free
            </Link>
            <Link
              to="/login"
              className="rounded-xl border border-white/40 bg-white/10 px-6 py-3 text-xs sm:text-sm font-bold text-white hover:bg-white/20 transition"
            >
              Existing Portal Login
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 100% Full-Width Footer ─── */}
      <footer className="w-full border-t border-border/80 bg-surface py-8 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="w-full flex flex-col sm:flex-row items-center justify-between text-xs text-muted gap-4">
          <div className="flex items-center gap-3">
            <Logo to="/" size="sm" showText={true} textClassName="text-sm font-bold" />
            <span className="text-muted/60">|</span>
            <span>© {new Date().getFullYear()} AcadFlows Inc.</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <Link to="/login" className="hover:text-foreground">Portal Login</Link>
            <Link to="/school/register" className="hover:text-foreground">Onboarding</Link>
            <a href="https://github.com/anurag2417/AcadFlows" target="_blank" rel="noreferrer" className="hover:text-foreground">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
