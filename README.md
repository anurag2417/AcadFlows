# AcadFlows

![School community collaborating](https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=85)

**School operations in one connected workspace.** AcadFlows is a multi-tenant school management SaaS foundation for organizing academic operations, student records, attendance, fees, assignments, timetables, and school communication.

[Product overview](docs/SAAS_PRODUCT.md) · [API overview](#api) · [Local setup](#get-started) · [Deployment](#deployment)

> **Project status:** AcadFlows is an actively developed MVP foundation. The repository contains working product flows, but it has not been independently validated as a production-ready service. Review the security, operations, and release checklist in [the product documentation](docs/SAAS_PRODUCT.md#production-readiness) before handling real school or student data.

## Product at a glance

AcadFlows brings day-to-day school workflows into one browser application. School staff can maintain student and teacher records, configure academic structures, record attendance and fees, manage assignments, and communicate with their school community. Role-aware screens provide separate entry points for administrators, teachers, students, and guardians.

![Students learning in a classroom](https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1600&q=85)

### Current product areas

- **School accounts:** tenant registration and school-code flows.
- **People and records:** student, teacher, and user management, with approval workflows.
- **Academics:** academic years, grades, sections, subjects, and schedules.
- **Attendance:** attendance entry, tracking, and reports.
- **Fees:** fee structures, invoices, payments, and discounts.
- **Learning:** assignments, submissions, grading, gradebooks, and report cards.
- **Operations:** timetables, time slots, and room allocation.
- **Communication:** announcements, in-app notifications, and messaging.
- **Platform operations:** platform-admin views for school and user administration.

Feature availability and permissions are implemented in the application; see [known limitations](docs/SAAS_PRODUCT.md#production-readiness) before treating a workflow as production-ready.

## Technology

| Layer | Implementation |
|---|---|
| Web app | React 18, TypeScript, Vite, Tailwind CSS, React Router |
| API | Node.js, Express 4, TypeScript, Zod |
| Data | MongoDB with Mongoose |
| Authentication | JWT access tokens and refresh-token cookies |
| Monorepo | pnpm workspaces with shared TypeScript package |
| Deployment configuration | Render API blueprint and Vercel SPA rewrite |

## Repository layout

```text
apps/
  api/                 Express API, MongoDB models, middleware, and feature modules
  web/                 React single-page application
packages/
  shared/              Shared types and constants
docs/
  SAAS_PRODUCT.md      Product brief, workflows, architecture, and readiness guide
```

The API is organized by feature under `apps/api/src/modules`. Shared API middleware and configuration live under `apps/api/src/middleware` and `apps/api/src/config`. The web app's pages, components, contexts, and API clients live under `apps/web/src`.

## Get started

### Requirements

- Node.js 18 or later
- pnpm 9 (the lockfile uses format version 9)
- MongoDB 6 or later, local or hosted

### Install and configure

```bash
git clone https://github.com/anurag2417/AcadFlows.git
cd AcadFlows
corepack enable
pnpm install
```

Create local environment files from the examples:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

On PowerShell, use `Copy-Item apps/api/.env.example apps/api/.env` and the equivalent command for the web app. Set `MONGODB_URI`, `JWT_SECRET`, and `JWT_REFRESH_SECRET` in `apps/api/.env`. Use distinct, randomly generated secrets outside local development. Set `VITE_API_URL` in `apps/web/.env` to `http://localhost:5000/api/v1` for the default local API port.

Start the development services from the repository root:

```bash
pnpm dev
```

The web app runs at <http://localhost:5173> and the API at <http://localhost:5000>. The API health endpoint is <http://localhost:5000/health>. Ensure MongoDB is reachable before using API-backed workflows.

### Available commands

| Command | Purpose |
|---|---|
| `pnpm dev` | Start workspace development processes in parallel |
| `pnpm dev:web` | Start the Vite web app |
| `pnpm dev:api` | Start the API in watch mode |
| `pnpm build` | Build workspace packages and apps in parallel |
| `pnpm build:web` | Type-check and build the web app |
| `pnpm build:api` | Compile the API TypeScript |
| `pnpm type-check` | Run workspace TypeScript checks |
| `pnpm lint` | Run package lint scripts (API lint configuration may need setup) |

There is a two-school seed script in the API package: `pnpm --filter @acadflows/api seed:two-schools`. Use only against a disposable development database; inspect the script before running it against an existing database.

## Configuration

### API: `apps/api/.env`

| Variable | Required | Description |
|---|---:|---|
| `NODE_ENV` | No | Runtime mode; use `production` for deployment |
| `PORT` | No | HTTP port; defaults to `5000` |
| `MONGODB_URI` | Yes in production | MongoDB connection string |
| `JWT_SECRET` | Yes in production | Access-token signing secret; production requires 32+ characters |
| `JWT_REFRESH_SECRET` | Yes in production | Refresh-token signing secret; production requires 32+ characters |
| `JWT_EXPIRY` | No | Access-token lifetime; defaults to `60m` in code |
| `JWT_REFRESH_EXPIRY` | No | Refresh-token lifetime; defaults to `30d` in code |
| `FRONTEND_URL` | Yes in production | Allowed frontend origin for credentialed CORS |
| `BASE_URL` | No | Public frontend base URL used in links |
| `DEFAULT_TENANT_ID` | No | Default tenant context fallback |
| `PLATFORM_ADMIN_EMAIL` | No | Destination for platform-admin school-registration notifications |
| `RESEND_API_KEY` | No | Resend API key for outbound email |
| `EMAIL_FROM` | No | Sender address used by email service |
| `R2_ENDPOINT`, `R2_ACCESS_KEY`, `R2_SECRET_KEY`, `R2_BUCKET` | No | Optional object-storage configuration |

### Web: `apps/web/.env`

| Variable | Required | Description |
|---|---:|---|
| `VITE_API_URL` | Yes | API base URL, e.g. `https://api.example.com/api/v1` |

Only expose public configuration to the browser. Never put secrets in `VITE_*` variables.

## API

The versioned API is mounted at `/api/v1`. Main route groups include:

| Prefix | Area |
|---|---|
| `/auth` | Registration, login, refresh, logout, profile identity, and password flows |
| `/tenants` | School registration and tenant operations |
| `/students`, `/users`, `/teachers` | People and school records |
| `/academic`, `/public/academic` | Academic administration and public registration lookups |
| `/attendance` | Attendance operations and reporting |
| `/fees` | Fees, invoices, payments, and discounts |
| `/assignments` | Assignments, submissions, gradebooks, and report cards |
| `/timetable` | Timetables, entries, rooms, and time slots |
| `/communication` | Announcements, messages, and notifications |
| `/dashboard`, `/approvals`, `/documents`, `/platform` | Dashboards, approvals, documents, and platform administration |

Use the route files in `apps/api/src/modules/*/routes.ts` and their controllers as the source of truth for endpoint paths, HTTP methods, request schemas, and permissions. A generated OpenAPI specification is not currently included.

## Deployment

The repository includes `render.yaml` for the API and `vercel.json` for SPA routing. Treat those files as deployment starting points and review their commands and environment settings against the target hosting account.

1. Provision MongoDB with backups enabled and restrict database network access.
2. Deploy the API with the Render blueprint or an equivalent Node.js service. Set production `MONGODB_URI`, strong unique JWT secrets, and the exact browser origin in `FRONTEND_URL`.
3. Deploy `apps/web` as a Vite static site. Configure `VITE_API_URL` to the deployed API's `/api/v1` base URL.
4. Configure email and object storage only after validating credentials, access policies, and the application's integration behavior.
5. Verify health checks, registration/login, tenant boundaries, core workflows, backup restoration, and operational alerts before inviting users.

For a fuller deployment and operations checklist, see [SaaS product documentation](docs/SAAS_PRODUCT.md).

## Contributing

1. Create a branch for the change.
2. Keep changes scoped to the affected feature and update documentation when behavior changes.
3. Run the relevant type-check, build, and lint commands available in your environment.
4. Open a pull request with a concise summary, verification results, and any migrations or configuration changes.

## License

No open-source license is currently declared. Unless the repository owner adds one, all rights are reserved and reuse/distribution permissions should not be assumed.

## Image credits

Images are loaded directly from Unsplash Source image URLs and require internet access to display. They are illustrative product imagery, not screenshots of AcadFlows. Review Unsplash's current license and terms before reusing these images in a commercial deployment.
