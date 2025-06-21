import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  options: [{
    type: String,
    required: true
  }],
  correctAnswer: {
    type: Number,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  category: String,
  explanation: String
});

const assessmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  category: {
    type: String,
    required: true
  },
  questions: [questionSchema],
  timeLimit: {
    type: Number, // in minutes
    default: 30
  },
  passingScore: {
    type: Number,
    default: 70
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const assessmentResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assessment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true
  },
  answers: [{
    questionId: mongoose.Schema.Types.ObjectId,
    selectedAnswer: Number,
    isCorrect: Boolean,
    timeSpent: Number // in seconds
  }],
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  passed: {
    type: Boolean,
    required: true
  },
  timeSpent: {
    type: Number, // total time in seconds
    required: true
  },
  skillLevel: {
    type: String,
    enum: ['absolute-beginner', 'some-experience', 'intermediate', 'advanced']
  }
}, {
  timestamps: true
});

export const Assessment = mongoose.model('Assessment', assessmentSchema);
export const AssessmentResult = mongoose.model('AssessmentResult', assessmentResultSchema);