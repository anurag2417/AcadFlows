import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
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
  Users,
  ChevronRight,
  ArrowRight,
  School,
  FileSpreadsheet,
  MessageSquare,
  Lock,
  ChevronDown,
  Activity,
  Layers,
  BookOpen,
} from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import Logo, { LogoIcon } from '../components/ui/Logo';

/* ─────────────────────────────────────────────────────────────
   ROLE PREVIEWS DATA (Interactive Hero Showcase)
   ───────────────────────────────────────────────────────────── */

type RoleKey = 'admin' | 'teacher' | 'student' | 'guardian' | 'platform';

interface RolePreview {
  id: RoleKey;
  label: string;
  badge: string;
  headline: string;
  description: string;
  stats: { label: string; value: string; trend: string }[];
  actionPill: string;
  screenTitle: string;
}

const ROLE_PREVIEWS: Record<RoleKey, RolePreview> = {
  admin: {
    id: 'admin',
    label: 'School Admin',
    badge: 'Institutional Command',
    headline: 'Unified operational control across your entire campus',
    description: 'Admit students, manage teachers, generate conflict-free timetables, track fee invoices, and publish institution-wide circulars.',
    stats: [
      { label: 'Total Enrolled', value: '1,420', trend: '+12% this year' },
      { label: 'Today Attendance', value: '96.4%', trend: 'Class 9-A leading' },
      { label: 'Fees Collected', value: '₹42.8 L', trend: '84% on schedule' },
      { label: 'Active Staff', value: '86', trend: '0 schedule conflicts' },
    ],
    actionPill: 'Publish Academic Circular',
    screenTitle: 'Springfield Academy • Admin Operations Hub',
  },
  teacher: {
    id: 'teacher',
    label: 'Educator',
    badge: 'Classroom Copilot',
    headline: 'Zero-friction attendance, grading, and curriculum delivery',
    description: 'Mark classroom roll-call in 10 seconds, create rubric-aligned assignments, grade submissions with AI feedback, and monitor rosters.',
    stats: [
      { label: 'Assigned Classes', value: '4 Sections', trend: 'Grades 8 & 9' },
      { label: 'Roll-Call Today', value: 'Completed', trend: '08:42 AM verified' },
      { label: 'Assignments Due', value: '3 Active', trend: '48 submissions pending' },
      { label: 'Avg Class GPA', value: '3.78 / 4.0', trend: '+0.3 improvement' },
    ],
    actionPill: 'Mark Today Roll-Call',
    screenTitle: 'Prof. Sharma • Science Faculty Dashboard',
  },
  student: {
    id: 'student',
    label: 'Student',
    badge: 'Learning Portal',
    headline: 'Every class schedule, homework task, and grade in your pocket',
    description: 'Never miss a laboratory submission, review interactive timetables, monitor personal attendance scores, and download verified term report cards.',
    stats: [
      { label: 'Upcoming Class', value: 'Physics (Lab 2)', trend: 'Starts in 15 mins' },
      { label: 'Attendance Score', value: '98.2%', trend: 'Eligible for honors' },
      { label: 'Pending Tasks', value: '1 Assignment', trend: 'Due tomorrow 5 PM' },
      { label: 'Term Ranking', value: '#3 in Section', trend: 'Top 5 percentile' },
    ],
    actionPill: 'Submit Bio Lab Report',
    screenTitle: 'Aarav Patel • Class 9-B Student Desk',
  },
  guardian: {
    id: 'guardian',
    label: 'Parent',
    badge: 'Family Transparency',
    headline: 'Real-time peace of mind for your child’s academic journey',
    description: 'Receive instant arrival roll-call notifications, inspect test marks, settle school fees in 1-click via UPI, and message class teachers directly.',
    stats: [
      { label: 'Arrival Status', value: 'Present', trend: 'Checked in 08:14 AM' },
      { label: 'Next Due Fee', value: 'Term 2 Tuition', trend: 'Due in 12 days' },
      { label: 'Latest Score', value: '94 / 100', trend: 'Mathematics Mid-Term' },
      { label: 'Teacher Remarks', value: 'Consistent', trend: 'Excellent focus' },
    ],
    actionPill: 'Pay Term Fee (1-Click UPI)',
    screenTitle: 'Parent Portal • Aarav Patel (Class 9-B)',
  },
  platform: {
    id: 'platform',
    label: 'Platform Founder',
    badge: 'Super-Admin Console',
    headline: 'Multi-tenant sovereignty, KYC verification, and platform telemetry',
    description: 'Verify new school registrations, review accreditation documents, monitor cross-tenant system load, and audit platform security logs.',
    stats: [
      { label: 'Partner Schools', value: '18 Active', trend: '4 awaiting KYC' },
      { label: 'Platform Users', value: '24,800+', trend: 'Across 6 states' },
      { label: 'System Uptime', value: '99.98%', trend: 'Zero tenant leaks' },
      { label: 'API Latency', value: '42 ms', trend: 'Optimal edge routing' },
    ],
    actionPill: 'Review Pending Schools',
    screenTitle: 'AcadFlows Founder Super-Admin Command Hub',
  },
};

/* ─────────────────────────────────────────────────────────────
   BENEFITS & BENTO FEATURES
   ───────────────────────────────────────────────────────────── */

const BENTO_FEATURES = [
  {
    icon: <Calendar className="w-6 h-6 text-primary-500" />,
    tag: 'Academic Architecture',
    title: 'Hierarchical Curricula & Terms',
    description: 'Multi-year calendar modeling with seamless section branching, grading rubrics, and automated academic progression.',
    span: 'col-span-12 lg:col-span-7',
    gradient: 'from-primary-500/10 via-transparent to-transparent',
  },
  {
    icon: <CheckCircle2 className="w-6 h-6 text-emerald-500" />,
    tag: 'Roll-Call Engine',
    title: 'Attendance in Under 10 Seconds',
    description: 'Fast grid roll-call with automated SMS/push notification alerts to parents for absent students.',
    span: 'col-span-12 lg:col-span-5',
    gradient: 'from-emerald-500/10 via-transparent to-transparent',
  },
  {
    icon: <Clock className="w-6 h-6 text-amber-500" />,
    tag: 'Conflict-Free Schedules',
    title: 'Intelligent Timetable Generation',
    description: 'Algorithmic room allocation and teacher schedule synchronization that mathematically prevents double-booking.',
    span: 'col-span-12 lg:col-span-5',
    gradient: 'from-amber-500/10 via-transparent to-transparent',
  },
  {
    icon: <CreditCard className="w-6 h-6 text-accent-500" />,
    tag: 'Financial Infrastructure',
    title: 'Transparent Invoicing & Fees',
    description: 'Categorized tuition, transportation, and lab fee structures with partial installment tracking and instant digital receipts.',
    span: 'col-span-12 lg:col-span-7',
    gradient: 'from-accent-500/10 via-transparent to-transparent',
  },
  {
    icon: <BookOpen className="w-6 h-6 text-purple-500" />,
    tag: 'Assignments & LMS',
    title: 'Gradebooks & Report Cards',
    description: 'Digital homework submissions, continuous assessment tracking, and 1-click batch generation of official printable report cards.',
    span: 'col-span-12 lg:col-span-6',
    gradient: 'from-purple-500/10 via-transparent to-transparent',
  },
  {
    icon: <Lock className="w-6 h-6 text-rose-500" />,
    tag: 'Bank-Grade Security',
    title: 'Cryptographic Multi-Tenancy',
    description: 'Strict query-level tenant isolation, Bcrypt work factor 12, httpOnly refresh rotation, and FERPA/COPPA compliant architecture.',
    span: 'col-span-12 lg:col-span-6',
    gradient: 'from-rose-500/10 via-transparent to-transparent',
  },
];

/* ─────────────────────────────────────────────────────────────
   UPCOMING INNOVATIONS SHOWCASE (Phase 2 & 3 Preview)
   ───────────────────────────────────────────────────────────── */

const UPCOMING_INNOVATIONS = [
  {
    icon: <Smartphone className="w-7 h-7 text-primary-500" />,
    badge: 'Phase 3 • Cross-Platform',
    title: 'Native Mobile Communication Hub',
    description: 'Direct teacher-parent 1-on-1 messaging, push alerts, digital school circulars with read acknowledgments, and emergency broadcast dispatches.',
    tags: ['React Native', 'FCM Push', 'WebSockets', 'Office Hours Guard'],
  },
  {
    icon: <CreditCard className="w-7 h-7 text-emerald-500" />,
    badge: 'Phase 2 • Web & Mobile',
    title: 'Omnichannel 1-Click UPI Fee Payments',
    description: 'Frictionless tuition payment via Google Pay, PhonePe, Paytm, and credit cards with instant GST-compliant PDF receipts.',
    tags: ['Razorpay / Stripe', 'UPI Intent', 'Automated Ledgers', 'Auto-Reminders'],
  },
  {
    icon: <BrainCircuit className="w-7 h-7 text-accent-500" />,
    badge: 'Phase 2 • AI Engine',
    title: 'Perplexity AI Academic Workspace',
    description: 'Full-stack AI research assistant for students and teachers featuring persistent threads, verified source citations, and Socratic tutoring.',
    tags: ['RAG Pipeline', 'Citation Cards', 'Safe Search', 'Lesson Planner'],
  },
  {
    icon: <BookOpen className="w-7 h-7 text-amber-500" />,
    badge: 'Phase 2 • Social Good',
    title: 'Shiksha Sathi (NCERT / CBSE Suite)',
    description: 'Curated question banks for Classes 1–12, Bloom taxonomy tagging, and 1-click AI homework generation provided at zero cost to Indian educators.',
    tags: ['CBSE Aligned', 'NEP 2020', 'Hindi & English', '1-Click Homework'],
  },
  {
    icon: <Camera className="w-7 h-7 text-purple-500" />,
    badge: 'Phase 3 • Computer Vision',
    title: 'VisionFlow: AI Group Face Attendance',
    description: 'Teacher snaps a single classroom photo from mobile; multi-face vector matching records roll-call for 40+ students in under 5 seconds.',
    tags: ['YOLOv8-Face', 'ArcFace Embeddings', '5-Second Roll-Call', 'Instant Alerts'],
  },
];

/* ─────────────────────────────────────────────────────────────
   FAQ DATA
   ───────────────────────────────────────────────────────────── */

const FAQS = [
  {
    question: 'How does AcadFlows ensure one school’s data never leaks to another?',
    answer: 'AcadFlows implements logical multi-tenancy backed by strict query-level scoping and compound database indexing. Every database mutation is partitioned by tenant ID via our kernel middleware. Cross-tenant leakage is mathematically impossible.',
  },
  {
    question: 'Can parents pay fees via UPI like Google Pay and PhonePe?',
    answer: 'Yes! Our digital payment gateway supports direct UPI intent. On mobile, parents tap "Pay Fees" and their preferred UPI app launches automatically with pre-filled amounts. On desktop, they can scan an instant dynamic QR code.',
  },
  {
    question: 'How does VisionFlow AI Face Attendance protect student privacy?',
    answer: 'VisionFlow only extracts mathematical 512-dimensional vector representations (embeddings). Raw facial photographs can be purged after embedding generation, and vectors cannot be reverse-engineered back into photos. Biometric data is encrypted at rest.',
  },
  {
    question: 'Can our school onboard existing student records from Excel or CSV?',
    answer: 'Absolutely. AcadFlows includes a bulk import engine with real-time row-by-row validation. Upload your existing student and teacher roster, review validation suggestions, and import hundreds of records in seconds.',
  },
  {
    question: 'Does AcadFlows work seamlessly on budget mobile phones?',
    answer: 'Yes. AcadFlows is built with a responsive single-device fluid architecture. Whether accessed on a low-bandwidth 4G smartphone, an iPad, or a high-resolution desktop screen, every workflow adapts with zero layout disruption.',
  },
];

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
   ───────────────────────────────────────────────────────────── */

export default function LandingPage() {
  const [selectedRole, setSelectedRole] = useState<RoleKey>('admin');
  const [studentSlider, setStudentSlider] = useState<number>(1200);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dynamic ROI calculation
  const hoursSavedPerYear = Math.round(studentSlider * 0.24);
  const sheetsPaperSaved = Math.round(studentSlider * 12);
  const feeCollectionRate = '3.4x Faster';

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground selection:bg-primary-500 selection:text-white">
      {/* ─── Ambient Glow Blobs ─── */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-primary-500/15 via-secondary-500/10 to-accent-500/10 blur-[130px] dark:from-primary-500/20 dark:via-secondary-500/15 dark:to-transparent" />
        <div className="absolute top-[40%] -right-40 h-[500px] w-[500px] rounded-full bg-accent-500/10 blur-[140px]" />
        <div className="absolute top-[70%] -left-40 h-[500px] w-[500px] rounded-full bg-primary-500/10 blur-[140px]" />
      </div>

      {/* ─── Floating Glassmorphic Navbar ─── */}
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-surface/80 backdrop-blur-xl transition-colors">
        <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo to="/" size="md" showText={true} textClassName="text-[22px] font-black tracking-tight" />

          {/* Desktop Navigation Links */}
          <div className="hidden items-center gap-1 md:flex">
            <a href="#features" className="rounded-xl px-3.5 py-2 text-sm font-semibold text-muted transition hover:bg-elevated hover:text-foreground">
              Features
            </a>
            <a href="#showcase" className="rounded-xl px-3.5 py-2 text-sm font-semibold text-muted transition hover:bg-elevated hover:text-foreground">
              Role Portals
            </a>
            <a href="#innovations" className="rounded-xl px-3.5 py-2 text-sm font-semibold text-muted transition hover:bg-elevated hover:text-foreground">
              Upcoming Innovations
            </a>
            <a href="#calculator" className="rounded-xl px-3.5 py-2 text-sm font-semibold text-muted transition hover:bg-elevated hover:text-foreground">
              ROI Calculator
            </a>
            <a href="#faqs" className="rounded-xl px-3.5 py-2 text-sm font-semibold text-muted transition hover:bg-elevated hover:text-foreground">
              FAQs
            </a>
          </div>

          {/* Actions & Theme */}
          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />
            <Link
              to="/login"
              className="rounded-xl border border-border px-4 py-2.5 text-sm font-bold text-foreground transition hover:bg-elevated"
            >
              Sign In
            </Link>
            <Link
              to="/school/register"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary-500/25 transition hover:shadow-primary-500/40 hover:-translate-y-0.5"
            >
              Register School
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-surface text-foreground"
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
              className="border-b border-border bg-surface px-6 py-5 md:hidden"
            >
              <div className="flex flex-col gap-3 font-semibold">
                <a href="#features" onClick={() => setMobileMenuOpen(false)} className="py-1.5 text-muted hover:text-foreground">Features</a>
                <a href="#showcase" onClick={() => setMobileMenuOpen(false)} className="py-1.5 text-muted hover:text-foreground">Role Portals</a>
                <a href="#innovations" onClick={() => setMobileMenuOpen(false)} className="py-1.5 text-muted hover:text-foreground">Innovations</a>
                <a href="#calculator" onClick={() => setMobileMenuOpen(false)} className="py-1.5 text-muted hover:text-foreground">Calculator</a>
                <a href="#faqs" onClick={() => setMobileMenuOpen(false)} className="py-1.5 text-muted hover:text-foreground">FAQs</a>
                <div className="my-2 h-px bg-border" />
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="py-1.5 text-foreground">Sign In</Link>
                <Link to="/school/register" onClick={() => setMobileMenuOpen(false)} className="rounded-xl bg-primary-500 py-3 text-center font-bold text-white">
                  Register Your School
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ─── Hero Section ─── */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary-500/20 bg-primary-500/10 px-4 py-1.5 text-xs font-bold text-primary-600 dark:text-primary-400 backdrop-blur-md"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AcadFlows 2.0 • The Modern School Operating System</span>
            </motion.div>

            {/* Kinetic Hero Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-6 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl"
            >
              Where school operations meet{' '}
              <span className="bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 bg-clip-text text-transparent">
                flawless digital flow.
              </span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 max-w-2xl text-lg text-muted sm:text-xl leading-relaxed"
            >
              Unify academic terms, conflict-free timetables, 10-second attendance, student dossiers, automated report cards, and fee billing into one unified workspace.
            </motion.p>

            {/* Action CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-col gap-4 sm:flex-row items-center"
            >
              <Link
                to="/school/register"
                className="group inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-primary-500 via-primary-600 to-secondary-500 px-8 py-4 text-base font-bold text-white shadow-xl shadow-primary-500/25 transition hover:shadow-primary-500/40 hover:-translate-y-1"
              >
                Onboard Your School
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-surface px-8 py-4 text-base font-bold text-foreground transition hover:bg-elevated hover:-translate-y-0.5 shadow-sm"
              >
                Access Portal Login
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-muted"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Zero Installation • Cloud-Hosted</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary-500" />
                <span>Strict Cryptographic Multi-Tenancy</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>99.9% Production SLA</span>
              </div>
            </motion.div>
          </div>

          {/* ─── Interactive Role Showcase Section ─── */}
          <div id="showcase" className="mt-16 sm:mt-24">
            <div className="rounded-3xl border border-border/80 bg-surface/90 p-4 shadow-2xl backdrop-blur-2xl sm:p-6 lg:p-8">
              {/* Role Selector Tabs */}
              <div className="flex flex-wrap items-center justify-center gap-2 border-b border-border pb-6">
                {(Object.keys(ROLE_PREVIEWS) as RoleKey[]).map(roleKey => {
                  const item = ROLE_PREVIEWS[roleKey];
                  const isActive = selectedRole === roleKey;
                  return (
                    <button
                      key={roleKey}
                      onClick={() => setSelectedRole(roleKey)}
                      className={`relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
                        isActive
                          ? 'bg-primary-500 text-white shadow-md shadow-primary-500/25'
                          : 'text-muted hover:bg-elevated hover:text-foreground'
                      }`}
                    >
                      {item.label}
                      {isActive && (
                        <motion.div
                          layoutId="activeRoleIndicator"
                          className="absolute inset-0 -z-10 rounded-xl bg-primary-500"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Screen Preview Mockup */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedRole}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6"
                >
                  {/* Browser Chrome Header */}
                  <div className="flex items-center justify-between border-b border-border bg-background px-4 py-3 rounded-t-2xl">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                      <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                      <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                      <span className="ml-3 text-xs font-mono text-muted hidden sm:inline">
                        {ROLE_PREVIEWS[selectedRole].screenTitle}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-500/10 px-3 py-1 text-xs font-bold text-primary-600 dark:text-primary-400">
                        <Activity className="w-3.5 h-3.5" />
                        {ROLE_PREVIEWS[selectedRole].badge}
                      </span>
                    </div>
                  </div>

                  {/* Viewport Dashboard Body */}
                  <div className="bg-background/80 p-6 sm:p-8 rounded-b-2xl border-x border-b border-border">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-border/60">
                      <div>
                        <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                          {ROLE_PREVIEWS[selectedRole].headline}
                        </h3>
                        <p className="mt-1.5 text-sm text-muted max-w-2xl">
                          {ROLE_PREVIEWS[selectedRole].description}
                        </p>
                      </div>
                      <button className="self-start lg:self-auto rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary-500/20 hover:bg-primary-600 transition">
                        {ROLE_PREVIEWS[selectedRole].actionPill}
                      </button>
                    </div>

                    {/* Stats Metrics Cards */}
                    <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                      {ROLE_PREVIEWS[selectedRole].stats.map((stat, idx) => (
                        <div key={idx} className="rounded-2xl border border-border/80 bg-surface p-4 shadow-sm">
                          <p className="text-xs font-semibold text-muted">{stat.label}</p>
                          <p className="mt-1.5 text-2xl font-black text-foreground">{stat.value}</p>
                          <p className="mt-1 text-xs font-medium text-primary-600 dark:text-primary-400">{stat.trend}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Bento Grid Core Architecture Features ─── */}
      <section id="features" className="py-20 border-t border-border/60 bg-surface/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-500">Core Foundations</span>
            <h2 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight">
              Engineered for academic precision.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-muted">
              Built on verified educational best practices to eliminate paperwork, scheduling collisions, and manual data errors.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-12 gap-6">
            {BENTO_FEATURES.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`relative overflow-hidden rounded-3xl border border-border/80 bg-surface p-8 shadow-sm transition hover:shadow-xl hover:-translate-y-1 ${feature.span}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} pointer-events-none`} />
                <div className="relative z-10">
                  <div className="mb-4 inline-flex p-3 rounded-2xl bg-elevated shadow-sm">
                    {feature.icon}
                  </div>
                  <span className="block text-xs font-bold uppercase tracking-wider text-muted">
                    {feature.tag}
                  </span>
                  <h3 className="mt-2 text-xl sm:text-2xl font-black tracking-tight text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm sm:text-base text-muted leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Upcoming Innovations Showcase (Phase 2 & 3) ─── */}
      <section id="innovations" className="py-20 border-t border-border/60 bg-background relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-secondary-500">
                What’s Coming Next • The Horizon
              </span>
              <h2 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight">
                Upcoming breakthrough innovations.
              </h2>
              <p className="mt-4 text-base sm:text-lg text-muted">
                Our active engineering roadmap: from mobile push communications and 1-click UPI fee settlements to classroom AI face attendance.
              </p>
            </div>
            <Link
              to="/school/register"
              className="inline-flex items-center gap-2 text-sm font-bold text-primary-500 hover:text-primary-600 transition"
            >
              <span>Join our early access program</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {UPCOMING_INNOVATIONS.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative flex flex-col justify-between rounded-3xl border border-border/80 bg-surface p-7 shadow-sm transition hover:shadow-2xl hover:border-primary-500/50 hover:-translate-y-1.5"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-elevated shadow-sm">
                      {item.icon}
                    </div>
                    <span className="rounded-full bg-elevated px-3 py-1 text-xs font-bold text-muted">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-black tracking-tight text-foreground group-hover:text-primary-500 transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm text-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-border/60">
                  {item.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="rounded-lg bg-background px-2.5 py-1 text-[11px] font-semibold text-muted border border-border/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Interactive Campus ROI & Impact Calculator ─── */}
      <section id="calculator" className="py-20 border-t border-border/60 bg-surface/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-border/80 bg-background p-8 sm:p-12 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6">
                <span className="text-xs font-bold uppercase tracking-widest text-primary-500">
                  Real Institutional Impact
                </span>
                <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight">
                  Calculate your school’s annual time & paper savings.
                </h2>
                <p className="mt-4 text-base text-muted leading-relaxed">
                  Adjust the student enrollment slider to see tangible administrative hours recovered and operational expenses eliminated across your campus.
                </p>

                {/* Slider Input */}
                <div className="mt-8">
                  <div className="flex items-center justify-between font-bold">
                    <label htmlFor="student-slider" className="text-sm text-foreground">
                      Total Enrolled Students:
                    </label>
                    <span className="text-2xl font-black text-primary-500">
                      {studentSlider.toLocaleString()}
                    </span>
                  </div>
                  <input
                    id="student-slider"
                    type="range"
                    min="100"
                    max="5000"
                    step="50"
                    value={studentSlider}
                    onChange={e => setStudentSlider(Number(e.target.value))}
                    className="mt-4 w-full accent-primary-500 h-2 bg-elevated rounded-lg cursor-pointer"
                  />
                  <div className="mt-2 flex justify-between text-xs font-semibold text-muted">
                    <span>100 Students</span>
                    <span>2,500</span>
                    <span>5,000+ Students</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Result Cards */}
              <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-border bg-surface p-6">
                  <Clock className="w-7 h-7 text-primary-500 mb-2" />
                  <p className="text-xs font-bold uppercase text-muted">Teacher Hours Saved</p>
                  <p className="mt-2 text-3xl font-black text-foreground">
                    ~{hoursSavedPerYear.toLocaleString()} hrs
                  </p>
                  <p className="mt-1 text-xs text-muted">Eliminates manual registers & tallying</p>
                </div>

                <div className="rounded-2xl border border-border bg-surface p-6">
                  <FileSpreadsheet className="w-7 h-7 text-emerald-500 mb-2" />
                  <p className="text-xs font-bold uppercase text-muted">Paper Sheets Saved</p>
                  <p className="mt-2 text-3xl font-black text-foreground">
                    ~{sheetsPaperSaved.toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs text-muted">Printed circulars & fee notices eliminated</p>
                </div>

                <div className="rounded-2xl border border-border bg-surface p-6 sm:col-span-2">
                  <Zap className="w-7 h-7 text-amber-500 mb-2" />
                  <p className="text-xs font-bold uppercase text-muted">Fee Collection Acceleration</p>
                  <p className="mt-2 text-3xl font-black text-foreground">{feeCollectionRate}</p>
                  <p className="mt-1 text-xs text-muted">
                    Digital UPI payment reminders accelerate fee ledger settlements by 3x compared to manual cash/cheque runs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Frequently Asked Questions (FAQ) ─── */}
      <section id="faqs" className="py-20 border-t border-border/60 bg-surface/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-500">Transparency First</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight">
              Frequently asked questions.
            </h2>
            <p className="mt-3 text-base text-muted">
              Everything you need to know about AcadFlows architecture, data privacy, and onboarding.
            </p>
          </div>

          <div className="mt-12 space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-border/80 bg-surface overflow-hidden transition shadow-sm"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between p-6 text-left font-bold text-foreground hover:bg-elevated/50 transition-colors"
                  >
                    <span className="text-base sm:text-lg">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-muted transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-primary-500' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="border-t border-border/60 px-6 pb-6 pt-4 text-sm text-muted leading-relaxed"
                      >
                        {faq.answer}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── High-Conversion Bottom Banner ─── */}
      <section className="py-20 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-600 p-10 sm:p-16 text-center text-white shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),_transparent)] pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5" />
                Transform Your School Operations
              </span>

              <h2 className="mt-6 text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                Ready to run your school with digital flow?
              </h2>

              <p className="mt-6 text-base sm:text-lg text-white/90 leading-relaxed">
                Join modern educational institutions simplifying academics, student records, fee collection, and community communication.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/school/register"
                  className="w-full sm:w-auto rounded-2xl bg-white px-8 py-4 text-base font-bold text-primary-600 shadow-xl transition hover:bg-neutral-100 hover:-translate-y-1"
                >
                  Register Your School Free
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto rounded-2xl border border-white/40 bg-white/10 px-8 py-4 text-base font-bold text-white backdrop-blur-md transition hover:bg-white/20"
                >
                  Sign In to Existing Portal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-border/80 bg-surface/80 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12 border-b border-border/60">
            <div>
              <Logo to="/" size="md" showText={true} textClassName="text-lg font-black" />
              <p className="mt-4 text-xs text-muted leading-relaxed">
                Enterprise multi-tenant school operating system for forward-thinking institutions.
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-foreground">Portals</p>
              <ul className="mt-4 space-y-2 text-xs text-muted">
                <li><Link to="/login" className="hover:text-foreground">School Admin Login</Link></li>
                <li><Link to="/login" className="hover:text-foreground">Teacher Dashboard</Link></li>
                <li><Link to="/login" className="hover:text-foreground">Student Portal</Link></li>
                <li><Link to="/login" className="hover:text-foreground">Guardian Desk</Link></li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-foreground">Documentation</p>
              <ul className="mt-4 space-y-2 text-xs text-muted">
                <li><a href="https://github.com/anurag2417/AcadFlows" target="_blank" rel="noreferrer" className="hover:text-foreground">GitHub Monorepo</a></li>
                <li><Link to="/school/register" className="hover:text-foreground">Onboarding Guide</Link></li>
                <li><a href="#features" className="hover:text-foreground">Core Features</a></li>
                <li><a href="#innovations" className="hover:text-foreground">Product Roadmap</a></li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-foreground">Security & Legal</p>
              <ul className="mt-4 space-y-2 text-xs text-muted">
                <li><span className="text-muted">FERPA & COPPA Aligned</span></li>
                <li><span className="text-muted">Multi-Tenant Isolated</span></li>
                <li><span className="text-muted">256-Bit Data Encryption</span></li>
                <li><span className="text-muted">99.9% Uptime SLA</span></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-muted gap-4">
            <p>© {new Date().getFullYear()} AcadFlows Inc. All rights reserved.</p>
            <p>Crafted for modern educational institutions worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
