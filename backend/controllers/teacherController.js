import { createAssignment, addRubricCriteria, getAssignmentsByTeacher } from '../models/assignmentModel.js';
import { getSubmissionsReviewQueue, createModerationAudit } from '../models/submissionModel.js';
import { getTeacherAnalyticsData } from '../models/analyticsModel.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getTeacherDashboard = asyncHandler(async (req, res) => {
  const teacherId = req.user.id;
  const assignments = await getAssignmentsByTeacher(teacherId);
  const queue = await getSubmissionsReviewQueue({});
  const analytics = await getTeacherAnalyticsData(teacherId);

  const pendingCount = queue.filter((q) => q.status === 'completed' || q.status === 'under_review' || q.status === 'queued').length;

  res.status(200).json({
    success: true,
    message: 'Faculty dashboard retrieved.',
    data: {
      stats: {
        activeAssignments: assignments.length,
        submissionsPending: pendingCount,
        classAverage: analytics.summary.classAverage,
        agreementRate: '94%',
      },
      assignments,
      reviewQueuePreview: queue.slice(0, 5),
    },
  });
});

export const createNewAssignment = asyncHandler(async (req, res) => {
  const teacherId = req.user.id;
  const { title, subject, course_code, due_date, model_answer_text, bloom_targets, criteria } = req.body;

  const modelAnswerFileUrl = req.file ? `/uploads/${req.file.filename}` : null;

  let parsedCriteria = criteria;
  if (typeof criteria === 'string') {
    try { parsedCriteria = JSON.parse(criteria); } catch (e) { parsedCriteria = []; }
  }

  let parsedBloom = bloom_targets;
  if (typeof bloom_targets === 'string') {
    try { parsedBloom = JSON.parse(bloom_targets); } catch (e) { parsedBloom = []; }
  }

  const assignmentId = await createAssignment({
    teacher_id: teacherId,
    title,
    subject,
    course_code,
    due_date,
    model_answer_text,
    model_answer_file_url: modelAnswerFileUrl,
    bloom_targets: parsedBloom,
  });

  if (parsedCriteria && Array.isArray(parsedCriteria)) {
    await addRubricCriteria(assignmentId, parsedCriteria);
  }

  res.status(201).json({
    success: true,
    message: 'Assignment and rubric published successfully.',
    data: { assignmentId, redirectUrl: 'teacher-review.html' },
  });
});

export const getTeacherAssignments = asyncHandler(async (req, res) => {
  const teacherId = req.user.id;
  const assignments = await getAssignmentsByTeacher(teacherId);

  res.status(200).json({
    success: true,
    message: 'Assignments retrieved.',
    data: { assignments },
  });
});

export const getReviewQueue = asyncHandler(async (req, res) => {
  const { search, assignment_id, status } = req.query;
  const queue = await getSubmissionsReviewQueue({ search, assignment_id, status });

  res.status(200).json({
    success: true,
    message: 'Review queue retrieved.',
    data: { queue },
  });
});

export const moderateSubmission = asyncHandler(async (req, res) => {
  const teacherId = req.user.id;
  const submissionId = req.params.submissionId;
  const { original_score, overridden_score, action, reason } = req.body;

  await createModerationAudit({
    submission_id: parseInt(submissionId, 10),
    teacher_id: teacherId,
    original_score: parseFloat(original_score || 0),
    overridden_score: parseFloat(overridden_score || 0),
    action: action || 'approved',
    reason: reason || '',
  });

  res.status(200).json({
    success: true,
    message: 'Submission score moderated successfully.',
    data: { submissionId, status: action === 'approved' ? 'approved' : 'completed' },
  });
});

export const getTeacherAnalytics = asyncHandler(async (req, res) => {
  const teacherId = req.user.id;
  const analytics = await getTeacherAnalyticsData(teacherId);

  res.status(200).json({
    success: true,
    message: 'Class analytics retrieved.',
    data: analytics,
  });
});
