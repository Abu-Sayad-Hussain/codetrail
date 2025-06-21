import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  techStack: [String],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  estimatedTime: String,
  githubTemplate: String,
  status: {
    type: String,
    enum: ['not-started', 'in-progress', 'completed'],
    default: 'not-started'
  },
  completedAt: Date,
  resources: [{
    title: String,
    url: String,
    type: {
      type: String,
      enum: ['video', 'article', 'documentation', 'course']
    }
  }]
});

const milestoneSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  skills: [String],
  projects: [projectSchema],
  estimatedTime: String,
  status: {
    type: String,
    enum: ['not-started', 'in-progress', 'completed'],
    default: 'not-started'
  },
  order: {
    type: Number,
    required: true
  },
  completedAt: Date
});

const roadmapSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  careerGoal: {
    type: String,
    required: true
  },
  techStack: [String],
  skillLevel: {
    type: String,
    enum: ['absolute-beginner', 'some-experience', 'intermediate', 'advanced'],
    required: true
  },
  milestones: [milestoneSchema],
  isActive: {
    type: Boolean,
    default: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  tags: [String],
  estimatedDuration: String,
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

// Calculate progress based on completed milestones
roadmapSchema.methods.calculateProgress = function() {
  const totalMilestones = this.milestones.length;
  const completedMilestones = this.milestones.filter(m => m.status === 'completed').length;
  this.progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;
  return this.progress;
};

export default mongoose.model('Roadmap', roadmapSchema);