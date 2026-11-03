# AcadFlows Local Development & Engineering Manual

Welcome to the AcadFlows engineering team. This guide walks you through setting up your local development workspace, understanding our monorepo architecture, and adhering to our coding standards.

---

## 1. Prerequisites

Before setting up the repository, ensure your machine has the following tools installed:

- **Node.js**: `v18.0.0` or higher (`v20.x` LTS recommended)
- **pnpm**: `v9.x` or `v10.x` (`corepack enable && corepack prepare pnpm@latest --activate`)
- **MongoDB**: `v6.0+` locally or a free MongoDB Atlas development cluster connection
- **Git**: `v2.30+`

---

## 2. Workspace Setup

### 2.1 Clone and Install
```bash
git clone https://github.com/anurag2417/AcadFlows.git
cd AcadFlows

# Install dependencies across all packages
pnpm install
```

### 2.2 Configure Local Environment Variables

1. **Backend API**:
   ```bash
   cp apps/api/.env.example apps/api/.env
   ```
   Edit `apps/api/.env`:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/acadflows_dev
   JWT_SECRET=super-secret-development-jwt-key-minimum-32-chars-long!
   JWT_REFRESH_SECRET=super-secret-development-refresh-jwt-key-minimum-32-chars!
   JWT_EXPIRY=60m
   JWT_REFRESH_EXPIRY=30d
   FRONTEND_URL=http://localhost:5173
   PLATFORM_ADMIN_EMAIL=acadflows00@gmail.com
   ```

2. **Frontend Web**:
   ```bash
   cp apps/web/.env.example apps/web/.env
   ```
   Edit `apps/web/.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api/v1
   ```

---

## 3. Seed Data & Platform Admin Initialization

To test features locally, populate your local database with sample schools, academic calendars, teachers, and students:

### 3.1 Initialize Platform Super-Admin Account
Run the platform super-admin creation utility:
```bash
pnpm --filter @acadflows/api create-platform-admin
```
This provisions the root founder admin account:
- **Email**: `acadflows00@gmail.com`
- **Password**: `AcadFlows#2026$FounderAdmin!`
- **Role**: Platform Super-Admin (`isPlatformAdmin: true`)

### 3.2 Seed Development Schools & Sample Data
```bash
pnpm --filter @acadflows/api seed:two-schools
```
This creates:
- Two sample educational institutions (`Springfield Academy` and `Oakridge International`)
- Admin, teacher, student, and parent test credentials
- Complete academic hierarchies, timetables, and sample fee structures

---

## 4. Running the Development Environment

Start both frontend and backend concurrently in watch mode:

```bash
pnpm dev
```

- **Frontend App**: [http://localhost:5173](http://localhost:5173)
- **REST API**: [http://localhost:5000/api/v1](http://localhost:5000/api/v1)
- **API Health Check**: [http://localhost:5000/health](http://localhost:5000/health)

### Running Services Separately:
```bash
# Start frontend only
pnpm dev:web

# Start API only
pnpm dev:api
```

---

## 5. Monorepo Structure & Package Workflows

The repository is organized as a pnpm workspace:
```text
AcadFlows/
├── apps/
│   ├── api/            # Express REST API
│   └── web/            # React 18 SPA (Vite)
├── packages/
│   └── shared/         # Shared TypeScript interfaces, types, and constants
└── docs/               # System architecture and technical runbooks
```

### 5.1 Shared Package (`@acadflows/shared`)
Whenever you add or modify types in `packages/shared/src/types/`:
```bash
pnpm --filter @acadflows/shared build
```
> [!IMPORTANT]
> Both `apps/api` and `apps/web` depend on `@acadflows/shared/dist`. The root scripts `pnpm prebuild`, `pnpm pretype-check`, and `pnpm prelint` automatically compile this package, but when writing shared code, run the build step to see fresh types in your IDE.

### 5.2 TypeScript & `verbatimModuleSyntax` Rule
In `apps/web`, TypeScript enforces `verbatimModuleSyntax`. When importing interfaces or types from other modules:
```typescript
// ❌ Incorrect (will fail CI with TS1484)
import { BaseEntity, TenantScoped } from './common';

// ✅ Correct
import type { BaseEntity, TenantScoped } from './common';
```

---

## 6. Code Quality, Validation & CI

Before committing your changes, always run the validation suite:

```bash
# Type check all packages
pnpm run type-check

# Run linter
pnpm run lint

# Verify full production build
pnpm run build
```

---

## 7. Git Workflow & Commit Guidelines

We use conventional commit formatting:
- `feat(students): add guardian relationship phone validation`
- `fix(types): enforce type-only import for verbatimModuleSyntax`
- `docs(api): document platform school verification endpoints`
- `refactor(web): extract responsive navbar drawer into separate component`
