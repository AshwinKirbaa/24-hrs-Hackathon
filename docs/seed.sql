-- ========================================================
-- TwinEval AI - Database Seed Script
-- Populates 20+ sample students, users, evaluations, learning plans, and analytics
-- Default User Passwords: 'password123' (bcrypt hashed)
-- ========================================================

USE `twineval_ai`;

-- 1. Insert Initial Users
INSERT INTO `Users` (`name`, `email`, `password`, `role`) VALUES
('Prof. Sarah Jenkins', 'sarah.jenkins@twineval.edu', '$2a$10$6hdColddzYh9g46cF871fOShJyY7awWn6U98gMmNk8TWmkLKhL8bC', 'teacher'),
('Dr. Alan Turing', 'alan.turing@twineval.edu', '$2a$10$6hdColddzYh9g46cF871fOShJyY7awWn6U98gMmNk8TWmkLKhL8bC', 'admin'),
('Prof. Michael Scott', 'michael.scott@twineval.edu', '$2a$10$6hdColddzYh9g46cF871fOShJyY7awWn6U98gMmNk8TWmkLKhL8bC', 'teacher');

-- 2. Insert 20 Sample Students
INSERT INTO `Student` (`student_id`, `name`, `email`, `department`, `semester`) VALUES
(1, 'Aarav Sharma', 'aarav.sharma@student.edu', 'Computer Science', 6),
(2, 'Priya Patel', 'priya.patel@student.edu', 'Computer Science', 6),
(3, 'Rohan Mehta', 'rohan.mehta@student.edu', 'Information Technology', 4),
(4, 'Ananya Gupta', 'ananya.gupta@student.edu', 'Information Technology', 4),
(5, 'Vikram Singh', 'vikram.singh@student.edu', 'Electronics', 6),
(6, 'Sneha Reddy', 'sneha.reddy@student.edu', 'Electronics', 8),
(7, 'Karan Verma', 'karan.verma@student.edu', 'Mechanical Engineering', 2),
(8, 'Neha Joshi', 'neha.joshi@student.edu', 'Mechanical Engineering', 2),
(9, 'Devansh Rao', 'devansh.rao@student.edu', 'Computer Science', 4),
(10, 'Ishita Nair', 'ishita.nair@student.edu', 'Computer Science', 8),
(11, 'Kabir Malhotra', 'kabir.malhotra@student.edu', 'Information Technology', 6),
(12, 'Diya Kapoor', 'diya.kapoor@student.edu', 'Information Technology', 6),
(13, 'Aditya Roy', 'aditya.roy@student.edu', 'Electronics', 4),
(14, 'Tanvi Saxena', 'tanvi.saxena@student.edu', 'Electronics', 4),
(15, 'Siddharth Bose', 'siddharth.bose@student.edu', 'Civil Engineering', 6),
(16, 'Riya Deshmukh', 'riya.deshmukh@student.edu', 'Civil Engineering', 6),
(17, 'Yash Agarwal', 'yash.agarwal@student.edu', 'Computer Science', 2),
(18, 'Kavya Kulkarni', 'kavya.kulkarni@student.edu', 'Computer Science', 2),
(19, 'Arjun Nambiar', 'arjun.nambiar@student.edu', 'Electrical Engineering', 4),
(20, 'Meera Iyer', 'meera.iyer@student.edu', 'Electrical Engineering', 8);

-- 3. Insert Evaluation Results
INSERT INTO `EvaluationResult` (`student_id`, `subject`, `marks`, `attendance`, `communication`, `problem_solving`, `ai_score`, `remarks`) VALUES
(1, 'Data Structures & Algorithms', 92.50, 95.00, 88.00, 94.00, 92.70, 'Outstanding problem-solving capability and algorithmic optimization.'),
(2, 'Database Management Systems', 88.00, 90.00, 92.00, 86.00, 88.80, 'Great communication and conceptual understanding of SQL.'),
(3, 'Web Development', 78.00, 85.00, 80.00, 75.00, 79.20, 'Good practical skills, needs improvement in backend query optimization.'),
(4, 'Operating Systems', 95.00, 98.00, 90.00, 96.00, 95.00, 'Top performer with deep grasp of memory management.'),
(5, 'Microprocessors', 65.00, 72.00, 70.00, 68.00, 68.40, 'Requires focused guidance in assembly language programming.'),
(6, 'VLSI Design', 89.00, 91.00, 87.00, 90.00, 89.20, 'Very strong logical design skills.'),
(7, 'Thermodynamics', 58.00, 65.00, 60.00, 55.00, 59.20, 'Weak in numerical problem solving, attendance needs boost.'),
(8, 'Fluid Mechanics', 84.00, 88.00, 82.00, 85.00, 84.80, 'Consistent performance and active classroom participation.'),
(9, 'Object Oriented Programming', 91.00, 94.00, 89.00, 93.00, 91.80, 'Excellent OOP architecture and clean coding practices.'),
(10, 'Cloud Computing', 96.00, 100.00, 95.00, 98.00, 96.80, 'Exemplary project deployment and microservices understanding.'),
(11, 'Cyber Security', 82.00, 86.00, 84.00, 80.00, 82.80, 'Solid understanding of network protocols and vulnerability scanning.'),
(12, 'Machine Learning', 87.00, 92.00, 85.00, 89.00, 88.10, 'Good model evaluation techniques and data preprocessing skills.'),
(13, 'Digital Signal Processing', 74.00, 80.00, 75.00, 72.00, 75.00, 'Understands fundamentals well, needs practice with Fourier transforms.'),
(14, 'Embedded Systems', 88.00, 90.00, 86.00, 89.00, 88.30, 'Great hands-on hardware interfacing.'),
(15, 'Structural Analysis', 70.00, 75.00, 68.00, 72.00, 71.30, 'Needs to work on load distribution calculations.'),
(16, 'Geotechnical Engineering', 85.00, 89.00, 86.00, 84.00, 85.80, 'Strong theoretical understanding and lab reporting.'),
(17, 'Discrete Mathematics', 93.00, 96.00, 91.00, 95.00, 93.80, 'Exceptional proof logic and mathematical reasoning.'),
(18, 'Computer Networks', 89.00, 93.00, 88.00, 90.00, 90.00, 'Detailed understanding of TCP/IP stack.'),
(19, 'Power Systems', 62.00, 70.00, 65.00, 60.00, 64.10, 'Struggling with grid distribution equations.'),
(20, 'Control Systems', 90.00, 95.00, 92.00, 91.00, 91.80, 'High proficiency in system stability analysis.');

-- 4. Insert Learning Plans
INSERT INTO `LearningPlan` (`student_id`, `weak_topics`, `recommended_resources`, `practice_tasks`, `study_schedule`) VALUES
(3, '["SQL Query Optimization", "Database Indexing", "Express Middleware"]', '["W3Schools SQL Tuning", "MDN Web Docs", "FreeCodeCamp Node.js Course"]', '["Optimize 5 complex JOIN queries", "Build a JWT authentication middleware"]', '{"week1": "Database Indexing & Normalization", "week2": "Express Router & Async Error Handling"}'),
(5, '["Assembly Language", "8086 Instruction Set", "Interrupt Handling"]', '["GeeksforGeeks Microprocessors", "YouTube NPTEL Microprocessors"]', '["Write assembly code for array reversal", "Simulate 8086 interrupt subroutine"]', '{"week1": "8086 Architecture", "week2": "Memory Interfacing & I/O"}'),
(7, '["Second Law of Thermodynamics", "Entropy Calculations", "Carnot Cycle"]', '["Khan Academy Physics", "MIT OpenCourseWare Thermodynamics"]', '["Solve 10 numerical problems on Entropy", "Draw PV and TS diagrams for ideal cycles"]', '{"week1": "Laws of Thermodynamics Review", "week2": "Numerical Problem Solving"}'),
(15, '["Truss Analysis", "Moment Distribution Method", "Shear Force Diagrams"]', '["Coursera Engineering Mechanics", "NPTEL Civil Engineering"]', '["Solve 5 indeterminate frame problems", "Calculate bending moments for continuous beams"]', '{"week1": "Truss & Deflection Review", "week2": "Matrix Methods"}'),
(19, '["Transformer Impedance", "Transmission Line Modeling", "Fault Analysis"]', '["Electrical4U Power Systems", "YouTube NPTEL Power Engineering"]', '["Simulate 3-phase fault analysis", "Calculate line voltage drop over 100km"]', '{"week1": "Transmission Line Parameters", "week2": "Symmetrical Components"}');

-- 5. Insert Teacher Analytics
INSERT INTO `TeacherAnalytics` (`department`, `average_score`, `top_students`, `weak_students`) VALUES
('Computer Science', 92.32, '[{"student_id": 10, "name": "Ishita Nair", "score": 96.80}, {"student_id": 17, "name": "Yash Agarwal", "score": 93.80}]', '[{"student_id": 1, "name": "Aarav Sharma", "score": 92.70}]'),
('Information Technology', 86.23, '[{"student_id": 4, "name": "Ananya Gupta", "score": 95.00}, {"student_id": 12, "name": "Diya Kapoor", "score": 88.10}]', '[{"student_id": 3, "name": "Rohan Mehta", "score": 79.20}]'),
('Electronics', 80.23, '[{"student_id": 6, "name": "Sneha Reddy", "score": 89.20}, {"student_id": 14, "name": "Tanvi Saxena", "score": 88.30}]', '[{"student_id": 5, "name": "Vikram Singh", "score": 68.40}]'),
('Mechanical Engineering', 72.00, '[{"student_id": 8, "name": "Neha Joshi", "score": 84.80}]', '[{"student_id": 7, "name": "Karan Verma", "score": 59.20}]'),
('Electrical Engineering', 77.95, '[{"student_id": 20, "name": "Meera Iyer", "score": 91.80}]', '[{"student_id": 19, "name": "Arjun Nambiar", "score": 64.10}]');
