import { query } from '../config/db.js';

export const findUserByEmail = async (email) => {
  const users = await query('SELECT * FROM users WHERE email = ?', [email]);
  return users[0] || null;
};

export const findUserById = async (id) => {
  const users = await query(
    `SELECT u.id, u.full_name, u.email, u.role, u.created_at,
            sp.college, sp.department, sp.year, sp.roll_number, sp.avatar_url
     FROM users u
     LEFT JOIN student_profiles sp ON u.id = sp.user_id
     WHERE u.id = ?`,
    [id]
  );
  return users[0] || null;
};

export const createUser = async ({ full_name, email, password_hash, role = 'student' }) => {
  const result = await query(
    'INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)',
    [full_name, email, password_hash, role]
  );
  return result.insertId;
};

export const createStudentProfile = async (userId, { college, department, year, roll_number }) => {
  await query(
    'INSERT INTO student_profiles (user_id, college, department, year, roll_number) VALUES (?, ?, ?, ?, ?)',
    [userId, college || null, department || null, year || null, roll_number || null]
  );
};

export const updateUserProfile = async (userId, { full_name, email, college, department, year, roll_number }) => {
  if (full_name || email) {
    await query(
      'UPDATE users SET full_name = COALESCE(?, full_name), email = COALESCE(?, email) WHERE id = ?',
      [full_name || null, email || null, userId]
    );
  }

  const existingProfile = await query('SELECT id FROM student_profiles WHERE user_id = ?', [userId]);
  if (existingProfile.length > 0) {
    await query(
      `UPDATE student_profiles
       SET college = COALESCE(?, college),
           department = COALESCE(?, department),
           year = COALESCE(?, year),
           roll_number = COALESCE(?, roll_number)
       WHERE user_id = ?`,
      [college || null, department || null, year || null, roll_number || null, userId]
    );
  } else {
    await createStudentProfile(userId, { college, department, year, roll_number });
  }

  return await findUserById(userId);
};

export const updateAvatarUrl = async (userId, avatarUrl) => {
  const existingProfile = await query('SELECT id FROM student_profiles WHERE user_id = ?', [userId]);
  if (existingProfile.length > 0) {
    await query('UPDATE student_profiles SET avatar_url = ? WHERE user_id = ?', [avatarUrl, userId]);
  } else {
    await query('INSERT INTO student_profiles (user_id, avatar_url) VALUES (?, ?)', [userId, avatarUrl]);
  }
};

export const deleteUserAccount = async (userId) => {
  await query('DELETE FROM users WHERE id = ?', [userId]);
};

export const getUserSettings = async (userId) => {
  const settings = await query('SELECT * FROM user_settings WHERE user_id = ?', [userId]);
  if (settings.length === 0) {
    return {
      notifications: { evaluationCompleted: true, newFeedback: true, weeklyDigest: false, productUpdates: false },
      appearance: { theme: 'Dark (default)', density: 'Comfortable' },
      privacy: { anonymisedImprovement: true, shareWithTeachers: false },
    };
  }
  return {
    notifications: JSON.parse(settings[0].notifications || '{}'),
    appearance: JSON.parse(settings[0].appearance || '{}'),
    privacy: JSON.parse(settings[0].privacy || '{}'),
  };
};

export const updateUserSettings = async (userId, { notifications, appearance, privacy }) => {
  const existing = await query('SELECT id FROM user_settings WHERE user_id = ?', [userId]);
  const notifJson = notifications ? JSON.stringify(notifications) : null;
  const appJson = appearance ? JSON.stringify(appearance) : null;
  const privJson = privacy ? JSON.stringify(privacy) : null;

  if (existing.length > 0) {
    await query(
      `UPDATE user_settings
       SET notifications = COALESCE(?, notifications),
           appearance = COALESCE(?, appearance),
           privacy = COALESCE(?, privacy)
       WHERE user_id = ?`,
      [notifJson, appJson, privJson, userId]
    );
  } else {
    await query(
      'INSERT INTO user_settings (user_id, notifications, appearance, privacy) VALUES (?, ?, ?, ?)',
      [userId, notifJson, appJson, privJson]
    );
  }
  return getUserSettings(userId);
};
