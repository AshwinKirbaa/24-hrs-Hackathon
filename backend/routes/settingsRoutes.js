import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getSettings, updateSettings, deleteAccount } from '../controllers/settingsController.js';

const router = Router();

router.use(authenticateToken);

// GET /api/settings
router.get('/', getSettings);

// PUT /api/settings
router.put('/', updateSettings);

// DELETE /api/settings/account
router.delete('/account', deleteAccount);

export default router;
