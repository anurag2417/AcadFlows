import api from './api';

export interface TenantInfo {
  id: string;
  _id?: string;
  name: string;
  slug: string;
  logoUrl?: string;
  address?: string;
  phone?: string;
  email?: string;
  settings?: {
    currency?: string;
    timezone?: string;
    language?: string;
    emailDomain?: string;
    affiliation?: string;
    affiliationNumber?: string;
  };
}

export interface CreateSchoolInput {
  name: string;
  slug?: string;
  address?: string;
  phone?: string;
  email?: string;
  affiliation?: string;
  affiliationNumber?: string;
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  adminPassword: string;
  adminPhone?: string;
  adminDesignation?: string;
}

/* ─────────────────────────────────────────────────────────────
   Hosts that are NEVER tenant subdomains — the platform's own
   infrastructure. If the app is hosted on any of these, we skip
   subdomain-based tenant detection entirely.
   ───────────────────────────────────────────────────────────── */

const PLATFORM_HOST_SUFFIXES = [
  'vercel.app',
  'onrender.com',
  'render.com',
  'netlify.app',
  'railway.app',
  'fly.dev',
  'herokuapp.com',
  'localhost',
  '127.0.0.1',
];

/**
 * Extract tenant slug from current URL/hostname or path.
 *
 * Priority order:
 * 1. Path-based: /:tenantSlug/... (e.g. /dpsnoida/login)
 * 2. Query param: ?tenant=dpsnoida
 * 3. Subdomain: dpsnoida.acadflows.in (production custom domains)
 */
export function getTenantSlugFromURL(): string | null {
  if (typeof window === 'undefined') return null;

  // 1. Path prefix check (matches /:slug/... if not a root route)
  const pathname = window.location.pathname;
  const segments = pathname.split('/').filter(Boolean);
  const reservedPaths = [
    'login',
    'dashboard',
    'school',
    'students',
    'teachers',
    'academic',
    'attendance',
    'assignments',
    'gradebook',
    'timetable',
    'settings',
    'profile',
    'forgot-password',
    'reset-password',
    'verify-school',
  ];

  if (segments.length > 0 && !reservedPaths.includes(segments[0])) {
    return segments[0];
  }

  // 2. Query param fallback (dev friendly: ?tenant=dpsnoida)
  const params = new URLSearchParams(window.location.search);
  const queryTenant = params.get('tenant');
  if (queryTenant) return queryTenant;

  // 3. Subdomain detection (only on custom domains like dpsnoida.acadflows.in)
  const hostname = window.location.hostname;
  const isPlatformHost = PLATFORM_HOST_SUFFIXES.some(suffix =>
    hostname.endsWith(suffix),
  );

  if (isPlatformHost) {
    return null;
  }

  const parts = hostname.split('.');
  if (parts.length >= 3) {
    const candidate = parts[0];
    if (candidate !== 'www' && candidate !== 'app' && candidate !== 'api') {
      return candidate;
    }
  }

  return null;
}

/**
 * Get tenant info by slug.
 * Returns null on 404 (no noisy console errors).
 */
export async function getTenantInfo(slug: string): Promise<TenantInfo | null> {
  if (!slug || slug.trim() === '') {
    return null;
  }

  try {
    const response = await api.get(`/tenants/public/${slug}`);
    return response.data.data;
  } catch (error: any) {
    if (error?.response?.status !== 404) {
      console.warn('Failed to fetch tenant info:', error?.message);
    }
    return null;
  }
}

/**
 * Get current tenant info (based on the request's tenant context).
 */
export async function getCurrentTenant(): Promise<TenantInfo | null> {
  try {
    const response = await api.get('/tenants/current');
    return response.data.data;
  } catch (error: any) {
    if (error?.response?.status !== 404) {
      console.warn('Failed to fetch current tenant:', error?.message);
    }
    return null;
  }
}

/**
 * Validate tenant ID.
 */
export async function validateTenant(tenantId: string): Promise<boolean> {
  try {
    const response = await api.get(`/tenants/validate/${tenantId}`);
    return response.data.data.isValid;
  } catch {
    return false;
  }
}

/**
 * Get tenant display name for UI.
 */
export function getTenantDisplayName(tenant: TenantInfo | null): string {
  if (!tenant) return 'School';
  return tenant.name || tenant.slug || 'School';
}

/**
 * Create a new school and administrator account.
 */
export async function createSchool(data: CreateSchoolInput): Promise<any> {
  const response = await api.post('/tenants/create-school', data);

  const schoolData = response.data.data;
  if (schoolData && schoolData._id && !schoolData.id) {
    schoolData.id = schoolData._id;
  }
  if (schoolData && schoolData.id && !schoolData._id) {
    schoolData._id = schoolData.id;
  }

  return schoolData;
}
