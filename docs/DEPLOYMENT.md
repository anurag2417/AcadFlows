# AcadFlows Production Deployment & DevOps Runbook

This guide outlines the production deployment topology, environment configuration, infrastructure provisioning, and operational maintenance for AcadFlows.

---

## 1. Production Architecture Overview

AcadFlows is decoupled into modern edge static hosting for the React SPA and containerized cloud hosting for the Node.js Express API.

```
                  ┌─────────────────────────────────────────────────────────┐
                  │                 DNS & Edge CDN (Cloudflare)             │
                  │                 • SSL/TLS Termination                   │
                  │                 • DDoS Shield & WAF                     │
                  │                 • Wildcard *.acadflows.com              │
                  └────────────┬───────────────────────────────┬────────────┘
                               │                               │
                               ▼                               ▼
                     ┌──────────────────┐            ┌──────────────────┐
                     │   Vercel Edge    │            │ Render / Railway │
                     │   Frontend SPA   │            │ Express REST API │
                     │  (apps/web/dist) │            │ (apps/api/dist)  │
                     └──────────────────┘            └─────────┬────────┘
                                                               │
                                ┌──────────────────────────────┼──────────────────────────────┐
                                │                              │                              │
                                ▼                              ▼                              ▼
                     ┌──────────────────┐           ┌──────────────────┐           ┌──────────────────┐
                     │  MongoDB Atlas   │           │  Cloudflare R2   │           │ Resend / SendGrid│
                     │  Replica Set M10+│           │  Document Storage│           │ Transactional    │
                     │  Encrypted KMS   │           │  (S3-Compatible) │           │ Email Service    │
                     └──────────────────┘           └──────────────────┘           └──────────────────┘
```

---

## 2. Infrastructure Requirements & Topology

| Component | Recommended Provider | Minimum Sizing | Scaling Strategy |
|---|---|---|---|
| **Web Frontend** | Vercel / Cloudflare Pages | Global Edge CDN | Automatic edge replication |
| **API Backend** | Render / Railway / AWS ECS | 1 vCPU, 2 GB RAM (2 instances) | Horizontal auto-scale on CPU > 75% |
| **Database** | MongoDB Atlas | M10 Cluster (3-Node Replica Set) | Auto-scale storage, Point-in-Time Recovery |
| **Asset Storage**| Cloudflare R2 / AWS S3 | Object storage with pre-signed URLs | Unlimited multi-region bucket |
| **Email** | Resend / AWS SES | Verified Domain & DKIM/SPF/DMARC | Queued transactional worker |

---

## 3. Environment Variables & Secret Configuration

### 3.1 Backend API (`apps/api`)
Configure the following secrets in your deployment dashboard (Render Environment or AWS Secrets Manager):

| Variable | Type | Production Value Guide |
|---|---|---|
| `NODE_ENV` | String | `production` |
| `PORT` | Number | `5000` (or assigned by container runtime `$PORT`) |
| `MONGODB_URI` | URI | `mongodb+srv://<user>:<password>@cluster0.xxx.mongodb.net/acadflows_prod?retryWrites=true&w=majority` |
| `JWT_SECRET` | Secret | 64-character random hex string (`openssl rand -hex 32`) |
| `JWT_REFRESH_SECRET` | Secret | Distinct 64-character random hex string |
| `JWT_EXPIRY` | Duration | `15m` (Short-lived for high security) |
| `JWT_REFRESH_EXPIRY` | Duration | `30d` |
| `FRONTEND_URL` | URL | `https://acadflows.com` (Exact CORS browser origin) |
| `PLATFORM_ADMIN_EMAIL`| Email | `acadflows00@gmail.com` |
| `RESEND_API_KEY` | Secret | `re_xxxxxxxxxxxxxxxxxxxx` |
| `EMAIL_FROM` | String | `AcadFlows <notifications@acadflows.com>` |
| `R2_ENDPOINT` | URL | Cloudflare R2 S3 API URL |
| `R2_ACCESS_KEY` | Secret | R2 API token ID |
| `R2_SECRET_KEY` | Secret | R2 API token Secret |
| `R2_BUCKET` | String | `acadflows-production-assets` |

### 3.2 Frontend Web App (`apps/web`)
Set in Vercel Project Settings:

| Variable | Description | Value |
|---|---|---|
| `VITE_API_URL` | Public API Base URL | `https://api.acadflows.com/api/v1` |

> [!CAUTION]
> Never place backend secrets (database credentials, private keys, or API secrets) into `VITE_*` environment variables. Everything bundled in `apps/web` is publicly inspectable in client browser bundles.

---

## 4. Deployment Procedure

### 4.1 Deploying Frontend to Vercel
1. Link GitHub repository `anurag2417/AcadFlows` to Vercel.
2. Configure **Root Directory**: `apps/web`.
3. Configure **Build Command**:
   ```bash
   pnpm --filter @acadflows/shared build && pnpm --filter @acadflows/web build
   ```
4. Configure **Output Directory**: `dist`.
5. Ensure [vercel.json](file:///c:/AcadFlows-V1/vercel.json) routes all traffic to `index.html`:
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```

### 4.2 Deploying Backend to Render / Railway
1. Create a **Web Service** pointing to `anurag2417/AcadFlows`.
2. Configure **Build Command**:
   ```bash
   pnpm install --frozen-lockfile && pnpm --filter @acadflows/shared build && pnpm --filter @acadflows/api build
   ```
3. Configure **Start Command**:
   ```bash
   node apps/api/dist/server.js
   ```
4. Set **Health Check Path**: `/health`.

---

## 5. Database Provisioning & Atlas Configuration

1. **Network Access**:
   - In MongoDB Atlas, configure IP Access List with your backend IP ranges (or enable VPC Peering / AWS PrivateLink).
2. **Backups & Recovery**:
   - Enable Continuous Cloud Backups with Point-in-Time Recovery (PITR) window (minimum 7 days).
3. **Compound Index Verification**:
   - Ensure all models instantiate their unique compound indexes on cluster initialization.

---

## 6. Health Checks, Monitoring & Alerting

- **Liveness & Readiness**: Query `/health` every 30 seconds via UptimeRobot, BetterStack, or Datadog.
  ```json
  {
    "status": "ok",
    "version": "2026-09-15-attendance-routes",
    "timestamp": "2026-11-03T10:45:00.000Z"
  }
  ```
- **Error Tracking**: Integrate Sentry for both `apps/web` and `apps/api` with environment tagging (`production`).
- **Log Streaming**: Stream stdout logs to Papertrail or Datadog for searchable audit records.

