# AcadFlows SaaS Product Documentation

![School campus](https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1800&q=85)

## 1. Product summary

**AcadFlows** is a school operations platform intended to give each school a shared place to manage academic administration and communicate with its community. The current repository is an MVP implementation built as a multi-tenant web application and REST API.

This document describes the product surface and the engineering foundation visible in the repository. It is not a claim of compliance certification, service-level commitment, or production readiness. Confirm a workflow in a running environment before relying on it for school operations.

### Product goals

- Reduce duplicate administration across academic, attendance, fee, and communication workflows.
- Give school staff a shared view of student and teacher records.
- Support distinct school tenants and role-aware application experiences.
- Provide a codebase that can be deployed as a web app and API and extended as requirements mature.

### Intended users

| User | Typical needs |
|---|---|
| School administrator | Configure school academics, manage people, track attendance and fees, and oversee learning operations |
| Teacher | Work with assigned classes, attendance, assignments, and student progress |
| Student | View learning information, assignments, and school communications |
| Guardian | Follow relevant student progress and communicate with school staff |
| Platform administrator | Review and manage school and user activity at the platform level |

Actual permissions must be confirmed in the API route middleware and service logic. A user interface role alone is not an authorization boundary.

## 2. Product capabilities

### School onboarding and identity

The application contains school registration, school-code validation, user registration, sign-in, token refresh/logout, and password recovery flows. The API supports JWT-based authentication and refresh-token cookies. Platform-admin school and user screens are also present.

### School administration

School records and tenant context underpin school-specific workflows. Tenant context is resolved in API middleware and authenticated API route groups apply authentication and tenant matching at the application mount. Tenant isolation should be verified for every resource operation before storing real multi-school data.

### Academic operations

Academic modules cover school years, grades, sections, subjects, teacher-subject assignments, and class schedules. Public academic lookup routes support registration dropdowns.

### Student and teacher workflows

The web application includes student and teacher lists and detail views, approval queues, class rosters, and profile management. Bulk-import and promotion tools are present in the web application. Confirm their validation, transaction behavior, and rollback behavior before operational use.

### Attendance

Attendance screens and API modules provide attendance entry, reporting, and student/teacher tracking. Notification-related behavior is represented in API services. Validate date boundaries, correction policies, duplicate submissions, and export accuracy against local school policy.

### Fees

Fee-related screens cover fee structures, invoices, payments, discounts, student fee history, and reports. A payment-entry workflow is present. The repository does not establish that a payment gateway or automated reconciliation provider is integrated; treat payment records as application records until a verified provider integration exists.

### Learning and assessment

Assignments can be created, submitted, and graded. Gradebook and report-card modules support student progress workflows. Confirm score calculations, publication rules, academic-year selection, and attendance integration before using generated results as official records.

### Timetable and communication

Timetable screens and API modules cover timetables, entries, rooms, and time slots. Communication screens and API routes cover announcements, in-app notifications, and messaging. Email delivery is supported through the configured email service when credentials are provided; local behavior may log email output instead.

## 3. User journey overview

### School onboarding

1. A school submits its registration details.
2. The backend creates a school registration record and can notify the configured platform administrator.
3. School verification and approval actions are handled through the available registration and platform workflows.
4. A school administrator configures academic structures and invites or approves staff and families.

This is a product-flow outline. Approval states, email delivery, and tenant activation should be verified in a configured environment.

### Daily school operations

1. Administrators maintain people, classes, subjects, and school-year settings.
2. Teachers use assigned class and student information for attendance and learning workflows.
3. Staff record fees and payments and generate invoices or reports.
4. Students and guardians use role-appropriate pages to see learning and school updates.

![Teacher working with students](https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1600&q=85)

## 4. System architecture

```text
Browser
  └── React + TypeScript SPA (apps/web)
        └── HTTP API client (VITE_API_URL)
              └── Express API (apps/api)
                    ├── Security, CORS, parsing, rate limiting
                    ├── Tenant context, authentication, authorization
                    ├── Feature routes → controllers → services
                    ├── Zod request validation
                    └── Mongoose models → MongoDB

Shared TypeScript contracts and constants: packages/shared
```

The Express application mounts public routes separately from route groups protected by authentication and tenant-match middleware. Some feature routers may also define their own middleware. Review both the application mounts and route files when changing authorization.

### Repository responsibilities

| Path | Responsibility |
|---|---|
| `apps/web` | React single-page app, pages, contexts, components, API clients |
| `apps/api/src/app.ts` | Middleware setup, public/protected route mounts, error handlers |
| `apps/api/src/modules` | Feature-specific route, controller, service, and validation code |
| `apps/api/src/models` | Mongoose schemas and indexes |
| `apps/api/src/middleware` | Authentication, tenant context, validation, rate limit, and errors |
| `packages/shared` | Shared types and constants |
| `render.yaml`, `vercel.json` | Deployment configuration examples |

## 5. Tenant, identity, and data model principles

- Tenant-owned records should carry a tenant identifier and queries should scope by both the record ID and authenticated tenant.
- Child references (for example, a section's grade or an assignment's student) should be validated as belonging to the same tenant.
- Client-provided tenant identifiers must not override the tenant established from the authenticated identity.
- Platform-admin access should be explicit and separate from school-level roles.
- Personal information, access tokens, passwords, and request payloads must not be written to logs.
- File uploads should use controlled object storage with size/type validation and access controls; large data URLs should not be stored in general-purpose records.

These are design and review requirements. They do not imply every existing service currently satisfies them.

## 6. Local development

Follow the [README setup steps](../README.md#get-started). In short: install Node.js 18+, enable Corepack, install with pnpm, copy the API and web `.env.example` files, configure MongoDB and local secrets, then run `pnpm dev`.

The API reads `apps/api/.env` in development and requires MongoDB. Production startup validates database URL, JWT secrets, and frontend origin; both JWT secrets must be at least 32 characters. The web app reads `VITE_API_URL` at build time.

### Useful commands

```bash
pnpm dev
pnpm type-check
pnpm build
pnpm --filter @acadflows/api seed:two-schools
```

No general automated test suite is configured in the root package scripts. The seed script mutates a database; use an isolated development database and inspect its behavior before running it.

## 7. API conventions

- Base path: `/api/v1`.
- Health endpoint: `GET /health`.
- Feature route definitions are in `apps/api/src/modules/*/routes.ts`.
- Controllers parse inputs and return JSON response envelopes; Zod schemas are used for validation in many request flows.
- Error and not-found handlers are registered at the end of the Express middleware chain.
- There is no generated OpenAPI document in the repository. Route files and controller schemas are the implementation source of truth.

Before adding or changing an endpoint, document its authentication requirement, school/tenant boundary, allowed roles, request validation, pagination behavior, and error responses.

## 8. Security and privacy review

School records can include children's personal information, guardian contacts, academic results, attendance, and financial data. A real deployment should complete a security and privacy review before onboarding a school.

### Minimum review areas

- Confirm every ID-based read, update, delete, and nested resource operation checks tenant ownership.
- Confirm role authorization for sensitive exports, grading, approvals, fee changes, and timetable administration.
- Review authentication storage, token lifetime, cookie settings, CORS origins, CSRF exposure, and XSS protections.
- Add and verify rate limits on login, registration, school-code lookups, and password-reset flows.
- Remove sensitive values from logs and define retention, access, and deletion controls for operational logs.
- Validate upload size, MIME type, storage location, retrieval authorization, and malware scanning needs.
- Use least-privilege database and storage credentials and rotate secrets.
- Define retention, correction, export, and deletion processes for student and guardian data.
- Verify backups and perform a restore exercise; define incident response and breach notification procedures.
- Get appropriate legal/privacy review for the jurisdictions and school contracts in which the service will operate.

## 9. Production readiness

The repository is an MVP codebase. Before production use with real data, owners should close and verify these areas:

### Release blockers to assess

- **Tenant isolation:** the repository audit identified unscoped by-ID operations in academic, assignment, timetable, and teacher workflows. Verify and fix these paths with tenant-scoped database queries and regression coverage.
- **Authorization:** verify schedule visibility and all role-sensitive operations on the server, not only in the web UI.
- **Verification:** install Node.js 18+ and run type-check, build, and lint in CI. Add API integration and tenant-boundary regression tests; tests are not currently configured as a complete suite.
- **API lint:** the API package declares an ESLint command, but API ESLint configuration was not present during the repository review.
- **Storage:** review profile/document storage and complete a controlled object-storage implementation before allowing large or sensitive uploads.
- **Monitoring:** add structured, privacy-safe logs, error tracking, uptime checks, database health monitoring, and alert ownership.
- **Reliability:** configure database backups, restoration drills, deployment rollback, and graceful shutdown/connection lifecycle behavior.
- **Performance:** assess initial frontend bundle size, paginated list endpoints, and indexes with realistic school-sized data.
- **Operations:** define support ownership, incident response, account recovery, tenant offboarding, data export, and deletion procedures.

Do not represent a checklist item as complete until its implementation and evidence have been reviewed. The project's current CI and runtime state can change independently of this document.

## 10. Deployment guide

The Render blueprint builds the shared package and API. The Vercel configuration routes SPA paths to `index.html`; set the Vite root/build configuration to the web app as required by the hosting project.

### Production configuration

Set at least the following for the API:

```text
NODE_ENV=production
MONGODB_URI=<restricted production database URI>
JWT_SECRET=<unique random secret, at least 32 characters>
JWT_REFRESH_SECRET=<different unique random secret, at least 32 characters>
FRONTEND_URL=<exact HTTPS frontend origin>
BASE_URL=<public frontend base URL>
```

Set `VITE_API_URL` in the web build environment to the HTTPS API URL ending in `/api/v1`. Configure DNS, TLS, CORS, database network access, secret storage, email, and backups through the hosting providers. Never commit production `.env` files or expose server secrets in web build variables.

### Release sequence

1. Review code and configuration changes; run the verification suite in a supported Node environment.
2. Deploy to a staging environment with isolated data and credentials.
3. Run smoke checks for health, authentication, tenant scoping, enrollment, attendance, fees, assignments, and messaging.
4. Confirm logs and alerts contain no sensitive payloads and route failures are visible.
5. Promote the build, verify production health, and monitor errors and database load.
6. Keep a rollback path and a tested database restore process.

## 11. Roadmap themes

Potential product-development themes (not delivery commitments):

- Close tenant-isolation and role-authorization gaps and establish integration-test coverage.
- Formalize API contracts with generated OpenAPI docs and endpoint examples.
- Complete secure upload storage, audit controls, and configurable retention workflows.
- Add verified payment-provider integrations and reconciliation workflows if required.
- Improve analytics, exports, accessibility, and mobile/tablet workflows.
- Establish operational observability, incident response, support, and tenant lifecycle tooling.

## 12. Support and change management

AcadFlows does not currently declare a public support policy or open-source license. For internal development, use repository issues or the project's established team process. For product releases, publish a version, migration notes, configuration changes, known issues, and rollback instructions.

## 13. Visual assets

Images in this document are remote Unsplash URLs and serve as illustrative placeholders; they are not product screenshots and require internet access. Check Unsplash's current license and terms before commercial reuse. Replace them with approved product screenshots and brand assets when available.
