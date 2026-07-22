import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/role.js';
import { upload } from '../middleware/upload.js';
import {
  getTeacherDashboard,
  createNewAssignment,
  getTeacherAssignments,
  getReviewQueue,
  moderateSubmission,
  getTeacherAnalytics,
} from '../controllers/teacherController.js';

const router = Router();

router.use(authenticateToken);
router.use(authorizeRoles('teacher'));

// GET /api/teacher/dashboard
router.get('/dashboard', getTeacherDashboard);

// POST /api/teacher/assignments
router.post('/assignments', upload.single('model_answer_file'), createNewAssignment);

// GET /api/teacher/assignments
router.get('/assignments', getTeacherAssignments);

// GET /api/teacher/review-queue
router.get('/review-queue', getReviewQueue);

// PUT /api/teacher/review-queue/:submissionId/moderate
router.put('/review-queue/:submissionId/moderate', moderateSubmission);

// GET /api/teacher/analytics
router.get('/analytics', getTeacherAnalytics);

export default router;
