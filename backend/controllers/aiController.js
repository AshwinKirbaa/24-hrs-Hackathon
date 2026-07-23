import { evaluateStudentPerformance, generatePersonalizedLearningPlan } from '../services/aiService.js';
import { findUserById } from '../models/userModel.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const evaluateStudent = asyncHandler(async (req, res) => {
  const { marks, attendance, communication, problem_solving } = req.body;

  const analysis = evaluateStudentPerformance(marks, attendance, communication, problem_solving);

  res.status(200).json({
    success: true,
    message: 'AI student performance evaluation generated successfully.',
    data: analysis,
  });
});

export const generateLearningPlan = asyncHandler(async (req, res) => {
  const { student_id, subject, weak_topics } = req.body;

  let targetSubject = subject || 'General Engineering';
  let targetWeakTopics = weak_topics || [];

  if (student_id) {
    const student = await findUserById(student_id);
    if (student && student.department) {
      targetSubject = student.department;
    }
  }

  const plan = generatePersonalizedLearningPlan({
    subject: targetSubject,
    weak_topics: targetWeakTopics,
  });

  res.status(200).json({
    success: true,
    message: 'Personalized AI learning plan generated successfully.',
    data: plan,
  });
});
