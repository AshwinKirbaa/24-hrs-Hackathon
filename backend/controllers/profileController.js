import { findUserById, updateUserProfile, updateAvatarUrl } from '../models/userModel.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getProfile = asyncHandler(async (req, res) => {
  const user = await findUserById(req.user.id);
  res.status(200).json({
    success: true,
    message: 'Profile details retrieved successfully.',
    data: { user },
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { full_name, email, college, department, year, roll_number } = req.body;

  const updatedUser = await updateUserProfile(userId, {
    full_name,
    email,
    college,
    department,
    year,
    roll_number,
  });

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully.',
    data: { user: updatedUser },
  });
});

export const uploadAvatar = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No avatar image file provided.',
      errors: ['Missing avatar file'],
    });
  }

  const avatarUrl = `/uploads/${req.file.filename}`;
  await updateAvatarUrl(userId, avatarUrl);

  const user = await findUserById(userId);

  res.status(200).json({
    success: true,
    message: 'Avatar updated successfully.',
    data: { avatarUrl, user },
  });
});
