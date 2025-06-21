import express from 'express';
import Progress from '../models/Progress.js';
import Roadmap from '../models/Roadmap.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get user's progress
// @route   GET /api/progress
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const progress = await Progress.findOne({ user: req.user.id })
      .populate('roadmap', 'title careerGoal');

    if (!progress) {
      return res.status(404).json({
        status: 'error',
        message: 'No progress data found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        progress
      }
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching progress'
    });
  }
});

// @desc    Update daily activity
// @route   POST /api/progress/activity
// @access  Private
router.post('/activity', protect, async (req, res) => {
  try {
    const { hoursSpent, skillsCompleted, projectsWorked } = req.body;
    
    let progress = await Progress.findOne({ user: req.user.id });
    
    if (!progress) {
      return res.status(404).json({
        status: 'error',
        message: 'Progress record not found'
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find or create today's activity
    let todayActivity = progress.dailyActivity.find(activity => 
      activity.date.toDateString() === today.toDateString()
    );

    if (todayActivity) {
      todayActivity.hoursSpent += hoursSpent || 0;
      todayActivity.skillsCompleted += skillsCompleted || 0;
      if (projectsWorked) {
        todayActivity.projectsWorked = [...new Set([...todayActivity.projectsWorked, ...projectsWorked])];
      }
    } else {
      progress.dailyActivity.push({
        date: today,
        hoursSpent: hoursSpent || 0,
        skillsCompleted: skillsCompleted || 0,
        projectsWorked: projectsWorked || []
      });
    }

    // Update totals
    progress.totalHours += hoursSpent || 0;
    progress.completedSkills += skillsCompleted || 0;

    // Update streak
    progress.updateStreak();

    await progress.save();

    res.status(200).json({
      status: 'success',
      message: 'Activity updated successfully',
      data: {
        progress
      }
    });
  } catch (error) {
    console.error('Update activity error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating activity'
    });
  }
});

// @desc    Get progress statistics
// @route   GET /api/progress/stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const progress = await Progress.findOne({ user: req.user.id });
    
    if (!progress) {
      return res.status(200).json({
        status: 'success',
        data: {
          stats: {
            totalSkills: 0,
            completedSkills: 0,
            inProgressSkills: 0,
            totalProjects: 0,
            completedProjects: 0,
            streakDays: 0,
            totalHours: 0
          }
        }
      });
    }

    const stats = {
      totalSkills: progress.totalSkills,
      completedSkills: progress.completedSkills,
      inProgressSkills: progress.inProgressSkills,
      totalProjects: progress.totalProjects,
      completedProjects: progress.completedProjects,
      streakDays: progress.streakDays,
      totalHours: progress.totalHours,
      weeklyGoal: progress.weeklyGoal,
      achievements: progress.achievements
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

// @desc    Add achievement
// @route   POST /api/progress/achievements
// @access  Private
router.post('/achievements', protect, async (req, res) => {
  try {
    const { id, title, description, category } = req.body;

    const progress = await Progress.findOne({ user: req.user.id });
    
    if (!progress) {
      return res.status(404).json({
        status: 'error',
        message: 'Progress record not found'
      });
    }

    // Check if achievement already exists
    const existingAchievement = progress.achievements.find(a => a.id === id);
    if (existingAchievement) {
      return res.status(400).json({
        status: 'error',
        message: 'Achievement already earned'
      });
    }

    progress.achievements.push({
      id,
      title,
      description,
      category,
      earnedAt: new Date()
    });

    await progress.save();

    res.status(201).json({
      status: 'success',
      message: 'Achievement added successfully',
      data: {
        achievement: progress.achievements[progress.achievements.length - 1]
      }
    });
  } catch (error) {
    console.error('Add achievement error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error adding achievement'
    });
  }
});

export default router;