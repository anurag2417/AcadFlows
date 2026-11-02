import { Router } from 'express';
import { StudentController } from './controller';
import { StudentExportController } from './export.controller';
import { authenticate, requireRole, ensureTenantMatch } from '../../middleware/auth';

const router: Router = Router();

/* ─────────────────────────────────────────────────────────────
   Protected routes — everything below requires auth + tenant
   ───────────────────────────────────────────────────────────── */

router.use(authenticate);
router.use(ensureTenantMatch);

router.get('/me', StudentController.getCurrentStudent);

// ── Bulk operations (must come before /:studentId) ──
// Exports
router.get('/export', requireRole('admin'), StudentExportController.export);

// CRUD
router.get('/', requireRole('admin', 'teacher'), StudentController.getStudents);
router.get('/search', requireRole('admin', 'teacher'), StudentController.searchStudents);
router.get('/stats', requireRole('admin', 'teacher'), StudentController.getStats);
router.post('/', requireRole('admin'), StudentController.createStudent);
router.get('/:studentId', requireRole('admin', 'teacher'), StudentController.getStudentById);
router.put('/:studentId', requireRole('admin'), StudentController.updateStudent);
router.delete('/:studentId', requireRole('admin'), StudentController.deleteStudent);

router.post('/bulk-import', requireRole('admin'), StudentController.bulkImport);

export default router;
