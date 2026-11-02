import { Router } from 'express';
import { AttendanceController } from './controller';
import { requireRole } from '../../middleware/auth';
import { requireClassTeacherOrAdmin } from '../../middleware/class-teacher';

const router: Router = Router();

// Authentication + tenant match are applied at the app level in app.ts.
// See: app.use('/api/v1/attendance', authenticate, ensureTenantMatch, attendanceRoutes);

/* ─────────────────────────────────────────────────────────────
   Mark attendance
   ───────────────────────────────────────────────────────────── */
router.post(
  '/students',
  requireRole('admin', 'teacher'),
  requireClassTeacherOrAdmin(),
  AttendanceController.markStudentAttendance,
);

/* ─────────────────────────────────────────────────────────────
   Section reports — before /:sectionId catch-all
   ───────────────────────────────────────────────────────────── */
router.get(
  '/sections/:sectionId/report',
  requireRole('admin', 'teacher'),
  requireClassTeacherOrAdmin(),
  AttendanceController.getSectionReport,
);
/* ─────────────────────────────────────────────────────────────
   Dynamic routes — LAST
   ───────────────────────────────────────────────────────────── */
router.get('/students/:studentId', requireRole('admin', 'teacher'), AttendanceController.getStudentAttendance);
/* ─────────────────────────────────────────────────────────────
   Holiday + stats
   ───────────────────────────────────────────────────────────── */
router.post('/holiday', requireRole('admin'), AttendanceController.markHoliday);
router.get('/stats', requireRole('admin', 'teacher'), AttendanceController.getStats);

export default router;