import { query } from '../config/db.js';

export const createSubmission = async ({ student_id, assignment_id, subject, exam_title, file_url, notes, run_blooms }) => {
  const result = await query(
    `INSERT INTO submissions (student_id, assignment_id, subject, exam_title, file_url, notes, run_blooms, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'queued')`,
    [
      student_id,
      assignment_id || null,
      subject || 'General Subject',
      exam_title || 'Answer Sheet Submission',
      file_url || null,
      notes || null,
      run_blooms !== undefined ? run_blooms : true,
    ]
  );
  return result.insertId;
};

export const updateSubmissionStatus = async (submissionId, status, totalScore = null) => {
  if (totalScore !== null) {
    await query('UPDATE submissions SET status = ?, total_score = ? WHERE id = ?', [status, totalScore, submissionId]);
  } else {
    await query('UPDATE submissions SET status = ? WHERE id = ?', [status, submissionId]);
  }
};

export const getSubmissionById = async (submissionId) => {
  const submissions = await query(
    `SELECT s.*, u.full_name as student_name, sp.roll_number
     FROM submissions s
     JOIN users u ON s.student_id = u.id
     LEFT JOIN student_profiles sp ON u.id = sp.user_id
     WHERE s.id = ?`,
    [submissionId]
  );
  return submissions[0] || null;
};

export const getSubmissionsByStudent = async (studentId) => {
  return await query(
    `SELECT s.*, e.overall_score, e.blooms_level
     FROM submissions s
     LEFT JOIN evaluations e ON s.id = e.submission_id
     WHERE s.student_id = ?
     ORDER BY s.submitted_at DESC`,
    [studentId]
  );
};

export const getSubmissionsReviewQueue = async ({ search, assignment_id, status }) => {
  let sql = `
    SELECT s.id, s.exam_title, s.subject, s.status, s.total_score, s.submitted_at,
           u.full_name as student_name, sp.roll_number,
           a.title as assignment_title, e.overall_score as ai_score
    FROM submissions s
    JOIN users u ON s.student_id = u.id
    LEFT JOIN student_profiles sp ON u.id = sp.user_id
    LEFT JOIN assignments a ON s.assignment_id = a.id
    LEFT JOIN evaluations e ON s.id = e.submission_id
    WHERE 1=1
  `;
  const params = [];

  if (search) {
    sql += ` AND (u.full_name LIKE ? OR sp.roll_number LIKE ? OR s.exam_title LIKE ?)`;
    const term = `%${search}%`;
    params.push(term, term, term);
  }

  if (assignment_id && assignment_id !== 'All assignments') {
    sql += ` AND s.assignment_id = ?`;
    params.push(assignment_id);
  }

  if (status && status !== 'All statuses') {
    sql += ` AND s.status = ?`;
    params.push(status.toLowerCase());
  }

  sql += ` ORDER BY s.submitted_at DESC`;
  return await query(sql, params);
};

export const createModerationAudit = async ({ submission_id, teacher_id, original_score, overridden_score, action, reason }) => {
  await query(
    `INSERT INTO moderation_audits (submission_id, teacher_id, original_score, overridden_score, action, reason)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [submission_id, teacher_id, original_score, overridden_score, action, reason || null]
  );

  await updateSubmissionStatus(submission_id, action === 'approved' ? 'approved' : 'completed', overridden_score);
};

export const getModerationAudits = async (teacherId) => {
  return await query(
    `SELECT ma.*, s.exam_title, u.full_name as student_name
     FROM moderation_audits ma
     JOIN submissions s ON ma.submission_id = s.id
     JOIN users u ON s.student_id = u.id
     WHERE ma.teacher_id = ?
     ORDER BY ma.moderated_at DESC`,
    [teacherId]
  );
};
