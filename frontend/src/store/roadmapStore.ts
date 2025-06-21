import { create } from 'zustand';
import { Roadmap, RoadmapMilestone, Project, ProgressStats } from '../types';
import { roadmapAPI, progressAPI } from '../services/api';

interface RoadmapState {
  currentRoadmap: Roadmap | null;
  roadmaps: Roadmap[];
  progressStats: ProgressStats;
  isLoading: boolean;
  
  // Actions
  generateRoadmap: (careerGoal: string, techStack: string[], skillLevel: string, assessmentScore?: number) => Promise<void>;
  loadRoadmaps: () => Promise<void>;
  loadCurrentRoadmap: (id: string) => Promise<void>;
  updateMilestoneStatus: (milestoneId: string, status: RoadmapMilestone['status']) => Promise<void>;
  updateProjectStatus: (projectId: string, status: Project['status']) => Promise<void>;
  loadProgressStats: () => Promise<void>;
  updateActivity: (data: { hoursSpent?: number; skillsCompleted?: number; projectsWorked?: string[] }) => Promise<void>;
}

export const useRoadmapStore = create<RoadmapState>((set, get) => ({
  currentRoadmap: null,
  roadmaps: [],
  progressStats: {
    totalSkills: 0,
    completedSkills: 0,
    inProgressSkills: 0,
    totalProjects: 0,
    completedProjects: 0,
    streakDays: 0,
    totalHours: 0
  },
  isLoading: false,

  generateRoadmap: async (careerGoal: string, techStack: string[], skillLevel: string, assessmentScore?: number) => {
    set({ isLoading: true });
    try {
      const response = await roadmapAPI.generate({
        careerGoal,
        techStack,
        skillLevel,
        assessmentScore
      });
      
      const roadmap = response.data.roadmap;
      
      set((state) => ({
        currentRoadmap: roadmap,
        roadmaps: [roadmap, ...state.roadmaps.filter(r => r.id !== roadmap.id)],
        isLoading: false
      }));

      // Load updated progress stats
      await get().loadProgressStats();
    } catch (error: any) {
      set({ isLoading: false });
      throw new Error(error.response?.data?.message || 'Failed to generate roadmap');
    }
  },

  loadRoadmaps: async () => {
    try {
      const response = await roadmapAPI.getAll();
      const roadmaps = response.data.roadmaps;
      
      set({ 
        roadmaps,
        currentRoadmap: roadmaps.find((r: Roadmap) => r.isActive) || roadmaps[0] || null
      });
    } catch (error) {
      console.error('Failed to load roadmaps:', error);
    }
  },

  loadCurrentRoadmap: async (id: string) => {
    try {
      const response = await roadmapAPI.getById(id);
      const roadmap = response.data.roadmap;
      
      set({ currentRoadmap: roadmap });
    } catch (error) {
      console.error('Failed to load roadmap:', error);
    }
  },

  updateMilestoneStatus: async (milestoneId: string, status: RoadmapMilestone['status']) => {
    const { currentRoadmap } = get();
    if (!currentRoadmap) return;

    try {
      const response = await roadmapAPI.updateMilestone(currentRoadmap.id, milestoneId, status);
      const updatedRoadmap = response.data.roadmap;
      
      set({ currentRoadmap: updatedRoadmap });
      
      // Update activity if milestone completed
      if (status === 'completed') {
        await get().updateActivity({ skillsCompleted: 1 });
      }
    } catch (error) {
      console.error('Failed to update milestone:', error);
      throw error;
    }
  },

  updateProjectStatus: async (projectId: string, status: Project['status']) => {
    const { currentRoadmap } = get();
    if (!currentRoadmap) return;

    try {
      const response = await roadmapAPI.updateProject(currentRoadmap.id, projectId, status);
      const updatedRoadmap = response.data.roadmap;
      
      set({ currentRoadmap: updatedRoadmap });
      
      // Update activity and progress stats
      if (status === 'completed') {
        await get().updateActivity({ projectsWorked: [projectId] });
      }
      await get().loadProgressStats();
    } catch (error) {
      console.error('Failed to update project:', error);
      throw error;
    }
  },

  loadProgressStats: async () => {
    try {
      const response = await progressAPI.getStats();
      const stats = response.data.stats;
      
      set({ progressStats: stats });
    } catch (error) {
      console.error('Failed to load progress stats:', error);
      // Set default stats if API fails
      set({
        progressStats: {
          totalSkills: 0,
          completedSkills: 0,
          inProgressSkills: 0,
          totalProjects: 0,
          completedProjects: 0,
          streakDays: 0,
          totalHours: 0
        }
      });
    }
  },

  updateActivity: async (data: { hoursSpent?: number; skillsCompleted?: number; projectsWorked?: string[] }) => {
    try {
      await progressAPI.updateActivity(data);
      await get().loadProgressStats();
    } catch (error) {
      console.error('Failed to update activity:', error);
    }
  }
}));