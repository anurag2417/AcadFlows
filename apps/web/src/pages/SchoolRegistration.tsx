import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createSchool } from '../lib/tenant';
import ThemeToggle from '../components/ThemeToggle';
import Logo from '../components/ui/Logo';

interface CreatedSchoolInfo {
  id: string;
  name: string;
  slug: string;
  adminEmail: string;
  adminName: string;
}

export default function SchoolRegistrationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // School Details
    name: '',
    address: '',
    phone: '',
    email: '',
    affiliation: 'CBSE',
    affiliationNumber: '',

    // Administrator Details
    adminFirstName: '',
    adminLastName: '',
    adminEmail: '',
    adminPhone: '',
    adminDesignation: 'Principal',
    adminPassword: '',
    confirmPassword: '',
  });

  const [createdSchool, setCreatedSchool] = useState<CreatedSchoolInfo | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateSchool = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError('School name is required');
      return;
    }

    if (!formData.adminFirstName.trim() || !formData.adminLastName.trim()) {
      setError('Administrator first and last name are required');
      return;
    }

    if (!formData.adminEmail.trim()) {
      setError('Administrator email is required');
      return;
    }

    if (formData.adminPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (formData.adminPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await createSchool({
        name: formData.name.trim(),
        address: formData.address.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        email: formData.email.trim() || undefined,
        affiliation: formData.affiliation || undefined,
        affiliationNumber: formData.affiliationNumber.trim() || undefined,
        adminFirstName: formData.adminFirstName.trim(),
        adminLastName: formData.adminLastName.trim(),
        adminEmail: formData.adminEmail.trim(),
        adminPassword: formData.adminPassword,
        adminPhone: formData.adminPhone.trim() || undefined,
        adminDesignation: formData.adminDesignation || undefined,
      });

      const schoolId = response.id || response._id;
      if (!schoolId) {
        throw new Error('School ID not found in response');
      }

      setCreatedSchool({
        id: schoolId,
        name: response.name,
        slug: response.slug,
        adminEmail: formData.adminEmail,
        adminName: `${formData.adminFirstName} ${formData.adminLastName}`,
      });
    } catch (err: any) {
      console.error('❌ School registration error:', err);
      setError(
        err.response?.data?.error ||
          err.message ||
          'Failed to register school. Please check details and try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    'mt-1.5 block w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors';
  const labelClass = 'block text-xs font-semibold uppercase tracking-wider text-muted';

  /* ─────────────────────────────────────────────────────────────
     SUCCESS / PENDING APPROVAL STATE
     ───────────────────────────────────────────────────────────── */

  if (createdSchool) {
    return (
      <div className="min-h-screen flex bg-background text-foreground">
        <div className="w-full lg:w-[48%] flex flex-col px-4 sm:px-8 lg:px-16 py-6 sm:py-10">
          <div className="flex items-center justify-between">
            <Logo to="/" size="md" showText={true} />
            <ThemeToggle />
          </div>

          <div className="flex-1 flex items-center py-8">
            <div className="w-full max-w-md mx-auto text-center">
              <div className="mx-auto w-20 h-20 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mb-6 text-primary-600">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                Registration Submitted
              </h1>

              <p className="mt-2.5 text-sm text-muted leading-relaxed">
                Your school application and administrator account have been created and are currently in review.
              </p>

              <div className="mt-6 rounded-2xl border border-border bg-surface p-5 text-left space-y-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                    School
                  </p>
                  <p className="text-base font-bold text-foreground mt-0.5">
                    {createdSchool.name}
                  </p>
                </div>

                <div className="pt-3 border-t border-border">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                    Administrator Account
                  </p>
                  <p className="text-sm font-semibold text-foreground mt-0.5">
                    {createdSchool.adminName}
                  </p>
                  <p className="text-xs text-muted font-mono mt-0.5">
                    {createdSchool.adminEmail}
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3 text-left rounded-2xl border border-border bg-elevated p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                  What happens next?
                </p>
                <ol className="space-y-3 text-sm text-foreground">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-500 text-white text-xs font-bold flex items-center justify-center">
                      1
                    </span>
                    <div>
                      <p className="font-semibold text-xs">Verify your email</p>
                      <p className="text-xs text-muted mt-0.5">
                        We sent a verification link to <strong>{createdSchool.adminEmail}</strong>. Click it to confirm your address.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-500 text-white text-xs font-bold flex items-center justify-center">
                      2
                    </span>
                    <div>
                      <p className="font-semibold text-xs">Platform verification</p>
                      <p className="text-xs text-muted mt-0.5">
                        Our team reviews the school information (typically within 24 hours).
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-500 text-white text-xs font-bold flex items-center justify-center">
                      3
                    </span>
                    <div>
                      <p className="font-semibold text-xs">Sign in & begin onboarding</p>
                      <p className="text-xs text-muted mt-0.5">
                        Once approved, sign in directly with your email and password to start configuring your school.
                      </p>
                    </div>
                  </li>
                </ol>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 transition-colors shadow-sm"
                >
                  Go to Login
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setCreatedSchool(null);
                    setFormData({
                      name: '',
                      address: '',
                      phone: '',
                      email: '',
                      affiliation: 'CBSE',
                      affiliationNumber: '',
                      adminFirstName: '',
                      adminLastName: '',
                      adminEmail: '',
                      adminPhone: '',
                      adminDesignation: 'Principal',
                      adminPassword: '',
                      confirmPassword: '',
                    });
                  }}
                  className="text-xs text-muted hover:text-foreground transition-colors"
                >
                  Register another school
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: hero panel */}
        <div className="hidden lg:block relative w-[52%]">
          <img
            src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1400&q=80"
            alt="School building"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/30" />

          <div className="relative h-full flex flex-col justify-between p-12">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white/90 bg-white/10 backdrop-blur rounded-full px-3 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                Application Submitted
              </span>
              <span className="text-xs text-white/70">
                Verified within 24 hours
              </span>
            </div>

            <div className="max-w-md">
              <h2 className="text-3xl font-bold text-white leading-snug">
                Trusted by educational institutions across India.
              </h2>
              <p className="mt-3 text-sm text-white/80 leading-relaxed">
                We verify every school to maintain complete academic integrity and provide an enterprise-grade experience.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 max-w-md">
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <p className="text-2xl font-bold text-white">24h</p>
                <p className="text-xs text-white/70 mt-1">Average verification</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <p className="text-2xl font-bold text-white">Direct Login</p>
                <p className="text-xs text-white/70 mt-1">No complicated codes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────────
     REGISTRATION FORM
     ───────────────────────────────────────────────────────────── */

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <div className="w-full lg:w-[50%] flex flex-col px-4 sm:px-8 lg:px-16 py-6 sm:py-8">
        <div className="flex items-center justify-between">
          <Logo to="/" size="md" showText={true} />
          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
            <Link
              to="/"
              className="text-xs sm:text-sm font-medium text-muted hover:text-foreground transition-colors shrink-0"
            >
              ← Back to home
            </Link>
          </div>
        </div>

        <div className="flex-1 max-w-xl mx-auto w-full py-6 sm:py-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Register your school
            </h1>
            <p className="mt-2 text-sm text-muted">
              Create your school workspace and set up the primary administrator account.
            </p>
          </div>

          {error && (
            <div className="mt-5 rounded-xl bg-red-500/10 border border-red-500/20 p-3.5">
              <p className="text-sm text-red-700 dark:text-red-400 font-medium">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleCreateSchool} className="mt-6 space-y-6">
            {/* Section 1: School Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <span className="grid h-6 w-6 place-items-center rounded-md bg-primary-500/10 text-primary-600 text-xs font-bold">
                  1
                </span>
                <h2 className="text-sm font-bold text-foreground uppercase tracking-wide">
                  School Information
                </h2>
              </div>

              <div>
                <label htmlFor="name" className={labelClass}>
                  School Name <span className="text-primary-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className={inputClass}
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Delhi Public School, R.K. Puram"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="affiliation" className={labelClass}>
                    Board / Affiliation
                  </label>
                  <select
                    id="affiliation"
                    name="affiliation"
                    className={inputClass}
                    value={formData.affiliation}
                    onChange={handleChange}
                  >
                    <option value="CBSE">CBSE</option>
                    <option value="ICSE / CISCE">ICSE / CISCE</option>
                    <option value="State Board">State Board</option>
                    <option value="IB (International Baccalaureate)">IB</option>
                    <option value="Cambridge (CAIE)">Cambridge</option>
                    <option value="Other">Other / Independent</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="affiliationNumber" className={labelClass}>
                    Affiliation / UDISE Code
                  </label>
                  <input
                    id="affiliationNumber"
                    name="affiliationNumber"
                    type="text"
                    className={inputClass}
                    value={formData.affiliationNumber}
                    onChange={handleChange}
                    placeholder="e.g., 2130001 or 11-digit UDISE"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className={labelClass}>
                    Official School Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className={inputClass}
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g., info@school.edu.in"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className={labelClass}>
                    Official School Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className={inputClass}
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g., 011-26171261"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="address" className={labelClass}>
                  Campus Address
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  className={inputClass}
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g., Sector XII, R.K. Puram, New Delhi"
                />
              </div>
            </div>

            {/* Section 2: Administrator Profile */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <span className="grid h-6 w-6 place-items-center rounded-md bg-primary-500/10 text-primary-600 text-xs font-bold">
                  2
                </span>
                <h2 className="text-sm font-bold text-foreground uppercase tracking-wide">
                  Primary Administrator Account
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="adminFirstName" className={labelClass}>
                    First Name <span className="text-primary-500">*</span>
                  </label>
                  <input
                    id="adminFirstName"
                    name="adminFirstName"
                    type="text"
                    required
                    className={inputClass}
                    value={formData.adminFirstName}
                    onChange={handleChange}
                    placeholder="e.g., Rajesh"
                  />
                </div>

                <div>
                  <label htmlFor="adminLastName" className={labelClass}>
                    Last Name <span className="text-primary-500">*</span>
                  </label>
                  <input
                    id="adminLastName"
                    name="adminLastName"
                    type="text"
                    required
                    className={inputClass}
                    value={formData.adminLastName}
                    onChange={handleChange}
                    placeholder="e.g., Sharma"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="adminEmail" className={labelClass}>
                    Administrator Email <span className="text-primary-500">*</span>
                  </label>
                  <input
                    id="adminEmail"
                    name="adminEmail"
                    type="email"
                    required
                    className={inputClass}
                    value={formData.adminEmail}
                    onChange={handleChange}
                    placeholder="e.g., principal@school.edu.in"
                  />
                  <p className="text-[11px] text-muted mt-1">This will be your login email.</p>
                </div>

                <div>
                  <label htmlFor="adminDesignation" className={labelClass}>
                    Designation
                  </label>
                  <select
                    id="adminDesignation"
                    name="adminDesignation"
                    className={inputClass}
                    value={formData.adminDesignation}
                    onChange={handleChange}
                  >
                    <option value="Principal">Principal</option>
                    <option value="Director">Director / Chairman</option>
                    <option value="Vice Principal">Vice Principal</option>
                    <option value="IT Administrator">IT Administrator</option>
                    <option value="Administrator">Administrator</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="adminPhone" className={labelClass}>
                  Admin Mobile Number
                </label>
                <input
                  id="adminPhone"
                  name="adminPhone"
                  type="tel"
                  className={inputClass}
                  value={formData.adminPhone}
                  onChange={handleChange}
                  placeholder="e.g., 9876543210"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="adminPassword" className={labelClass}>
                    Password <span className="text-primary-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="adminPassword"
                      name="adminPassword"
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={8}
                      className={inputClass}
                      value={formData.adminPassword}
                      onChange={handleChange}
                      placeholder="Min. 8 characters"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className={labelClass}>
                    Confirm Password <span className="text-primary-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={8}
                      className={inputClass}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter password"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted pt-1">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  {showPassword ? 'Hide password' : 'Show password'}
                </button>
                <span>Must be at least 8 characters</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !formData.name.trim() || !formData.adminEmail.trim()}
              className="w-full flex justify-center rounded-lg bg-primary-500 py-3 text-sm font-semibold text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {isLoading ? 'Creating school & administrator...' : 'Complete School Registration'}
            </button>

            <p className="text-xs text-muted text-center pt-1">
              Already have an active school account?{' '}
              <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">
                Sign in here
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right: Info / Feature Panel */}
      <div className="hidden lg:block relative w-[50%]">
        <img
          src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1400&q=80"
          alt="School building"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/35" />

        <div className="relative h-full flex flex-col justify-between p-12">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-white/95 bg-white/10 backdrop-blur rounded-full px-3.5 py-1.5 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Multi-tenant School Operations Platform
            </span>
          </div>

          <div className="max-w-md">
            <h2 className="text-3xl font-extrabold text-white leading-tight">
              A single workspace for your entire school.
            </h2>
            <p className="mt-3.5 text-sm text-white/80 leading-relaxed">
              Every school on AcadFlows operates in complete tenant isolation with dedicated academic years, grading scales, attendance registers, and role-based permissions for administrators, teachers, students, and guardians.
            </p>

            <div className="mt-8 space-y-3.5">
              {[
                { title: 'Academic Automation', desc: 'Schedules, gradebooks, report cards, and section rosters.' },
                { title: 'Instant Staff Onboarding', desc: 'Invite teachers with email domain matching or bulk CSV imports.' },
                { title: 'Verified Security', desc: 'Granular permissions ensuring students & guardians see only their own records.' },
              ].map(item => (
                <div key={item.title} className="flex gap-3 items-start">
                  <div className="w-5 h-5 rounded-full bg-primary-500/20 border border-primary-400 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[10px] text-white font-bold">✓</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{item.title}</p>
                    <p className="text-[11px] text-white/70">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-xs text-white/60">
            © {new Date().getFullYear()} AcadFlows. Built with precision for educational institutions.
          </div>
        </div>
      </div>
    </div>
  );
}
