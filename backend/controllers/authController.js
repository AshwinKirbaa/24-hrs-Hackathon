import bcrypt from 'bcryptjs';
import { findUserByEmail, createUser, createStudentProfile, findUserById } from '../models/userModel.js';
import { generateToken } from '../config/jwt.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const studentSignup = asyncHandler(async (req, res) => {
  const { full_name, email, password, college, department, year, roll_number } = req.body;

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'An account with this email address already exists.',
      errors: ['Email address is already registered'],
    });
  }

  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);

  const userId = await createUser({ full_name, email, password_hash, role: 'student' });
  await createStudentProfile(userId, { college, department, year, roll_number });

  const user = await findUserById(userId);
  const token = generateToken({ id: user.id, role: user.role, email: user.email });

  res.status(201).json({
    success: true,
    message: 'Student account created successfully.',
    data: { token, user },
  });
});

export const studentLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);
  if (!user || user.role !== 'student') {
    return res.status(401).json({
      success: false,
      message: 'Invalid student credentials.',
      errors: ['Invalid email or password'],
    });
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid student credentials.',
      errors: ['Invalid email or password'],
    });
  }

  const fullUser = await findUserById(user.id);
  const token = generateToken({ id: user.id, role: user.role, email: user.email });

  res.status(200).json({
    success: true,
    message: 'Authenticated successfully.',
    data: { token, user: fullUser },
  });
});

export const teacherLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);
  if (!user || user.role !== 'teacher') {
    return res.status(401).json({
      success: false,
      message: 'Invalid faculty credentials.',
      errors: ['Invalid institutional email or password'],
    });
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid faculty credentials.',
      errors: ['Invalid institutional email or password'],
    });
  }

  const fullUser = await findUserById(user.id);
  const token = generateToken({ id: user.id, role: user.role, email: user.email });

  res.status(200).json({
    success: true,
    message: 'Authenticated faculty successfully.',
    data: { token, user: fullUser },
  });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await findUserById(req.user.id);
  res.status(200).json({
    success: true,
    message: 'User profile retrieved.',
    data: { user },
  });
});
