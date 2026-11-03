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
  Layers,
  GraduationCap,
  Users,
  Activity,
  ChevronDown,
} from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import Logo from '../components/ui/Logo';

/* ─────────────────────────────────────────────────────────────
   ROLE PREVIEWS WITH CURATED UNSPLASH IMAGES
   ───────────────────────────────────────────────────────────── */

type RoleKey = 'admin' | 'teacher' | 'student' | 'guardian' | 'platform';

interface RolePreview {
  id: RoleKey;
  label: string;
  badge: string;
  title: string;
  tagline: string;
  image: string;
  imageAlt: string;
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
    tagline: 'Manage admissions, faculty, timetables, and fee structures from one hub.',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'School Administration & Modern Campus',
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
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Teacher engaging with classroom students',
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
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Students studying together with laptops',
    chips: ['Daily Timetable', 'Instant Turn-in', 'GPA Analytics', 'Verified Report Card'],
    metrics: [
      { label: 'Next Class', value: 'Physics Lab', color: 'text-primary-500' },
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
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Parent and child celebrating academic success',
    chips: ['Arrival Alerts', '1-Click UPI Payment', 'Direct Teacher Chat', 'Live Marks'],
    metrics: [
      { label: 'Campus Arrival', value: '08:14 AM', color: 'text-emerald-500' },
      { label: 'Term 2 Fee Status', value: 'Due in 10d', color: 'text-amber-500' },
      { label: 'Latest Exam Score', value: '94 / 100', color: 'text-primary-500' },
      { label: 'Teacher Remarks', value: 'Excellent Focus', color: 'text-accent-500' },
    ],
    actionBtn: 'Pay Term Fee (UPI)',
  },
  platform: {
    id: 'platform',
    label: 'Platform Founder',
    badge: 'Super-Admin',
    title: 'Multi-Tenant Governance Hub',
    tagline: 'Instant KYC approval, tenant status toggling, and global telemetry.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Digital educational analytics and network monitoring',
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
   CURATED BENTO CARDS WITH LARGE SIZES & UNSPLASH IMAGES
   ───────────────────────────────────────────────────────────── */

const BENTO_FEATURES = [
  {
    icon: <Calendar className="w-6 h-6 text-primary-500" />,
    badge: 'Curriculum',
    title: 'Academic Structure & Terms',
    desc: 'Multi-year calendar modeling with automated section branching and grading scales.',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
    colSpan: 'col-span-12 lg:col-span-7',
  },
  {
    icon: <Clock className="w-6 h-6 text-amber-500" />,
    badge: 'Scheduling',
    title: 'Conflict-Free Timetables',
    desc: 'Algorithmic room allocation and teacher sync that mathematically prevents double-booking.',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
    colSpan: 'col-span-12 lg:col-span-5',
  },
  {
    icon: <CheckCircle2 className="w-6 h-6 text-emerald-500" />,
    badge: 'Roll-Call',
    title: '10-Second Attendance',
    desc: 'One-tap class roll-call with automated SMS and push notifications sent to absent parents.',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
    colSpan: 'col-span-12 lg:col-span-5',
  },
  {
    icon: <CreditCard className="w-6 h-6 text-accent-500" />,
    badge: 'Billing',
    title: 'Digital Fees & UPI Receipts',
    desc: 'Itemized tuition, transport, and lab fee tracking with partial installments and PDF receipts.',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    colSpan: 'col-span-12 lg:col-span-7',
  },
  {
    icon: <GraduationCap className="w-6 h-6 text-purple-500" />,
    badge: 'LMS Engine',
    title: 'Homework & Report Cards',
    desc: 'Continuous grading, assignment turn-in, and 1-click batch generation of official report cards.',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    colSpan: 'col-span-12 lg:col-span-6',
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-rose-500" />,
    badge: 'Sovereignty',
    title: 'Cryptographic Isolation',
    desc: 'Strict query-level tenant scoping, Bcrypt 12 password hashing, and FERPA/COPPA compliance.',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    colSpan: 'col-span-12 lg:col-span-6',
  },
];

/* ─────────────────────────────────────────────────────────────
   UPCOMING INNOVATIONS WITH IMAGERY
   ───────────────────────────────────────────────────────────── */

const UPCOMING_INNOVATIONS = [
  {
    icon: <Smartphone className="w-7 h-7 text-primary-500" />,
    phase: 'Phase 3 • Cross-Platform',
    title: 'Native Mobile App & Chat',
    desc: 'Teacher-parent 1-on-1 messaging, digital circulars with read acknowledgments, and push alerts.',
    tag: 'React Native / FCM',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
  },
  {
    icon: <CreditCard className="w-7 h-7 text-emerald-500" />,
    phase: 'Phase 2 • Web & Mobile',
    title: '1-Click UPI Fee Payments',
    desc: 'Native UPI intent (GPay, PhonePe, Paytm) with automated ledgers and instant tax receipts.',
    tag: 'Razorpay / Stripe',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
  },
  {
    icon: <BrainCircuit className="w-7 h-7 text-accent-500" />,
    phase: 'Phase 2 • AI Workspace',
    title: 'Perplexity AI Research Hub',
    desc: 'Academic Q&A workspace with persistent threads, verified citations, and Socratic student tutor.',
    tag: 'RAG Pipeline / Citations',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
  },
  {
    icon: <Layers className="w-7 h-7 text-amber-500" />,
    phase: 'Phase 2 • Social Good',
    title: 'Shiksha Sathi (NCERT/CBSE)',
    desc: 'Curated question banks for Classes 1–12 and 1-click AI homework generation at zero cost.',
    tag: 'NEP 2020 Aligned',
    image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=800&q=80',
  },
  {
    icon: <Camera className="w-7 h-7 text-purple-500" />,
    phase: 'Phase 3 • Computer Vision',
    title: 'VisionFlow AI Face Attendance',
    desc: 'Teacher snaps a single classroom photo on mobile; AI matches and records 40+ students in 5s.',
    tag: 'RetinaFace / ArcFace',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
  },
];

/* ─────────────────────────────────────────────────────────────
   FAQS
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
   MAIN COMPONENT
   ───────────────────────────────────────────────────────────── */

export default function LandingPage() {
  const [selectedRole, setSelectedRole] = useState<RoleKey>('admin');
  const [studentSlider, setStudentSlider] = useState<number>(1200);

  const hoursSavedPerYear = Math.round(studentSlider * 0.24);
  const sheetsPaperSaved = Math.round(studentSlider * 12);

  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-background text-foreground selection:bg-primary-500 selection:text-white">
      {/* ─── Ambient Glow Blobs ─── */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[550px] w-full -translate-x-1/2 bg-gradient-to-b from-primary-500/20 via-secondary-500/15 to-transparent blur-[160px]" />
        <div className="absolute top-[45%] right-0 h-[450px] w-[550px] bg-accent-500/10 blur-[150px]" />
        <div className="absolute top-[75%] left-0 h-[450px] w-[550px] bg-primary-500/10 blur-[150px]" />
      </div>

      {/* ─── 100% Full-Width Floating Header ─── */}
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-surface/85 backdrop-blur-2xl">
        <nav className="w-full flex h-20 items-center justify-between px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24">
          <Logo to="/" size="md" showText={true} textClassName="text-2xl font-black tracking-tight" />

          {/* Navigation Links */}
          <div className="hidden items-center gap-8 md:flex text-sm font-bold uppercase tracking-wider text-muted">
            <a href="#showcase" className="hover:text-foreground transition">Platform Hub</a>
            <a href="#features" className="hover:text-foreground transition">Core Features</a>
            <a href="#innovations" className="hover:text-foreground transition">AI Roadmap</a>
            <a href="#calculator" className="hover:text-foreground transition">Impact Calculator</a>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              to="/login"
              className="rounded-xl border border-border px-5 py-2.5 text-sm font-bold text-foreground hover:bg-elevated transition"
            >
              Sign In
            </Link>
            <Link
              to="/school/register"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-0.5 transition"
            >
              Register Campus
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </nav>
      </header>

      {/* ─── 100% Full-Width Hero Section ─── */}
      <section className="w-full pt-16 pb-14 px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24 text-center">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2.5 rounded-full border border-primary-500/25 bg-primary-500/10 px-5 py-2 text-sm font-bold text-primary-600 dark:text-primary-400">
          <Sparkles className="w-4 h-4" />
          <span>Next-Generation Multi-Tenant School Operating System</span>
        </div>

        {/* Big Bold Headline */}
        <h1 className="mt-8 text-5xl sm:text-7xl lg:text-8xl 2xl:text-9xl font-black tracking-tight leading-[1.05]">
          Run Your Entire School in{' '}
          <span className="bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 bg-clip-text text-transparent">
            Pure Digital Flow.
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="mt-6 text-lg sm:text-2xl text-muted font-medium max-w-3xl mx-auto leading-relaxed">
          Academics, 10-Second Attendance, Conflict-Free Schedules, 1-Click UPI Fees, and AI. Zero paper, zero chaos.
        </p>

        {/* Big CTA Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/school/register"
            className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-primary-500 via-primary-600 to-secondary-500 px-9 py-4 text-base sm:text-lg font-bold text-white shadow-xl shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-1 transition"
          >
            Register School Free
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-2.5 rounded-2xl border border-border bg-surface px-8 py-4 text-base sm:text-lg font-bold text-foreground hover:bg-elevated hover:-translate-y-0.5 transition shadow-sm"
          >
            Explore Live Demo
          </Link>
        </div>

        {/* Feature Ticker Pills */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-sm font-bold text-muted">
          <span className="rounded-full bg-elevated px-4 py-2 border border-border/80">⚡ 10-Sec Roll Call</span>
          <span className="rounded-full bg-elevated px-4 py-2 border border-border/80">📅 Zero Schedule Collisions</span>
          <span className="rounded-full bg-elevated px-4 py-2 border border-border/80">💳 1-Click UPI Settlement</span>
          <span className="rounded-full bg-elevated px-4 py-2 border border-border/80">🛡️ Strict Cryptographic Isolation</span>
        </div>
      </section>

      {/* ─── 100% Full-Width Interactive Showcase with High-Res Image ─── */}
      <section id="showcase" className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24 pb-20">
        <div className="w-full rounded-[2.5rem] border border-border/80 bg-surface/90 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl">
          {/* Top Role Selector Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
            <div className="flex items-center gap-2.5">
              <span className="h-3.5 w-3.5 rounded-full bg-rose-500/80" />
              <span className="h-3.5 w-3.5 rounded-full bg-amber-500/80" />
              <span className="h-3.5 w-3.5 rounded-full bg-emerald-500/80" />
              <span className="ml-3 text-sm font-mono text-muted hidden sm:inline">acadflows.app/campus-hub</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 bg-background p-1.5 rounded-2xl border border-border">
              {(Object.keys(ROLE_PREVIEWS) as RoleKey[]).map(key => (
                <button
                  key={key}
                  onClick={() => setSelectedRole(key)}
                  className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-bold capitalize transition ${
                    selectedRole === key
                      ? 'bg-primary-500 text-white shadow-md shadow-primary-500/25'
                      : 'text-muted hover:text-foreground'
                  }`}
                >
                  {ROLE_PREVIEWS[key].label}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Interactive Card with Real Image */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedRole}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="mt-8 w-full rounded-3xl border border-border bg-background overflow-hidden"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                {/* Left Side: Unsplash Photography Visual */}
                <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-[460px] overflow-hidden">
                  <img
                    src={ROLE_PREVIEWS[selectedRole].image}
                    alt={ROLE_PREVIEWS[selectedRole].imageAlt}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-xs font-bold w-fit mb-2">
                      <Activity className="w-3.5 h-3.5" />
                      {ROLE_PREVIEWS[selectedRole].badge}
                    </span>
                    <h4 className="text-xl sm:text-2xl font-black">{ROLE_PREVIEWS[selectedRole].title}</h4>
                    <p className="text-xs sm:text-sm text-white/80 mt-1">{ROLE_PREVIEWS[selectedRole].tagline}</p>
                  </div>
                </div>

                {/* Right Side: Big Visual Metrics & Interactive Controls */}
                <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-primary-500">Live Workspace Telemetry</span>
                        <h3 className="text-2xl sm:text-3xl font-black mt-1">Springfield Academy Desk</h3>
                      </div>
                      <button className="rounded-xl bg-primary-500 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-primary-500/30 hover:bg-primary-600 transition self-start sm:self-auto">
                        {ROLE_PREVIEWS[selectedRole].actionBtn}
                      </button>
                    </div>

                    {/* Large Metrics Grid */}
                    <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6">
                      {ROLE_PREVIEWS[selectedRole].metrics.map((m, i) => (
                        <div key={i} className="rounded-2xl border border-border/80 bg-surface p-5 sm:p-6 shadow-sm">
                          <p className="text-xs sm:text-sm font-bold text-muted uppercase tracking-wider">{m.label}</p>
                          <p className={`mt-2 text-3xl sm:text-4xl lg:text-5xl font-black ${m.color}`}>{m.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Feature Chips */}
                  <div className="mt-8 pt-6 border-t border-border/60 flex flex-wrap gap-2.5">
                    {ROLE_PREVIEWS[selectedRole].chips.map((chip, cIdx) => (
                      <span
                        key={cIdx}
                        className="inline-flex items-center gap-2 rounded-xl bg-elevated px-4 py-2 text-xs sm:text-sm font-bold text-muted border border-border/80"
                      >
                        <Check className="w-4 h-4 text-primary-500" />
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ─── 100% Full-Width Big Visual Bento Grid with Unsplash Images ─── */}
      <section id="features" className="w-full py-20 border-t border-border/60 bg-surface/30 px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24">
        <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
          <div>
            <span className="text-sm font-bold uppercase tracking-widest text-primary-500">Core Foundations</span>
            <h2 className="mt-2 text-3xl sm:text-5xl font-black">Built for Educational Excellence</h2>
          </div>
          <p className="text-base text-muted max-w-lg font-medium">
            Robust modules designed to eliminate manual registers, scheduling clashes, and physical cash collection.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="w-full grid grid-cols-12 gap-6 sm:gap-8">
          {BENTO_FEATURES.map((feat, idx) => (
            <div
              key={idx}
              className={`group overflow-hidden rounded-[2rem] border border-border/80 bg-surface shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition duration-300 ${feat.colSpan}`}
            >
              {/* Card Image */}
              <div className="relative h-48 sm:h-60 w-full overflow-hidden">
                <img
                  src={feat.image}
                  alt={feat.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                <div className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-black/60 backdrop-blur-md px-3.5 py-1 text-xs font-bold text-white border border-white/10">
                  {feat.icon}
                  <span>{feat.badge}</span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-black text-foreground">{feat.title}</h3>
                <p className="mt-3 text-sm sm:text-base text-muted leading-relaxed font-medium">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 100% Full-Width Upcoming Innovations with Curated Imagery ─── */}
      <section id="innovations" className="w-full py-20 border-t border-border/60 bg-background px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24">
        <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
          <div>
            <span className="text-sm font-bold uppercase tracking-widest text-secondary-500">Upcoming Breakthroughs</span>
            <h2 className="mt-2 text-3xl sm:text-5xl font-black">Phases 2 & 3 Roadmap</h2>
          </div>
          <Link to="/school/register" className="inline-flex items-center gap-2 text-sm font-bold text-primary-500 hover:text-primary-600 transition">
            <span>Join Early Access Beta</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Big Innovation Cards */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {UPCOMING_INNOVATIONS.map((item, idx) => (
            <div
              key={idx}
              className="group overflow-hidden rounded-[2rem] border border-border/80 bg-surface flex flex-col justify-between hover:border-primary-500/60 hover:shadow-2xl transition duration-300"
            >
              <div>
                {/* Image */}
                <div className="relative h-44 w-full overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent" />
                  <div className="absolute top-3 left-3 p-2.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white">
                    {item.icon}
                  </div>
                </div>

                <div className="p-6">
                  <span className="rounded-md bg-elevated px-2.5 py-1 text-xs font-bold text-muted border border-border">
                    {item.tag}
                  </span>
                  <h4 className="mt-3 text-lg sm:text-xl font-black text-foreground group-hover:text-primary-500 transition-colors">
                    {item.title}
                  </h4>
                  <p className="mt-2.5 text-xs sm:text-sm text-muted leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-border/60">
                <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                  {item.phase}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 100% Full-Width Dynamic ROI Impact Calculator ─── */}
      <section id="calculator" className="w-full py-20 border-t border-border/60 bg-surface/40 px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24">
        <div className="w-full rounded-[2.5rem] border border-border/80 bg-background p-8 sm:p-14 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Slider */}
            <div className="lg:col-span-5">
              <span className="text-sm font-bold uppercase tracking-widest text-primary-500">Live Campus ROI</span>
              <h3 className="mt-2 text-3xl sm:text-4xl font-black">Efficiency & Savings Calculator</h3>
              <p className="mt-3 text-sm sm:text-base text-muted font-medium">
                Drag the student count to see annual administrative hours saved and paper sheets eliminated across your campus.
              </p>

              <div className="mt-8">
                <div className="flex items-center justify-between text-base font-bold">
                  <span>Enrolled Students</span>
                  <span className="text-3xl font-black text-primary-500">{studentSlider.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="5000"
                  step="50"
                  value={studentSlider}
                  onChange={e => setStudentSlider(Number(e.target.value))}
                  className="mt-4 w-full accent-primary-500 h-3 bg-elevated rounded-lg cursor-pointer"
                />
                <div className="mt-2 flex justify-between text-xs font-bold text-muted">
                  <span>100 Students</span>
                  <span>2,500</span>
                  <span>5,000+ Students</span>
                </div>
              </div>
            </div>

            {/* Results Grid with Huge Typography */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 text-center shadow-sm">
                <Clock className="w-8 h-8 text-primary-500 mx-auto mb-3" />
                <p className="text-xs font-bold text-muted uppercase tracking-wider">Faculty Hours Saved</p>
                <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mt-2">~{hoursSavedPerYear}h</p>
                <p className="text-xs text-muted mt-2">Manual registers eliminated</p>
              </div>

              <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 text-center shadow-sm">
                <Layers className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
                <p className="text-xs font-bold text-muted uppercase tracking-wider">Paper Sheets Eliminated</p>
                <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mt-2">~{sheetsPaperSaved.toLocaleString()}</p>
                <p className="text-xs text-muted mt-2">Printed circulars & slips</p>
              </div>

              <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 text-center shadow-sm">
                <Zap className="w-8 h-8 text-amber-500 mx-auto mb-3" />
                <p className="text-xs font-bold text-muted uppercase tracking-wider">Fee Collection Pace</p>
                <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-emerald-500 mt-2">3.4x</p>
                <p className="text-xs text-muted mt-2">Faster via instant UPI</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 100% Full-Width FAQ Section ─── */}
      <section className="w-full py-20 border-t border-border/60 bg-background px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24">
        <div className="w-full mb-10">
          <span className="text-sm font-bold uppercase tracking-widest text-primary-500">Frequently Answered</span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-black">Everything You Need to Know</h2>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-sm">
              <p className="text-base sm:text-lg font-black text-foreground">{faq.q}</p>
              <p className="text-sm sm:text-base text-muted mt-3 leading-relaxed font-medium">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 100% Full-Width Cinematic Conversion Banner ─── */}
      <section className="w-full py-16 px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24">
        <div className="w-full rounded-[3rem] bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-600 p-10 sm:p-16 lg:p-20 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.2),_transparent)] pointer-events-none" />
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Ready to Run Your School in Flow?
          </h2>
          <p className="mt-4 text-base sm:text-xl text-white/90 max-w-2xl mx-auto font-medium">
            Zero setup fee. Onboard your students, faculty, and academic year in minutes.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/school/register"
              className="rounded-2xl bg-white px-8 py-4 text-base font-bold text-primary-600 shadow-xl hover:bg-neutral-100 transition hover:-translate-y-0.5"
            >
              Register Campus Free
            </Link>
            <Link
              to="/login"
              className="rounded-2xl border border-white/40 bg-white/10 px-8 py-4 text-base font-bold text-white hover:bg-white/20 transition"
            >
              Sign In to Portal
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 100% Full-Width Footer ─── */}
      <footer className="w-full border-t border-border/80 bg-surface py-10 px-6 sm:px-10 lg:px-16 xl:px-20 2xl:px-24">
        <div className="w-full flex flex-col sm:flex-row items-center justify-between text-sm text-muted gap-4">
          <div className="flex items-center gap-3">
            <Logo to="/" size="sm" showText={true} textClassName="text-base font-bold" />
            <span className="text-muted/60">|</span>
            <span>© {new Date().getFullYear()} AcadFlows Inc. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-sm font-semibold">
            <Link to="/login" className="hover:text-foreground">Portal Login</Link>
            <Link to="/school/register" className="hover:text-foreground">Register Campus</Link>
            <a href="https://github.com/anurag2417/AcadFlows" target="_blank" rel="noreferrer" className="hover:text-foreground">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
