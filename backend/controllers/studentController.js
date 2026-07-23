import { createSubmission, getSubmissionById, getSubmissionsByStudent } from '../models/submissionModel.js';
import { getEvaluationBySubmissionId, getFeedbackByEvaluationId } from '../models/evaluationModel.js';
import { getStudentAnalyticsData } from '../models/analyticsModel.js';
import { processEvaluationPipeline } from '../services/evaluationPipeline.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { logger } from '../utils/logger.js';

export const getStudentDashboard = asyncHandler(async (req, res) => {
  const studentId = req.user.id;
  const submissions = await getSubmissionsByStudent(studentId);
  const analytics = await getStudentAnalyticsData(studentId);

  res.status(200).json({
    success: true,
    message: 'Student dashboard data retrieved.',
    data: {
      stats: analytics.summary,
      recentEvaluations: submissions,
    },
  });
});

export const submitAnswerSheet = asyncHandler(async (req, res) => {
  const studentId = req.user.id;
  const { subject, exam_title, assignment_id, notes, run_blooms } = req.body;

  const uploadedFile = req.file || (req.files && req.files.length > 0 ? req.files[0] : null);
  const fileUrl = uploadedFile ? `/uploads/${uploadedFile.filename}` : null;

  const submissionId = await createSubmission({
    student_id: studentId,
    assignment_id: assignment_id ? parseInt(assignment_id, 10) : null,
    subject: subject || 'Data Structures',
    exam_title: exam_title || 'Mid-term 2',
    file_url: fileUrl,
    notes: notes || '',
    run_blooms: run_blooms === 'false' || run_blooms === false ? false : true,
  });

  // Trigger evaluation pipeline in background
  processEvaluationPipeline(submissionId).catch((err) =>
    logger.error(`[Background Pipeline Exception for ID ${submissionId}]`, err)
  );

  res.status(202).json({
    success: true,
    message: 'Answer sheet submitted and queued for evaluation.',
    data: {
      submissionId,
      status: 'queued',
      redirectUrl: `processing.html?id=${submissionId}`,
    },
  });
});

export const getSubmissionStatus = asyncHandler(async (req, res) => {
  const submissionId = req.params.id;
  const submission = await getSubmissionById(submissionId);

  if (!submission) {
    return res.status(404).json({ success: false, message: 'Submission not found.' });
  }

  res.status(200).json({
    success: true,
    message: 'Submission status retrieved.',
    data: {
      id: submission.id,
      status: submission.status,
      progress: submission.status === 'completed' ? 100 : 50,
    },
  });
});

export const getEvaluationResult = asyncHandler(async (req, res) => {
  const submissionId = req.params.submissionId;
  const evaluation = await getEvaluationBySubmissionId(submissionId);
  const submission = await getSubmissionById(submissionId);

  res.status(200).json({
    success: true,
    message: 'Evaluation result retrieved.',
    data: {
      submission,
      evaluation: evaluation || {
        overall_score: null,
        blooms_level: null,
        concepts_detected: [],
        items: [],
      },
    },
  });
});

export const getAIFeedback = asyncHandler(async (req, res) => {
  const evaluationId = req.params.evaluationId;
  const feedback = await getFeedbackByEvaluationId(evaluationId);

  res.status(200).json({
    success: true,
    message: 'AI Feedback retrieved.',
    data: { feedback },
  });
});

export const getStudentAnalytics = asyncHandler(async (req, res) => {
  const studentId = req.user.id;
  const analytics = await getStudentAnalyticsData(studentId);

  res.status(200).json({
    success: true,
    message: 'Student analytics retrieved.',
    data: analytics,
  });
});
