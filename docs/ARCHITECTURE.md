# AcadFlows Architecture & System Design

AcadFlows is an enterprise multi-tenant School Operations and Learning Management SaaS designed to scale across thousands of educational institutions. This document details the architectural principles, data isolation strategies, request pipelines, security perimeters, and front-to-back integration patterns governing the platform.

---

## 1. High-Level System Architecture

AcadFlows employs a modular monolith architecture with strict tenant scoping boundaries, decoupling presentation, domain logic, and persistent storage while maintaining the operational simplicity of a unified deployment.

```
                              ┌─────────────────────────────────────────┐
                              │            Client Layer                 │
                              │   (React 18 + Vite + Tailwind CSS)      │
                              │   Web SPA, Mobile Responsive PWA        │
                              └────────────────────┬────────────────────┘
                                                   │
                                      HTTPS / TLS 1.3 | WSS
                                      x-tenant-id Header
                                      JWT Bearer + HttpOnly Cookies
                                                   │
                                                   ▼
                              ┌─────────────────────────────────────────┐
                              │       Edge & Ingress (Vercel/Render)    │
                              │       Reverse Proxy / DDoS Shield       │
                              │       SSL Termination & Compression     │
                              └────────────────────┬────────────────────┘
                                                   │
                                                   ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               AcadFlows API (Express + Node.js)                         │
│                                                                                        │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │                              Global Middleware Pipeline                          │  │
│  │   [Helmet] ──► [CORS] ──► [BodyParser] ──► [TenantContext] ──► [AuditLogger]     │  │
│  └─────────────────────────────────────────┬────────────────────────────────────────┘  │
│                                            │                                           │
│  ┌─────────────────────────────────────────▼────────────────────────────────────────┐  │
│  │                             Security & Routing Guard                             │  │
│  │   [apiLimiter] ──► [authenticate] ──► [ensureTenantMatch] ──► [requireRole]      │  │
│  └─────────────────────────────────────────┬────────────────────────────────────────┘  │
│                                            │                                           │
│  ┌─────────────────────────────────────────▼────────────────────────────────────────┐  │
│  │                             Domain Modules (Modular Monolith)                    │  │
│  │  • Auth & Identity   • Students & Staff   • Academic Engine   • Timetable        │  │
│  │  • Attendance        • Fees & Invoicing   • Assignments & LMS • Communication    │  │
│  │  • Platform Admin    • Document Vault     • Approvals         • Reports          │  │
│  └─────────────────────────────────────────┬────────────────────────────────────────┘  │
│                                            │                                           │
│  ┌─────────────────────────────────────────▼────────────────────────────────────────┐  │
│  │                        Data Access Layer (Mongoose + Zod)                        │  │
│  │             Tenant Isolation Middleware & Compound Index Enforcement             │  │
│  └─────────────────────────────────────────┬────────────────────────────────────────┘  │
└────────────────────────────────────────────┼───────────────────────────────────────────┘
                                             │
                      ┌──────────────────────┼──────────────────────┐
                      ▼                      ▼                      ▼
           ┌─────────────────────┐┌─────────────────────┐┌─────────────────────┐
           │   MongoDB Replica   ││  Cloudflare R2 / S3 ││  Resend / SendGrid  │
           │   Multi-Tenant DB   ││  Document & Media   ││  Transactional Mail │
           │   (Compound Keys)   ││  Encrypted Storage  ││  & Notifications    │
           └─────────────────────┘└─────────────────────┘└─────────────────────┘
```

---

## 2. Multi-Tenancy Architecture & Data Isolation

AcadFlows utilizes a **Logical Multi-Tenancy (Shared Database, Pooled Schema)** pattern with strict data isolation enforcement at the software and query levels. This pattern provides horizontal scaling efficiency while eliminating cross-tenant leakage.

### 2.1 Tenant Resolution Pipeline
Every inbound HTTP request undergoes tenant resolution through `tenantContext` middleware before reaching controller handlers:

1. **Resolution Strategy**:
   - Primary: `x-tenant-id` header supplied by client API callers.
   - Secondary: Tenant subdomain/slug routing (e.g., `school-slug.acadflows.com` or `/:tenantSlug/...`).
   - Platform Override: Platform Super-Admins bypass single-tenant scoping for platform-wide analytics and cross-institution verification.

2. **Tenant Validation**:
   - The resolved tenant ID is verified against the database cache.
   - If tenant status is `suspended` or `rejected`, requests are blocked immediately with `403 Forbidden` (`TENANT_SUSPENDED`).
   - If tenant is not found, requests return `404 Not Found` (`TENANT_NOT_FOUND`).

### 2.2 Query-Level Scoping & Compound Indexes
Every data model containing tenant-scoped data implements the `TenantScoped` interface:

```typescript
export interface TenantScoped {
  tenantId: string;
}
```

- **Mongoose Hook Enforcement**: Pre-find and pre-save hooks inject `tenantId` into queries.
- **Compound Unique Indexes**: Unique constraints are scoped per tenant rather than globally:
  ```typescript
  // Example: Student admission number unique per school only
  studentSchema.index({ tenantId: 1, admissionNumber: 1 }, { unique: true });
  
  // Example: User email unique per tenant
  userSchema.index({ tenantId: 1, email: 1 }, { unique: true });
  ```
- **Platform Super-Admin Isolation**: The platform admin workspace operates outside standard school tenant boundaries to manage approvals, onboarding, and platform health.

---

## 3. Authentication & Authorization (RBAC)

AcadFlows enforces a multi-tier Role-Based Access Control (RBAC) security model with dual-token authentication.

### 3.1 Token Lifecycle & Session Management
- **Short-Lived Access Tokens**: Signed with `JWT_SECRET` (RS256/HS256), expiring in 15–60 minutes. Delivered via `Authorization: Bearer <token>`.
- **Long-Lived Refresh Tokens**: Signed with `JWT_REFRESH_SECRET`, expiring in 30 days. Delivered via secure, `httpOnly`, `sameSite: 'lax'` / `'strict'` cookies to mitigate Cross-Site Scripting (XSS) extraction.
- **Sliding Expiration**: When access token expires, frontend interceptor triggers automatic refresh via `/api/v1/auth/refresh`.

### 3.2 Role Hierarchy & Permission Matrix

| Role | Scope | Key Capabilities |
|---|---|---|
| **Platform Super-Admin** | Global (Cross-Tenant) | Verify and approve new schools, suspend rogue tenants, audit school admins, view global platform health. |
| **School Admin** | Tenant-Scoped | School configuration, staff & student admissions, academic year management, fees & billing, timetables, school-wide announcements. |
| **Teacher** | Tenant & Section-Scoped | View class rosters, mark attendance, create assignments, grade submissions, view assigned timetables, communicate with parents. |
| **Student** | Tenant & Enrolled-Scoped | View personal schedule, submit assignments, inspect personal gradebook and report cards, review attendance stats, view announcements. |
| **Guardian / Parent** | Tenant & Child-Scoped | View children's attendance, grades, pending invoices, fee receipts, and school notifications. |

---

## 4. Frontend Architecture (Web App)

The frontend is built with React 18, Vite, and Tailwind CSS, structured for responsive performance across desktop, tablet, and mobile browsers.

```
apps/web/src/
├── components/          # Reusable UI primitives and domain widgets
│   ├── ui/              # Button, Input, Modal, Table, Badge, Card, Select
│   ├── layout/          # DashboardLayout, Sidebar, Navbar, MobileNav, Footer
│   ├── dashboards/      # Role-specific dashboard components
│   └── forms/           # Formik/Hook-form validation wrappers
├── contexts/            # Global application state providers
│   ├── AuthContext.tsx    # User identity, login, logout, refresh lifecycle
│   ├── TenantContext.tsx  # Current active school tenant state
│   └── ThemeContext.tsx   # Dark/light mode theme provider
├── hooks/               # Custom reusable React hooks
├── lib/                 # Core utilities
│   ├── api.ts           # Axios instance with tenant header injection and 401 refresh interceptors
│   ├── format.ts        # Currency, date, time, and phone formatters
│   └── utils.ts         # Class merging (cn) and DOM helpers
├── pages/               # Route endpoints grouped by domain & role
│   ├── admin/           # Academic, Students, Teachers, Timetables, Fees, Settings
│   ├── teacher/         # Class rosters, grading, attendance entry
│   ├── student/         # Student portal, gradebook, timetable
│   └── platform-admin/  # Platform Super-Admin management console
└── App.tsx              # Central declarative route tree with role gates
```

### 4.1 Responsive Single-Device Layout System
All dashboard pages utilize responsive fluid breakpoints:
- **Mobile (< 768px)**: Bottom action bar or collapsible slide-over navigation drawer, single-column stacked metric cards, horizontal swipeable tables.
- **Tablet (768px – 1024px)**: Dual-column grid layouts with collapsible icon sidebar.
- **Desktop (> 1024px)**: Full multi-pane dashboard layout with persistent navigation, quick actions, and data tables with sticky headers.

---

## 5. Background Jobs & Communications Engine

- **Email Delivery Service**: Outbound transactional emails (welcome invites, password resets, fee invoice reminders) routed through Resend / AWS SES with templated HTML layouts.
- **Audit Logging Engine**: Mutating API calls (`POST`, `PUT`, `PATCH`, `DELETE`) are processed through asynchronous non-blocking audit logger middleware, recording actor, IP, tenant, action, and timestamp.
- **Report Generation**: Gradebooks, attendance summaries, and student report cards generated dynamically with streamable JSON data and downloadable CSV/PDF export.

