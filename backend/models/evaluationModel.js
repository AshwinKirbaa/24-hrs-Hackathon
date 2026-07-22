import { query } from '../config/db.js';

export const saveEvaluation = async ({ submission_id, overall_score, blooms_level, concepts_detected, items, feedback }) => {
  // 1. Insert core evaluation record
  const result = await query(
    `INSERT INTO evaluations (submission_id, overall_score, blooms_level, concepts_detected)
     VALUES (?, ?, ?, ?)`,
    [submission_id, overall_score, blooms_level || 'Understand', JSON.stringify(concepts_detected || [])]
  );
  const evaluationId = result.insertId;

  // 2. Insert evaluation items breakdown
  if (items && Array.isArray(items)) {
    for (let item of items) {
      await query(
        `INSERT INTO evaluation_items (evaluation_id, question_number, question_text, student_answer_text, score_awarded, max_score, rubric_criterion_id, evidence_snippet, blooms_classification, feedback_text)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          evaluationId,
          item.question_number || 1,
          item.question_text || '',
          item.student_answer_text || '',
          item.score_awarded || 0,
          item.max_score || 10,
          item.rubric_criterion_id || null,
          item.evidence_snippet || '',
          item.blooms_classification || 'Remember',
          item.feedback_text || '',
        ]
      );
    }
  }

  // 3. Insert feedback report
  if (feedback) {
    await query(
      `INSERT INTO feedback_reports (evaluation_id, strengths, improvements, next_steps, concept_map)
       VALUES (?, ?, ?, ?, ?)`,
      [
        evaluationId,
        JSON.stringify(feedback.strengths || []),
        JSON.stringify(feedback.improvements || []),
        JSON.stringify(feedback.next_steps || []),
        JSON.stringify(feedback.concept_map || []),
      ]
    );
  }

  return evaluationId;
};

export const getEvaluationBySubmissionId = async (submissionId) => {
  const evaluations = await query('SELECT * FROM evaluations WHERE submission_id = ?', [submissionId]);
  if (evaluations.length === 0) return null;

  const evaluation = evaluations[0];
  evaluation.concepts_detected = JSON.parse(evaluation.concepts_detected || '[]');

  evaluation.items = await query('SELECT * FROM evaluation_items WHERE evaluation_id = ? ORDER BY question_number ASC', [evaluation.id]);

  const feedbackRows = await query('SELECT * FROM feedback_reports WHERE evaluation_id = ?', [evaluation.id]);
  if (feedbackRows.length > 0) {
    const f = feedbackRows[0];
    evaluation.feedback = {
      strengths: JSON.parse(f.strengths || '[]'),
      improvements: JSON.parse(f.improvements || '[]'),
      next_steps: JSON.parse(f.next_steps || '[]'),
      concept_map: JSON.parse(f.concept_map || '[]'),
    };
  } else {
    evaluation.feedback = { strengths: [], improvements: [], next_steps: [], concept_map: [] };
  }

  return evaluation;
};

export const getFeedbackByEvaluationId = async (evaluationId) => {
  const feedbackRows = await query('SELECT * FROM feedback_reports WHERE evaluation_id = ?', [evaluationId]);
  if (feedbackRows.length === 0) {
    return { strengths: [], improvements: [], next_steps: [], concept_map: [] };
  }
  const f = feedbackRows[0];
  return {
    strengths: JSON.parse(f.strengths || '[]'),
    improvements: JSON.parse(f.improvements || '[]'),
    next_steps: JSON.parse(f.next_steps || '[]'),
    concept_map: JSON.parse(f.concept_map || '[]'),
  };
};
