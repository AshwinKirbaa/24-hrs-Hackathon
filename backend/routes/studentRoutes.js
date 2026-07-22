import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/role.js';
import { upload } from '../middleware/upload.js';
import {
  getStudentDashboard,
  submitAnswerSheet,
  getSubmissionStatus,
  getEvaluationResult,
  getAIFeedback,
  getStudentAnalytics,
} from '../controllers/studentController.js';

const router = Router();

router.use(authenticateToken);
router.use(authorizeRoles('student'));

// GET /api/student/dashboard
router.get('/dashboard', getStudentDashboard);

// POST /api/student/submissions (Multer upload)
router.post('/submissions', upload.single('file'), submitAnswerSheet);

// GET /api/student/submissions/:id/status
router.get('/submissions/:id/status', getSubmissionStatus);

// GET /api/student/evaluations/:submissionId
router.get('/evaluations/:submissionId', getEvaluationResult);

// GET /api/student/feedback/:evaluationId
router.get('/feedback/:evaluationId', getAIFeedback);

// GET /api/student/analytics
router.get('/analytics', getStudentAnalytics);

export default router;
