import { Router } from 'express';
import { evaluateStudent, generateLearningPlan } from '../controllers/aiController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Allow authenticated users to access AI evaluation & learning plan features
router.post('/evaluate', authenticateToken, evaluateStudent);
router.post('/learning-plan', authenticateToken, generateLearningPlan);

export default router;
