import { Router } from 'express';
import { AuthController } from './controller';
import { authenticate } from '../../middleware/auth';
import { loginLimiter } from '../../middleware/rate-limit';

const router: Router = Router();

// Accounts are provisioned by a school administrator. There is intentionally
// no public registration endpoint for students, teachers, or guardians.
// Public routes
router.post('/login', loginLimiter, AuthController.login);
router.post('/refresh', AuthController.refresh);
router.post('/forgot-password', loginLimiter, AuthController.forgotPassword);
router.post('/reset-password', loginLimiter, AuthController.resetPassword);

// Protected routes
router.post('/logout', authenticate, AuthController.logout);
router.get('/me', authenticate, AuthController.me);
router.post('/change-password', authenticate, AuthController.changePassword);

export default router;