import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import { authAPI } from '../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  refreshProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await authAPI.login(email, password);
          const { user, token } = response.data;
          
          set({ 
            user, 
            token,
            isAuthenticated: true, 
            isLoading: false 
          });
          
          // Store token in localStorage for API interceptor
          localStorage.setItem('token', token);
        } catch (error: any) {
          set({ isLoading: false });
          throw new Error(error.response?.data?.message || 'Login failed');
        }
      },

      signup: async (email: string, password: string, name: string) => {
        set({ isLoading: true });
        try {
          const response = await authAPI.register(name, email, password);
          const { user, token } = response.data;
          
          set({ 
            user, 
            token,
            isAuthenticated: true, 
            isLoading: false 
          });
          
          // Store token in localStorage for API interceptor
          localStorage.setItem('token', token);
        } catch (error: any) {
          set({ isLoading: false });
          throw new Error(error.response?.data?.message || 'Signup failed');
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ 
          user: null, 
          token: null,
          isAuthenticated: false 
        });
      },

      updateUser: (updates: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        }));
      },

      refreshProfile: async () => {
        try {
          const response = await authAPI.getProfile();
          const { user } = response.data;
          set({ user });
        } catch (error) {
          console.error('Failed to refresh profile:', error);
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);