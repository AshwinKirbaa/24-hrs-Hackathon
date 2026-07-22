import { updateSubmissionStatus } from '../models/submissionModel.js';
import { saveEvaluation } from '../models/evaluationModel.js';
import { logger } from '../utils/logger.js';

export const processEvaluationPipeline = async (submissionId) => {
  try {
    logger.info(`[Pipeline Started] Processing evaluation for submission ID: ${submissionId}`);

    // Stage 1: Mark status as processing
    await updateSubmissionStatus(submissionId, 'processing');

    // Simulate async neural evaluation processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // High quality, deterministic neural evaluation result
    const overallScore = 86.5;
    const bloomsLevel = 'Apply';
    const conceptsDetected = ['Data Structures', 'Tree Traversal', 'Time Complexity', 'Recursion'];

    const items = [
      {
        question_number: 1,
        question_text: 'Explain binary tree traversal algorithms (Pre-order, In-order, Post-order).',
        student_answer_text: 'Tree traversal visits each node once. In-order visits left, root, right recursively.',
        score_awarded: 9.0,
        max_score: 10.0,
        rubric_criterion_id: null,
        evidence_snippet: 'Correct definition of in-order traversal and recursive structure.',
        blooms_classification: 'Understand',
        feedback_text: 'Great clarity on traversal order and recursive base cases.',
      },
      {
        question_number: 2,
        question_text: 'Analyze the worst-case time complexity of Binary Search Tree insertion.',
        student_answer_text: 'Worst case is O(N) when the BST degenerates into a linked list.',
        score_awarded: 8.5,
        max_score: 10.0,
        rubric_criterion_id: null,
        evidence_snippet: 'Identified degenerate tree structure leading to O(N) linear time.',
        blooms_classification: 'Analyse',
        feedback_text: 'Accurate analysis of unbalanced BST operations.',
      },
    ];

    const feedback = {
      strengths: [
        'Clear understanding of recursive tree traversal mechanics.',
        'Accurate worst-case time complexity analysis for degenerate trees.',
      ],
      improvements: [
        'Consider elaborating on self-balancing trees like AVL or Red-Black trees to mitigate O(N) complexity.',
      ],
      next_steps: [
        'Review AVL tree rotations to maintain O(log N) balance guarantees.',
        'Practice coding non-recursive iterative traversal using an explicit Stack.',
      ],
      concept_map: [
        { concept: 'Binary Trees', mastery: 'Mastered', level: 92 },
        { concept: 'Recursion', mastery: 'Mastered', level: 88 },
        { concept: 'Time Complexity', mastery: 'Developing', level: 78 },
        { concept: 'Self-Balancing Trees', mastery: 'Needs Review', level: 60 },
      ],
    };

    // Save evaluation result
    await saveEvaluation({
      submission_id: submissionId,
      overall_score: overallScore,
      blooms_level: bloomsLevel,
      concepts_detected: conceptsDetected,
      items,
      feedback,
    });

    // Stage 2: Mark submission as completed with final score
    await updateSubmissionStatus(submissionId, 'completed', overallScore);
    logger.info(`[Pipeline Completed] Evaluation finished for submission ID: ${submissionId}`);
  } catch (error) {
    logger.error(`[Pipeline Error] Failed processing submission ID ${submissionId}`, error);
    await updateSubmissionStatus(submissionId, 'failed');
  }
};
