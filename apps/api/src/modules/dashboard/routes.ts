import { Router } from 'express';
import { DashboardController } from './controller';
import { requireRole } from '../../middleware/auth';

const router: Router = Router();

router.get('/', DashboardController.getDashboardData);
router.get('/stats', requireRole('admin', 'teacher'), DashboardController.getStats);
router.get('/recent-activity', DashboardController.getRecentActivity);
router.get('/students', requireRole('admin', 'teacher'), DashboardController.getStudents);
router.get('/teachers', requireRole('admin', 'teacher'), DashboardController.getTeachers);
router.get('/classes', requireRole('admin', 'teacher'), DashboardController.getClasses);

export default router;