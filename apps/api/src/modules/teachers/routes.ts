import { Router } from 'express';
import { TeacherController } from './controller';
import { TeacherExportController } from './export.controller';
import { TeacherApprovalsController } from './me-approvals.controller';
import { authenticate, requireRole, ensureTenantMatch } from '../../middleware/auth';

const router: Router = Router();

router.use(authenticate);
router.use(ensureTenantMatch);

// Current user's teacher profile
router.get('/me', TeacherController.getCurrentTeacher);

router.get('/me/class-roster', requireRole('teacher'), TeacherApprovalsController.getClassRoster);

// Teacher CRUD
router.get('/', requireRole('admin'), TeacherController.getTeachers);
router.get('/stats', requireRole('admin'), TeacherController.getStats);
router.post('/', requireRole('admin'), TeacherController.createTeacher);

// ⚠️ Export MUST come before /:teacherId
router.get('/export', requireRole('admin'), TeacherExportController.export);

// Teacher-specific
router.get('/:teacherId', TeacherController.getTeacherById);
router.put('/:teacherId', requireRole('admin'), TeacherController.updateTeacher);
router.delete('/:teacherId', requireRole('admin'), TeacherController.deleteTeacher);

router.post('/:teacherId/subjects', requireRole('admin'), TeacherController.assignSubject);
router.delete(
  '/:teacherId/subjects/:subjectId/sections/:sectionId',
  requireRole('admin'),
  TeacherController.removeSubject,
);

router.get('/:teacherId/schedule', TeacherController.getSchedule);
export default router;