import express from 'express';
import { Assessment, AssessmentResult } from '../models/Assessment.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get available assessments
// @route   GET /api/assessments
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { category } = req.query;
    
    const filter = { isActive: true };
    if (category) {
      filter.category = category;
    }

    const assessments = await Assessment.find(filter)
      .select('-questions.correctAnswer -questions.explanation')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      data: {
        assessments,
        count: assessments.length
      }
    });
  } catch (error) {
    console.error('Get assessments error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching assessments'
    });
  }
});

// @desc    Get specific assessment
// @route   GET /api/assessments/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id)
      .select('-questions.correctAnswer -questions.explanation');

    if (!assessment) {
      return res.status(404).json({
        status: 'error',
        message: 'Assessment not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        assessment
      }
    });
  } catch (error) {
    console.error('Get assessment error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching assessment'
    });
  }
});

// @desc    Submit assessment
// @route   POST /api/assessments/:id/submit
// @access  Private
router.post('/:id/submit', protect, async (req, res) => {
  try {
    const { answers, timeSpent } = req.body;

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        status: 'error',
        message: 'Answers must be an array'
      });
    }

    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) {
      return res.status(404).json({
        status: 'error',
        message: 'Assessment not found'
      });
    }

    // Calculate score
    let correctAnswers = 0;
    const processedAnswers = answers.map((answer, index) => {
      const question = assessment.questions[index];
      const isCorrect = question && answer.selectedAnswer === question.correctAnswer;
      if (isCorrect) correctAnswers++;

      return {
        questionId: question._id,
        selectedAnswer: answer.selectedAnswer,
        isCorrect,
        timeSpent: answer.timeSpent || 0
      };
    });

    const score = Math.round((correctAnswers / assessment.questions.length) * 100);
    const passed = score >= assessment.passingScore;

    // Determine skill level based on score
    let skillLevel = 'absolute-beginner';
    if (score >= 80) skillLevel = 'advanced';
    else if (score >= 60) skillLevel = 'intermediate';
    else if (score >= 40) skillLevel = 'some-experience';

    // Save result
    const result = await AssessmentResult.create({
      user: req.user.id,
      assessment: assessment._id,
      answers: processedAnswers,
      score,
      passed,
      timeSpent: timeSpent || 0,
      skillLevel
    });

    res.status(201).json({
      status: 'success',
      message: 'Assessment submitted successfully',
      data: {
        result: {
          score,
          passed,
          skillLevel,
          correctAnswers,
          totalQuestions: assessment.questions.length
        }
      }
    });
  } catch (error) {
    console.error('Submit assessment error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error submitting assessment'
    });
  }
});

// @desc    Get user's assessment results
// @route   GET /api/assessments/results
// @access  Private
router.get('/results', protect, async (req, res) => {
  try {
    const results = await AssessmentResult.find({ user: req.user.id })
      .populate('assessment', 'title category')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      data: {
        results,
        count: results.length
      }
    });
  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching results'
    });
  }
});

export default router;