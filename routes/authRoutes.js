const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');
const { validateRegistration, validateLogin } = require('../middleware/validation');

/**
 * @route   POST /auth/register
 * @desc    Register a new user (Teacher/Admin)
 * @access  Public
 */
router.post('/register', validateRegistration, authController.register);

/**
 * @route   POST /auth/login
 * @desc    Login user & get JWT token
 * @access  Public
 */
router.post('/login', validateLogin, authController.login);

/**
 * @route   GET /auth/me
 * @desc    Get logged in user profile
 * @access  Private (JWT Protected)
 */
router.get('/me', verifyToken, authController.getProfile);

module.exports = router;
