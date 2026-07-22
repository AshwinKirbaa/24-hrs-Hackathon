-- TwinEval AI Database Schema
-- Relational, normalized schema supporting Student & Faculty workflows

CREATE DATABASE IF NOT EXISTS twineval_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE twineval_db;

-- 1. Users Table (Core Auth & Roles)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('student', 'teacher') NOT NULL DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Student Profiles Table
CREATE TABLE IF NOT EXISTS student_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  college VARCHAR(200) DEFAULT NULL,
  department VARCHAR(150) DEFAULT NULL,
  year VARCHAR(50) DEFAULT NULL,
  roll_number VARCHAR(100) DEFAULT NULL,
  avatar_url VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Assignments Table (Teacher Created)
CREATE TABLE IF NOT EXISTS assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  teacher_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  subject VARCHAR(150) NOT NULL,
  course_code VARCHAR(50) NOT NULL,
  due_date DATE DEFAULT NULL,
  model_answer_text TEXT DEFAULT NULL,
  model_answer_file_url VARCHAR(255) DEFAULT NULL,
  bloom_targets JSON DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_teacher (teacher_id),
  INDEX idx_course (course_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Rubric Criteria Table
CREATE TABLE IF NOT EXISTS rubric_criteria (
  id INT AUTO_INCREMENT PRIMARY KEY,
  assignment_id INT NOT NULL,
  criterion VARCHAR(150) NOT NULL,
  description TEXT DEFAULT NULL,
  weight INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
  INDEX idx_assignment (assignment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Submissions Table (Student Answers)
CREATE TABLE IF NOT EXISTS submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  assignment_id INT DEFAULT NULL,
  subject VARCHAR(150) NOT NULL,
  exam_title VARCHAR(150) NOT NULL,
  file_url VARCHAR(255) DEFAULT NULL,
  notes TEXT DEFAULT NULL,
  run_blooms BOOLEAN DEFAULT TRUE,
  status ENUM('queued', 'processing', 'completed', 'failed', 'under_review', 'approved') DEFAULT 'queued',
  total_score DECIMAL(5,2) DEFAULT NULL,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE SET NULL,
  INDEX idx_student (student_id),
  INDEX idx_assignment_sub (assignment_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Evaluations Table
CREATE TABLE IF NOT EXISTS evaluations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  submission_id INT NOT NULL UNIQUE,
  overall_score DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  blooms_level VARCHAR(50) DEFAULT 'Remember',
  concepts_detected JSON DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Evaluation Items Breakdown
CREATE TABLE IF NOT EXISTS evaluation_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  evaluation_id INT NOT NULL,
  question_number INT NOT NULL,
  question_text TEXT DEFAULT NULL,
  student_answer_text TEXT DEFAULT NULL,
  score_awarded DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  max_score DECIMAL(5,2) NOT NULL DEFAULT 10.00,
  rubric_criterion_id INT DEFAULT NULL,
  evidence_snippet TEXT DEFAULT NULL,
  blooms_classification VARCHAR(50) DEFAULT NULL,
  feedback_text TEXT DEFAULT NULL,
  FOREIGN KEY (evaluation_id) REFERENCES evaluations(id) ON DELETE CASCADE,
  FOREIGN KEY (rubric_criterion_id) REFERENCES rubric_criteria(id) ON DELETE SET NULL,
  INDEX idx_evaluation (evaluation_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Feedback Reports Table
CREATE TABLE IF NOT EXISTS feedback_reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  evaluation_id INT NOT NULL UNIQUE,
  strengths JSON DEFAULT NULL,
  improvements JSON DEFAULT NULL,
  next_steps JSON DEFAULT NULL,
  concept_map JSON DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (evaluation_id) REFERENCES evaluations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Moderation Audits Table (Teacher Overrides)
CREATE TABLE IF NOT EXISTS moderation_audits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  submission_id INT NOT NULL,
  teacher_id INT NOT NULL,
  original_score DECIMAL(5,2) NOT NULL,
  overridden_score DECIMAL(5,2) NOT NULL,
  action ENUM('approved', 'adjusted', 'returned') NOT NULL DEFAULT 'approved',
  reason TEXT DEFAULT NULL,
  moderated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE,
  FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_submission_mod (submission_id),
  INDEX idx_teacher_mod (teacher_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. User Settings Table
CREATE TABLE IF NOT EXISTS user_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  notifications JSON DEFAULT NULL,
  appearance JSON DEFAULT NULL,
  privacy JSON DEFAULT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Sample Student Account
-- Email: student@college.edu | Password: Student@123
INSERT INTO users (full_name, email, password_hash, role)
SELECT 'Sample Student', 'student@college.edu', '$2a$10$zrz/sgmdqKSO.HbCJyOpjeB3yjlCIinHP82DsTAgx.wvn8t2JiRB2', 'student'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'student@college.edu');

INSERT INTO student_profiles (user_id, college, department, year, roll_number)
SELECT id, 'Tech Institute of Engineering', 'Computer Science', '3rd Year', '21CS042'
FROM users WHERE email = 'student@college.edu'
ON DUPLICATE KEY UPDATE college = VALUES(college);

-- Seed Sample Faculty Account
-- Email: faculty@college.edu | Password: Faculty@123
INSERT INTO users (full_name, email, password_hash, role)
SELECT 'Dr. Faculty Admin', 'faculty@college.edu', '$2a$10$uWfUqglhfo0CfOZMdbqdCuWj710yDXU43r47t8QPWtZzdDpu4BmgW', 'teacher'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'faculty@college.edu');
