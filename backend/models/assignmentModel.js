import { query } from '../config/db.js';

export const createAssignment = async ({ teacher_id, title, subject, course_code, due_date, model_answer_text, model_answer_file_url, bloom_targets }) => {
  const result = await query(
    `INSERT INTO assignments (teacher_id, title, subject, course_code, due_date, model_answer_text, model_answer_file_url, bloom_targets)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      teacher_id,
      title,
      subject,
      course_code,
      due_date || null,
      model_answer_text || null,
      model_answer_file_url || null,
      bloom_targets ? JSON.stringify(bloom_targets) : JSON.stringify([]),
    ]
  );
  return result.insertId;
};

export const addRubricCriteria = async (assignmentId, criteria = []) => {
  for (const item of criteria) {
    if (item.criterion) {
      await query(
        'INSERT INTO rubric_criteria (assignment_id, criterion, description, weight) VALUES (?, ?, ?, ?)',
        [assignmentId, item.criterion, item.description || '', parseInt(item.weight || 0, 10)]
      );
    }
  }
};

export const getAssignmentsByTeacher = async (teacherId) => {
  const assignments = await query('SELECT * FROM assignments WHERE teacher_id = ? ORDER BY created_at DESC', [teacherId]);
  for (let a of assignments) {
    a.rubric = await query('SELECT * FROM rubric_criteria WHERE assignment_id = ?', [a.id]);
    a.bloom_targets = JSON.parse(a.bloom_targets || '[]');
  }
  return assignments;
};

export const getAssignmentById = async (assignmentId) => {
  const assignments = await query('SELECT * FROM assignments WHERE id = ?', [assignmentId]);
  if (assignments.length === 0) return null;
  const assignment = assignments[0];
  assignment.rubric = await query('SELECT * FROM rubric_criteria WHERE assignment_id = ?', [assignment.id]);
  assignment.bloom_targets = JSON.parse(assignment.bloom_targets || '[]');
  return assignment;
};
