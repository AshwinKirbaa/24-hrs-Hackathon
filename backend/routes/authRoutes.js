import { Router } from 'express';
import { body } from 'express-validator';
import { studentSignup, studentLogin, teacherLogin, getCurrentUser } from '../controllers/authController.js';
import { handleValidationErrors } from '../middleware/validate.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// POST /api/auth/student/signup
router.post(
  '/student/signup',
  [
    body('full_name').notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    handleValidationErrors,
  ],
  studentSignup
);

// POST /api/auth/student/login
router.post(
  '/student/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    handleValidationErrors,
  ],
  studentLogin
);

// POST /api/auth/teacher/login
router.post(
  '/teacher/login',
  [
    body('email').isEmail().withMessage('Valid institutional email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    handleValidationErrors,
  ],
  teacherLogin
);

// GET /api/auth/me
router.get('/me', authenticateToken, getCurrentUser);

export default router;
