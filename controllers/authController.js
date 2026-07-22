const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const { sendSuccess, sendError } = require('../utils/responseHandler');

/**
 * Register new user
 * POST /auth/register
 */
const register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await UserModel.findByEmail(email);
        if (existingUser) {
            return sendError(res, 'User with this email already exists.', 400);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save user
        const userId = await UserModel.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'teacher'
        });

        // Generate JWT Token
        const token = jwt.sign(
            { user_id: userId, email, name, role: role || 'teacher' },
            process.env.JWT_SECRET || 'twineval_super_secret_jwt_key_2026_hackathon',
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        return sendSuccess(res, 'User registered successfully', {
            user_id: userId,
            name,
            email,
            role: role || 'teacher',
            token
        }, 201);
    } catch (error) {
        next(error);
    }
};

/**
 * Login user
 * POST /auth/login
 */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await UserModel.findByEmail(email);
        if (!user) {
            return sendError(res, 'Invalid credentials. User not found.', 401);
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return sendError(res, 'Invalid credentials. Password incorrect.', 401);
        }

        // Generate JWT Token
        const token = jwt.sign(
            { user_id: user.user_id, email: user.email, name: user.name, role: user.role },
            process.env.JWT_SECRET || 'twineval_super_secret_jwt_key_2026_hackathon',
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        return sendSuccess(res, 'Login successful', {
            user_id: user.user_id,
            name: user.name,
            email: user.email,
            role: user.role,
            token
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get current user profile
 * GET /auth/me
 */
const getProfile = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.user.user_id);
        if (!user) {
            return sendError(res, 'User profile not found', 404);
        }
        return sendSuccess(res, 'User profile retrieved successfully', user);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    getProfile
};
