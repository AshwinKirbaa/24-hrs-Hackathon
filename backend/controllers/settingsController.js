import { getUserSettings, updateUserSettings, deleteUserAccount } from '../models/userModel.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getSettings = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const settings = await getUserSettings(userId);

  res.status(200).json({
    success: true,
    message: 'User settings retrieved.',
    data: { settings },
  });
});

export const updateSettings = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { notifications, appearance, privacy } = req.body;

  const updatedSettings = await updateUserSettings(userId, { notifications, appearance, privacy });

  res.status(200).json({
    success: true,
    message: 'Settings saved successfully.',
    data: { settings: updatedSettings },
  });
});

export const deleteAccount = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  await deleteUserAccount(userId);

  res.status(200).json({
    success: true,
    message: 'Account deleted successfully.',
    data: { redirectUrl: 'landing.html' },
  });
});
