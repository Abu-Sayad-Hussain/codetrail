export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    emailUpdates?: boolean;
  };
  profile?: {
    bio?: string;
    location?: string;
    website?: string;
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
  skills?: Skill[];
  lastLogin?: Date;
}

export interface Skill {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  progress: number;
}

export interface Quiz {
  id: string;
  title: string;
  category: string;
  questions: Question[];
  timeLimit?: number;
  passingScore?: number;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation?: string;
}

export interface RoadmapMilestone {
  id: string;
  title: string;
  description: string;
  skills: string[];
  projects: Project[];
  estimatedTime: string;
  status: 'not-started' | 'in-progress' | 'completed';
  order: number;
  completedAt?: Date;
}

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  careerGoal: string;
  techStack: string[];
  skillLevel: string;
  milestones: RoadmapMilestone[];
  isActive?: boolean;
  isPublic?: boolean;
  tags?: string[];
  estimatedDuration?: string;
  progress?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  githubTemplate?: string;
  status: 'not-started' | 'in-progress' | 'completed';
  completedAt?: Date;
  resources?: Resource[];
}

export interface Resource {
  title: string;
  url: string;
  type: 'video' | 'article' | 'documentation' | 'course';
}

export interface ProgressStats {
  totalSkills: number;
  completedSkills: number;
  inProgressSkills: number;
  totalProjects: number;
  completedProjects: number;
  streakDays: number;
  totalHours: number;
  weeklyGoal?: number;
  achievements?: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  earnedAt: Date;
  category: string;
}

export interface AssessmentResult {
  id: string;
  assessmentId: string;
  score: number;
  passed: boolean;
  skillLevel: string;
  completedAt: Date;
  timeSpent: number;
}