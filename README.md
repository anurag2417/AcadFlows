# AcadFlows

<div align="center">

![AcadFlows Banner](https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=85)

### Intelligent, Multi-Tenant School Operations & Learning Platform

[![CI Pipeline](https://github.com/anurag2417/AcadFlows/actions/workflows/ci.yml/badge.svg)](https://github.com/anurag2417/AcadFlows/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248.svg)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![License: Proprietary](https://img.shields.io/badge/License-All_Rights_Reserved-red.svg)](#license)

[Documentation Hub](#-documentation-suite) · [Architecture](docs/ARCHITECTURE.md) · [API Reference](docs/API_REFERENCE.md) · [Quickstart](#-quickstart) · [Deployment Runbook](docs/DEPLOYMENT.md)

</div>

---

## 🌟 Executive Summary

**AcadFlows** is a modern, enterprise-ready multi-tenant SaaS platform built to unify school administration, academic hierarchies, classroom workflows, attendance tracking, billing, and communication into one connected, single-device responsive web application.

Designed from the ground up with strict **tenant isolation**, AcadFlows provides specialized portals tailored for:
- 🏛️ **School Administrators**: Institutional configuration, staff/student admissions, fee structures, and timetables.
- 🧑‍🏫 **Educators**: Roll-call attendance, gradebooks, assignment issuance, and class rosters.
- 🎓 **Students**: Coursework submissions, timetables, personal gradebooks, and report cards.
- 👨‍👩‍👧 **Guardians**: Real-time student attendance monitoring, fee invoice settlement, and school dispatches.
- 🛡️ **Platform Super-Admins**: Cross-tenant institutional onboarding, KYC approval, and platform security audits.

---

## 📚 Documentation Suite

AcadFlows maintains an enterprise-grade documentation ecosystem across engineering, security, and operations:

| Document | Focus Area | Description |
|---|---|---|
| [System Architecture](docs/ARCHITECTURE.md) | **Engineering** | Monorepo design, multi-tenant isolation model, request lifecycle, and frontend state. |
| [REST API Reference](docs/API_REFERENCE.md) | **Integration** | Complete endpoint catalogue, authentication headers, schemas, and error codes. |
| [Security & Compliance](docs/SECURITY.md) | **InfoSec** | RBAC matrix, JWT lifecycle, data privacy protocols (FERPA, COPPA, GDPR), and audit logs. |
| [Database Schema](docs/DATABASE_SCHEMA.md) | **Data** | Entity-Relationship breakdown, collections, schemas, and compound index strategy. |
| [Production Deployment](docs/DEPLOYMENT.md) | **DevOps** | Zero-downtime deployment on Vercel & Render, secrets configuration, and health monitoring. |
| [Engineering Manual](docs/DEVELOPMENT.md) | **Development** | Local workspace setup, seeds, TypeScript strict rules, and contribution workflow. |
| [Platform Admin SOP](docs/PLATFORM_ADMIN_GUIDE.md) | **Operations** | Playbook for verifying, approving, and auditing schools via the platform admin dashboard. |
| [Incident Response](docs/INCIDENT_RESPONSE.md) | **Reliability** | Severity levels (SEV-0 to SEV-3), containment playbooks, and disaster recovery. |
| [Upcoming Features PRD](docs/UPCOMING_FEATURES.md) | **Roadmap** | Specifications for Mobile App, Digital Fees, Perplexity AI Workspace, Shiksha Sathi, & VisionFlow Face Attendance. |
| [Master Execution Plan](docs/MASTER_EXECUTION_PLAN.md) | **Strategy** | Step-by-step phased execution blueprint: Core Web App Polish ➔ Web Integrations ➔ Mobile App. |
| [Product Roadmap](docs/SAAS_PRODUCT.md) | **Product** | High-level product vision, feature capabilities, and market readiness roadmap. |
| [Contributing Guide](CONTRIBUTING.md) | **Community** | Code standards, Git commit guidelines, and pull request procedures. |
| [Code of Conduct](CODE_OF_CONDUCT.md) | **Community** | Contributor Covenant standards and community safety guidelines. |

---

## 🏗️ System Architecture

AcadFlows runs as a high-performance modular monolith with strict tenant-scoping boundaries at every layer:

```
                            ┌─────────────────────────────────────────┐
                            │               Client App                │
                            │      React 18 + Vite + Tailwind CSS     │
                            │      Responsive Single-Device Layout    │
                            └────────────────────┬────────────────────┘
                                                 │
                                    HTTPS / TLS 1.3 | WSS
                                    x-tenant-id Header
                                    JWT Bearer + HttpOnly Cookies
                                                 │
                                                 ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              AcadFlows API (Node.js + Express)                         │
│                                                                                        │
│  [Helmet] ──► [CORS] ──► [TenantContext] ──► [AuditLogger] ──► [Authenticate/RBAC]     │
│                                            │                                           │
│  ┌─────────────────────────────────────────▼────────────────────────────────────────┐  │
│  │                            Feature Domain Modules                                │  │
│  │  • Auth & Identity   • Students & Staff   • Academic Engine   • Timetable        │  │
│  │  • Attendance        • Fees & Invoicing   • Assignments & LMS • Communication    │  │
│  │  • Platform Admin    • Document Vault     • Approvals         • Reports          │  │
│  └─────────────────────────────────────────┬────────────────────────────────────────┘  │
└────────────────────────────────────────────┼───────────────────────────────────────────┘
                                             │
                      ┌──────────────────────┼──────────────────────┐
                      ▼                      ▼                      ▼
           ┌─────────────────────┐┌─────────────────────┐┌─────────────────────┐
           │   MongoDB Atlas     ││  Cloudflare R2 / S3 ││  Resend / SendGrid  │
           │  Multi-Tenant DB    ││  Encrypted Media    ││  Transactional Mail │
           │  (Compound Indexes) ││  & Document Storage ││  & Notifications    │
           └─────────────────────┘└─────────────────────┘└─────────────────────┘
```

---

## 🛠️ Technology Stack

| Layer | Technologies & Tools |
|---|---|
| **Web Application** | React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, React Router 6 |
| **Backend API** | Node.js 20, Express 4, TypeScript, Zod, Helmet, Cookie-Parser |
| **Data Layer** | MongoDB 6+, Mongoose ODM, Compound Tenant Indexes |
| **Authentication** | Dual-Token JWT (Short-lived access token + HttpOnly refresh cookie), Bcrypt |
| **Monorepo Tooling** | pnpm workspaces, TypeScript project references |
| **DevOps & Cloud** | Vercel (Edge SPA), Render (API Web Service), Cloudflare R2, GitHub Actions CI |

---

## 🚀 Quickstart

### Prerequisites
- **Node.js** 18+ (`v20.x` recommended)
- **pnpm** 9+ (`corepack enable && corepack prepare pnpm@latest --activate`)
- **MongoDB** running locally or a MongoDB Atlas connection string

### 1. Clone & Install
```bash
git clone https://github.com/anurag2417/AcadFlows.git
cd AcadFlows
pnpm install
```

### 2. Configure Environment Variables
```bash
# Setup backend environment
cp apps/api/.env.example apps/api/.env

# Setup frontend environment
cp apps/web/.env.example apps/web/.env
```
*Review [Engineering Manual](docs/DEVELOPMENT.md) for required keys and sample development secrets.*

### 3. Seed Database & Founder Account
```bash
# Initialize Platform Super-Admin account (acadflows00@gmail.com)
pnpm --filter @acadflows/api create-platform-admin

# Seed two test schools with complete academic and student data
pnpm --filter @acadflows/api seed:two-schools
```

### 4. Run Development Servers
```bash
pnpm dev
```
- **Web App**: [http://localhost:5173](http://localhost:5173)
- **API Server**: [http://localhost:5000/api/v1](http://localhost:5000/api/v1)
- **Health Check**: [http://localhost:5000/health](http://localhost:5000/health)

---

## 💻 Workspace Commands

| Command | Action |
|---|---|
| `pnpm dev` | Start web and API development processes concurrently |
| `pnpm build` | Compile shared packages, web app, and API |
| `pnpm build:web` | Run TypeScript check and Vite production bundle |
| `pnpm build:api` | Compile API TypeScript into `dist/` |
| `pnpm type-check` | Execute workspace-wide TypeScript type-check |
| `pnpm lint` | Execute ESLint across all projects |

---

## 🔒 Security & Tenant Isolation

AcadFlows treats school data privacy as an inviolable boundary:
- **Tenant Context Verification**: Queries are bounded by `tenantId` resolved via `x-tenant-id` header or domain slug.
- **Compound Database Keys**: Index-level guarantees enforce unique constraints strictly within tenant boundaries.
- **Compliance Ready**: Engineered to align with **FERPA**, **COPPA**, and **GDPR** educational privacy guidelines.
- **Vulnerability Reporting**: Report security findings confidentially to `acadflows00@gmail.com`.

---

## 🔮 Upcoming Breakthrough Innovations

We are actively engineering five major product extensions to transform school operations and learning:

1. 📱 **Mobile App & Unified Communication Hub**: React Native iOS & Android application featuring secure teacher-parent chat, push broadcasts, circular acknowledgments, and emergency dispatches.
2. 💳 **Omnichannel Digital Fee Payments**: 1-click UPI, card, and NetBanking fee payments across both web and mobile, automated installment scheduling, and instant tax-compliant PDF receipts.
3. 🧠 **Perplexity AI Educational Workspace**: Full-stack Q&A and research environment for students and teachers featuring persistent conversation threads, verified academic source citations, and safe Socratic tutoring.
4. 🇮🇳 **Shiksha Sathi (NCERT / CBSE / NEP 2020 Platform)**: Purpose-built Indian curriculum engine with curated question banks, 1-click AI homework generation, and rubric-based auto-feedback — provided at zero cost.
5. 📷 **VisionFlow: Classroom Group Face Attendance**: AI computer vision attendance allowing teachers to snap a single class photo on mobile, automatically detect and match students against enrolled embeddings, and mark roll-call in under 5 seconds.

*Read the detailed technical specifications and architecture in the [Upcoming Features PRD](docs/UPCOMING_FEATURES.md).*

---

## 📄 License & Proprietary Notice

Copyright © 2026 AcadFlows Inc. All rights reserved.

This source code and related assets are proprietary. Unauthorized copying, distribution, modification, or commercial use without prior written consent is strictly prohibited.
