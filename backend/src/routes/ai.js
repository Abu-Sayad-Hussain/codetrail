import express from 'express';
import { protect } from '../middleware/auth.js';
import { getChatResponse, generateProjectSuggestions } from '../services/aiService.js';

const router = express.Router();

// @desc    Chat with AI assistant
// @route   POST /api/ai/chat
// @access  Private
router.post('/chat', protect, async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({
        status: 'error',
        message: 'Message is required'
      });
    }

    const response = await getChatResponse(message, context, req.user);

    res.status(200).json({
      status: 'success',
      data: {
        response
      }
    });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error processing chat request'
    });
  }
});

// @desc    Get project suggestions
// @route   POST /api/ai/projects
// @access  Private
router.post('/projects', protect, async (req, res) => {
  try {
    const { skillLevel, techStack, interests } = req.body;

    const suggestions = await generateProjectSuggestions({
      skillLevel,
      techStack,
      interests,
      user: req.user
    });

    res.status(200).json({
      status: 'success',
      data: {
        suggestions
      }
    });
  } catch (error) {
    console.error('Project suggestions error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error generating project suggestions'
    });
  }
});

export default router;