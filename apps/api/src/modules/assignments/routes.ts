import { Router } from 'express';
import { AssignmentController } from './controller';
import { requireRole } from '../../middleware/auth';

const router: Router = Router();

// Auth + tenant match are applied in app.ts.

router.get('/', AssignmentController.getAssignments);
router.post('/', requireRole('admin', 'teacher'), AssignmentController.createAssignment);

router.get('/submissions', AssignmentController.getSubmissions);
router.post('/submissions', AssignmentController.submitAssignment);
router.get('/submissions/:id', AssignmentController.getSubmissionById);
router.put('/submissions/:id/grade', requireRole('admin', 'teacher'), AssignmentController.gradeSubmission);

router.get('/gradebook/:studentId/:academicYearId', AssignmentController.getGradebook);
router.get('/progress/:studentId/:academicYearId', AssignmentController.getStudentProgress);

router.get('/report-cards', AssignmentController.getReportCards);
router.post('/report-cards', requireRole('admin', 'teacher'), AssignmentController.generateReportCard);
router.get('/report-cards/:id', AssignmentController.getReportCardById);
router.put('/report-cards/:id/publish', requireRole('admin', 'teacher'), AssignmentController.publishReportCard);

router.get('/:id/stats', requireRole('admin', 'teacher'), AssignmentController.getAssignmentStats);
router.get('/:id', AssignmentController.getAssignmentById);
router.put('/:id', requireRole('admin', 'teacher'), AssignmentController.updateAssignment);
router.delete('/:id', requireRole('admin', 'teacher'), AssignmentController.deleteAssignment);

export default router;