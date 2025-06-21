import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  roadmap: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Roadmap',
    required: true
  },
  totalSkills: {
    type: Number,
    default: 0
  },
  completedSkills: {
    type: Number,
    default: 0
  },
  inProgressSkills: {
    type: Number,
    default: 0
  },
  totalProjects: {
    type: Number,
    default: 0
  },
  completedProjects: {
    type: Number,
    default: 0
  },
  streakDays: {
    type: Number,
    default: 0
  },
  totalHours: {
    type: Number,
    default: 0
  },
  lastActivityDate: {
    type: Date,
    default: Date.now
  },
  weeklyGoal: {
    type: Number,
    default: 10 // hours per week
  },
  achievements: [{
    id: String,
    title: String,
    description: String,
    earnedAt: {
      type: Date,
      default: Date.now
    },
    category: String
  }],
  dailyActivity: [{
    date: {
      type: Date,
      required: true
    },
    hoursSpent: {
      type: Number,
      default: 0
    },
    skillsCompleted: {
      type: Number,
      default: 0
    },
    projectsWorked: [String]
  }]
}, {
  timestamps: true
});

// Method to update streak
progressSchema.methods.updateStreak = function() {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const lastActivity = new Date(this.lastActivityDate);
  
  // Check if user was active yesterday or today
  if (this.isSameDay(lastActivity, today) || this.isSameDay(lastActivity, yesterday)) {
    // Continue or maintain streak
    if (!this.isSameDay(lastActivity, today)) {
      this.streakDays += 1;
    }
  } else {
    // Reset streak if more than a day gap
    this.streakDays = 1;
  }
  
  this.lastActivityDate = today;
};

progressSchema.methods.isSameDay = function(date1, date2) {
  return date1.toDateString() === date2.toDateString();
};

export default mongoose.model('Progress', progressSchema);