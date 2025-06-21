import express from 'express';
import Roadmap from '../models/Roadmap.js';
import Progress from '../models/Progress.js';
import { protect } from '../middleware/auth.js';
import { roadmapValidation, validateRequest } from '../middleware/validation.js';
import { generateRoadmapWithAI } from '../services/aiService.js';

const router = express.Router();

// @desc    Generate new roadmap
// @route   POST /api/roadmaps/generate
// @access  Private
router.post('/generate', protect, roadmapValidation, validateRequest, async (req, res) => {
  try {
    const { careerGoal, techStack, skillLevel, assessmentScore } = req.body;

    // Generate roadmap using AI
    const aiGeneratedRoadmap = await generateRoadmapWithAI({
      careerGoal,
      techStack,
      skillLevel,
      assessmentScore
    });

    // Create roadmap in database
    const roadmap = await Roadmap.create({
      user: req.user.id,
      title: aiGeneratedRoadmap.title,
      description: aiGeneratedRoadmap.description,
      careerGoal,
      techStack,
      skillLevel,
      milestones: aiGeneratedRoadmap.milestones,
      estimatedDuration: aiGeneratedRoadmap.estimatedDuration,
      tags: aiGeneratedRoadmap.tags || []
    });

    // Create or update progress tracking
    await Progress.findOneAndUpdate(
      { user: req.user.id, roadmap: roadmap._id },
      {
        user: req.user.id,
        roadmap: roadmap._id,
        totalSkills: roadmap.milestones.reduce((acc, m) => acc + m.skills.length, 0),
        totalProjects: roadmap.milestones.reduce((acc, m) => acc + m.projects.length, 0)
      },
      { upsert: true, new: true }
    );

    res.status(201).json({
      status: 'success',
      message: 'Roadmap generated successfully',
      data: {
        roadmap
      }
    });
  } catch (error) {
    console.error('Generate roadmap error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error generating roadmap'
    });
  }
});

// @desc    Get user's roadmaps
// @route   GET /api/roadmaps
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const roadmaps = await Roadmap.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      data: {
        roadmaps,
        count: roadmaps.length
      }
    });
  } catch (error) {
    console.error('Get roadmaps error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching roadmaps'
    });
  }
});

// @desc    Get specific roadmap
// @route   GET /api/roadmaps/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const roadmap = await Roadmap.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!roadmap) {
      return res.status(404).json({
        status: 'error',
        message: 'Roadmap not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        roadmap
      }
    });
  } catch (error) {
    console.error('Get roadmap error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching roadmap'
    });
  }
});

// @desc    Update milestone status
// @route   PUT /api/roadmaps/:id/milestones/:milestoneId
// @access  Private
router.put('/:id/milestones/:milestoneId', protect, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['not-started', 'in-progress', 'completed'].includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid status'
      });
    }

    const roadmap = await Roadmap.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!roadmap) {
      return res.status(404).json({
        status: 'error',
        message: 'Roadmap not found'
      });
    }

    const milestone = roadmap.milestones.id(req.params.milestoneId);
    if (!milestone) {
      return res.status(404).json({
        status: 'error',
        message: 'Milestone not found'
      });
    }

    milestone.status = status;
    if (status === 'completed') {
      milestone.completedAt = new Date();
    }

    // Recalculate roadmap progress
    roadmap.calculateProgress();
    
    await roadmap.save();

    res.status(200).json({
      status: 'success',
      message: 'Milestone updated successfully',
      data: {
        roadmap
      }
    });
  } catch (error) {
    console.error('Update milestone error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating milestone'
    });
  }
});

// @desc    Update project status
// @route   PUT /api/roadmaps/:id/projects/:projectId
// @access  Private
router.put('/:id/projects/:projectId', protect, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['not-started', 'in-progress', 'completed'].includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid status'
      });
    }

    const roadmap = await Roadmap.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!roadmap) {
      return res.status(404).json({
        status: 'error',
        message: 'Roadmap not found'
      });
    }

    let projectFound = false;
    roadmap.milestones.forEach(milestone => {
      const project = milestone.projects.id(req.params.projectId);
      if (project) {
        project.status = status;
        if (status === 'completed') {
          project.completedAt = new Date();
        }
        projectFound = true;
      }
    });

    if (!projectFound) {
      return res.status(404).json({
        status: 'error',
        message: 'Project not found'
      });
    }

    await roadmap.save();

    // Update progress
    const progress = await Progress.findOne({
      user: req.user.id,
      roadmap: roadmap._id
    });

    if (progress) {
      const completedProjects = roadmap.milestones
        .flatMap(m => m.projects)
        .filter(p => p.status === 'completed').length;
      
      progress.completedProjects = completedProjects;
      await progress.save();
    }

    res.status(200).json({
      status: 'success',
      message: 'Project updated successfully',
      data: {
        roadmap
      }
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating project'
    });
  }
});

// @desc    Delete roadmap
// @route   DELETE /api/roadmaps/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const roadmap = await Roadmap.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!roadmap) {
      return res.status(404).json({
        status: 'error',
        message: 'Roadmap not found'
      });
    }

    // Also delete associated progress
    await Progress.findOneAndDelete({
      user: req.user.id,
      roadmap: req.params.id
    });

    res.status(200).json({
      status: 'success',
      message: 'Roadmap deleted successfully'
    });
  } catch (error) {
    console.error('Delete roadmap error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error deleting roadmap'
    });
  }
});

export default router;