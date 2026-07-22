import { query } from '../config/db.js';
import bcrypt from 'bcryptjs';

async function seed() {
  try {
    const studentHash = await bcrypt.hash('Student@123', 10);
    const teacherHash = await bcrypt.hash('Faculty@123', 10);

    // Delete existing sample users to update hashes cleanly
    await query("DELETE FROM users WHERE email IN ('student@college.edu', 'faculty@college.edu')");

    // Insert Student Account
    const sResult = await query(
      "INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, 'student')",
      ['Sample Student', 'student@college.edu', studentHash]
    );

    // Insert Student Profile
    await query(
      "INSERT INTO student_profiles (user_id, college, department, year, roll_number) VALUES (?, ?, ?, ?, ?)",
      [sResult.insertId, 'Tech Institute of Engineering', 'Computer Science', '3rd Year', '21CS042']
    );

    // Insert Faculty Account
    await query(
      "INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, 'teacher')",
      ['Dr. Faculty Admin', 'faculty@college.edu', teacherHash]
    );

    console.log('✅ DATABASE SEEDED SUCCESSFULLY:');
    console.log('🎓 Student -> Email: student@college.edu | Password: Student@123');
    console.log('👨‍🏫 Faculty -> Email: faculty@college.edu | Password: Faculty@123');
    process.exit(0);
  } catch (err) {
    console.error('❌ SEED ERROR:', err);
    process.exit(1);
  }
}

seed();
