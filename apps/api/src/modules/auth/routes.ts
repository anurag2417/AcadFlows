import { Router } from 'express';
import { AuthController } from './controller';
import { authenticate } from '../../middleware/auth';
import { loginLimiter } from '../../middleware/rate-limit';

const router: Router = Router();

// Public routes
router.post('/register', AuthController.register);
router.post('/login', loginLimiter, AuthController.login);
router.post('/refresh', AuthController.refresh);
router.post('/forgot-password', loginLimiter, AuthController.forgotPassword);
router.post('/reset-password', loginLimiter, AuthController.resetPassword);

// Protected routes
router.post('/logout', authenticate, AuthController.logout);
router.get('/me', authenticate, AuthController.me);
router.post('/change-password', authenticate, AuthController.changePassword);

export default router;