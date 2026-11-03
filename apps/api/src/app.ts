import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { config } from './config';
import { errorHandler } from './middleware/error-handler';
import { notFoundHandler } from './middleware/not-found';
import { tenantContext } from './middleware/tenant-context';
import { auditLog } from './middleware/audit-log';
import { connectDB } from './config/database';
import { authenticate, ensureTenantMatch } from './middleware/auth';
import { apiLimiter } from './middleware/rate-limit';

// Import routes
import authRoutes from './modules/auth/routes';
import tenantRoutes from './modules/tenant/routes';
import dashboardRoutes from './modules/dashboard/routes';
import studentRoutes from './modules/students/routes';
import userRoutes from './modules/user/routes';
import academicRoutes from './modules/academic/routes';
import teacherRoutes from './modules/teachers/routes';
import assignmentRoutes from './modules/assignments/routes';
import timetableRoutes from './modules/timetable/routes';
import attendanceRoutes from './modules/attendance/routes';
import platformRoutes from './modules/platform/routes';

const app: Express = express();

// Connect to MongoDB
connectDB();

/* ─────────────────────────────────────────────────────────────
   Trust proxy — required on Render, Vercel, and any reverse proxy
   ───────────────────────────────────────────────────────────── */
app.set('trust proxy', 1);

/* ─────────────────────────────────────────────────────────────
   Security headers
   ───────────────────────────────────────────────────────────── */
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false,
  }),
);

/* ─────────────────────────────────────────────────────────────
   CORS
   ───────────────────────────────────────────────────────────── */
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
  }),
);

/* ─────────────────────────────────────────────────────────────
   Body parsers
   ───────────────────────────────────────────────────────────── */
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());
app.use(apiLimiter);

/* ─────────────────────────────────────────────────────────────
   Tenant context (cached) — runs for every request
   ───────────────────────────────────────────────────────────── */
app.use(tenantContext);

/* ─────────────────────────────────────────────────────────────
   Audit log — records mutating requests
   ───────────────────────────────────────────────────────────── */
app.use(auditLog);

/* ─────────────────────────────────────────────────────────────
   Health check
   ───────────────────────────────────────────────────────────── */
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    version: '2026-09-15-attendance-routes',
    timestamp: new Date().toISOString(),
  });
});

/* ─────────────────────────────────────────────────────────────
   Public modules (no auth required)
   ───────────────────────────────────────────────────────────── */
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tenants', tenantRoutes);

// Students & Users have public routes — modules handle their own auth
app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/users', userRoutes);

// Platform Admin module (cross-tenant, handles own auth + platform admin verification)
app.use('/api/v1/platform', platformRoutes);

/* ─────────────────────────────────────────────────────────────
   Fully-protected modules

   IMPORTANT: `authenticate` MUST come before `ensureTenantMatch`.
   The modules' own routes.ts files should NOT apply these — they
   are applied here to guarantee the correct order.
   ───────────────────────────────────────────────────────────── */
app.use('/api/v1/academic', authenticate, ensureTenantMatch, academicRoutes);
app.use('/api/v1/dashboard', authenticate, ensureTenantMatch, dashboardRoutes);
app.use('/api/v1/teachers', authenticate, ensureTenantMatch, teacherRoutes);
app.use('/api/v1/assignments', authenticate, ensureTenantMatch, assignmentRoutes);
app.use('/api/v1/timetable', authenticate, ensureTenantMatch, timetableRoutes);
app.use('/api/v1/attendance', authenticate, ensureTenantMatch, attendanceRoutes);

/* ─────────────────────────────────────────────────────────────
   Error handling (must be last)
   ───────────────────────────────────────────────────────────── */
app.use(notFoundHandler);
app.use(errorHandler);

export default app;