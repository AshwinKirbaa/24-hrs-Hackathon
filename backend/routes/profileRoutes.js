import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { getProfile, updateProfile, uploadAvatar } from '../controllers/profileController.js';

const router = Router();

router.use(authenticateToken);

// GET /api/profile
router.get('/', getProfile);

// PUT /api/profile
router.put('/', updateProfile);

// POST /api/profile/avatar
router.post('/avatar', upload.single('avatar'), uploadAvatar);

export default router;
