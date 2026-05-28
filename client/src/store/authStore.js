import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        localStorage.setItem('rs_token', token);
        set({ user, token, isAuthenticated: true });
      },

      updateUser: (updates) => {
        set((state) => ({ user: { ...state.user, ...updates } }));
      },

      logout: () => {
        localStorage.removeItem('rs_token');
        localStorage.removeItem('rs_user');
        set({ user: null, token: null, isAuthenticated: false });
      },

      isAdmin: () => get().user?.role === 'admin',
    }),
    {
      name: 'rs_auth',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);
