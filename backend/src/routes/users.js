import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get user profile by ID
// @route   GET /api/users/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-email -preferences');
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching user'
    });
  }
});

// @desc    Update user skills
// @route   PUT /api/users/skills
// @access  Private
router.put('/skills', protect, async (req, res) => {
  try {
    const { skills } = req.body;

    if (!Array.isArray(skills)) {
      return res.status(400).json({
        status: 'error',
        message: 'Skills must be an array'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { skills },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      message: 'Skills updated successfully',
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Update skills error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating skills'
    });
  }
});

// @desc    Get user's learning statistics
// @route   GET /api/users/stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    // This would typically aggregate data from Progress model
    // For now, returning mock data
    const stats = {
      totalSkills: 15,
      completedSkills: 8,
      inProgressSkills: 3,
      totalProjects: 6,
      completedProjects: 2,
      streakDays: 5,
      totalHours: 45
    };

    res.status(200).json({
      status: 'success',
      data: {
        stats
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching statistics'
    });
  }
});

export default router;