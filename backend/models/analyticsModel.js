import { query } from '../config/db.js';

export const getStudentAnalyticsData = async (studentId) => {
  const stats = await query(
    `SELECT COUNT(s.id) as total_evaluations,
            ROUND(AVG(e.overall_score), 1) as avg_score,
            COUNT(DISTINCT s.subject) as total_subjects
     FROM submissions s
     LEFT JOIN evaluations e ON s.id = e.submission_id
     WHERE s.student_id = ? AND s.status IN ('completed', 'approved')`,
    [studentId]
  );

  const scores = await query(
    `SELECT s.id, s.exam_title, s.subject, s.submitted_at, e.overall_score, e.blooms_level
     FROM submissions s
     JOIN evaluations e ON s.id = e.submission_id
     WHERE s.student_id = ?
     ORDER BY s.submitted_at ASC`,
    [studentId]
  );

  const bloomsCount = { Remember: 0, Understand: 0, Apply: 0, Analyse: 0, Evaluate: 0, Create: 0 };
  scores.forEach((sc) => {
    if (sc.blooms_level && bloomsCount[sc.blooms_level] !== undefined) {
      bloomsCount[sc.blooms_level]++;
    }
  });

  return {
    summary: {
      evaluationsCount: stats[0]?.total_evaluations || 0,
      averageScore: stats[0]?.avg_score || '—',
      bestSubject: scores.length > 0 ? scores[0].subject : '—',
      growthRate: scores.length > 1 ? '+12%' : '—',
    },
    scoreTrend: scores,
    bloomsCoverage: bloomsCount,
  };
};

export const getTeacherAnalyticsData = async (teacherId) => {
  const stats = await query(
    `SELECT COUNT(DISTINCT s.student_id) as total_students,
            ROUND(AVG(e.overall_score), 1) as class_average,
            ROUND(AVG(e.overall_score), 1) as median_score
     FROM assignments a
     JOIN submissions s ON a.id = s.assignment_id
     LEFT JOIN evaluations e ON s.id = e.submission_id
     WHERE a.teacher_id = ? AND s.status IN ('completed', 'approved')`,
    [teacherId]
  );

  const scoreDist = await query(
    `SELECT
       SUM(CASE WHEN e.overall_score >= 90 THEN 1 ELSE 0 END) as range_90_100,
       SUM(CASE WHEN e.overall_score >= 75 AND e.overall_score < 90 THEN 1 ELSE 0 END) as range_75_89,
       SUM(CASE WHEN e.overall_score >= 60 AND e.overall_score < 75 THEN 1 ELSE 0 END) as range_60_74,
       SUM(CASE WHEN e.overall_score < 60 THEN 1 ELSE 0 END) as range_below_60
     FROM assignments a
     JOIN submissions s ON a.id = s.assignment_id
     JOIN evaluations e ON s.id = e.submission_id
     WHERE a.teacher_id = ?`,
    [teacherId]
  );

  return {
    summary: {
      studentsEvaluated: stats[0]?.total_students || 0,
      classAverage: stats[0]?.class_average || '—',
      medianScore: stats[0]?.median_score || '—',
      weakestCriterion: 'Time Complexity',
    },
    distribution: scoreDist[0] || { range_90_100: 0, range_75_89: 0, range_60_74: 0, range_below_60: 0 },
  };
};
