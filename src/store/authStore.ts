import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'operator';
  cities: ('jakarta' | 'bali')[];
  isActive?: boolean;
  lastLogin?: string;
  createdAt?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await fetch('http://localhost:3001/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Login failed');
          }

          const data = await response.json();
          
          // Store tokens in localStorage for backward compatibility
          localStorage.setItem('token', data.accessToken);
          
          set({
            user: data.user,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        const { accessToken } = get();
        
        try {
          if (accessToken) {
            await fetch('http://localhost:3001/api/auth/logout', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
            });
          }
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // Clear zustand state
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
          });
          
          // Clear all localStorage
          localStorage.removeItem('vault-auth-storage');
          localStorage.removeItem('token'); // Clear old token if exists
          localStorage.removeItem('user'); // Clear old user if exists
        }
      },

      refreshAccessToken: async () => {
        const { refreshToken } = get();
        
        if (!refreshToken) {
          get().clearAuth();
          return;
        }

        try {
          const response = await fetch('http://localhost:3001/api/auth/refresh', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
          });

          if (!response.ok) {
            throw new Error('Token refresh failed');
          }

          const data = await response.json();
          
          // Update localStorage token for backward compatibility
          localStorage.setItem('token', data.accessToken);
          
          set({
            accessToken: data.accessToken,
            user: data.user,
          });
        } catch (error) {
          console.error('Token refresh error:', error);
          get().clearAuth();
        }
      },

      refreshUser: async () => {
        const { accessToken } = get();
        
        if (!accessToken) {
          return;
        }

        try {
          const response = await fetch('http://localhost:3001/api/auth/me', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }

          const data = await response.json();
          
          set({
            user: data.user,
          });
        } catch (error) {
          console.error('Refresh user error:', error);
        }
      },

      setUser: (user: User | null) => {
        set({ user });
      },

      setTokens: (accessToken: string, refreshToken: string) => {
        set({ accessToken, refreshToken, isAuthenticated: true });
      },

      clearAuth: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'vault-auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
