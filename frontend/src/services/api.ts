import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (data: any) => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.put('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};

// Roadmap API
export const roadmapAPI = {
  generate: async (data: {
    careerGoal: string;
    techStack: string[];
    skillLevel: string;
    assessmentScore?: number;
  }) => {
    const response = await api.post('/roadmaps/generate', data);
    return response.data;
  },

  getAll: async () => {
    const response = await api.get('/roadmaps');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/roadmaps/${id}`);
    return response.data;
  },

  updateMilestone: async (roadmapId: string, milestoneId: string, status: string) => {
    const response = await api.put(`/roadmaps/${roadmapId}/milestones/${milestoneId}`, {
      status,
    });
    return response.data;
  },

  updateProject: async (roadmapId: string, projectId: string, status: string) => {
    const response = await api.put(`/roadmaps/${roadmapId}/projects/${projectId}`, {
      status,
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/roadmaps/${id}`);
    return response.data;
  },
};

// Assessment API
export const assessmentAPI = {
  getAll: async (category?: string) => {
    const response = await api.get('/assessments', {
      params: category ? { category } : {},
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/assessments/${id}`);
    return response.data;
  },

  submit: async (id: string, answers: any[], timeSpent: number) => {
    const response = await api.post(`/assessments/${id}/submit`, {
      answers,
      timeSpent,
    });
    return response.data;
  },

  getResults: async () => {
    const response = await api.get('/assessments/results');
    return response.data;
  },
};

// Progress API
export const progressAPI = {
  get: async () => {
    const response = await api.get('/progress');
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/progress/stats');
    return response.data;
  },

  updateActivity: async (data: {
    hoursSpent?: number;
    skillsCompleted?: number;
    projectsWorked?: string[];
  }) => {
    const response = await api.post('/progress/activity', data);
    return response.data;
  },

  addAchievement: async (achievement: {
    id: string;
    title: string;
    description: string;
    category: string;
  }) => {
    const response = await api.post('/progress/achievements', achievement);
    return response.data;
  },
};

// AI API
export const aiAPI = {
  chat: async (message: string, context?: any) => {
    const response = await api.post('/ai/chat', { message, context });
    return response.data;
  },

  getProjectSuggestions: async (data: {
    skillLevel: string;
    techStack?: string[];
    interests?: string[];
  }) => {
    const response = await api.post('/ai/projects', data);
    return response.data;
  },
};

export default api;