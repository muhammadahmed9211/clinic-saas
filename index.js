import { create } from 'zustand';
import { authService } from '../services/auth';

export const useAuthStore = create((set) => ({
  user: null,
  session: null,
  loading: true,
  
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setLoading: (loading) => set({ loading }),
  
  initialize: async () => {
    try {
      const { data: session } = await authService.getSession();
      if (session) {
        const { data: user } = await authService.getCurrentUser();
        set({ user, session, loading: false });
      } else {
        set({ user: null, session: null, loading: false });
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      set({ user: null, session: null, loading: false });
    }
  },
  
  signIn: async (email, password) => {
    const { data, error } = await authService.signIn(email, password);
    if (data && data.user) {
      set({ user: data.user, session: data.session });
      return { success: true };
    }
    return { success: false, error };
  },
  
  signUp: async (email, password, userData) => {
    const { data, error } = await authService.signUp(email, password, userData);
    if (data && data.user) {
      set({ user: data.user, session: data.session });
      return { success: true };
    }
    return { success: false, error };
  },
  
  signOut: async () => {
    await authService.signOut();
    set({ user: null, session: null });
  },
}));

export const useAppStore = create((set) => ({
  appointments: [],
  doctors: [],
  payments: [],
  loading: false,
  error: null,
  
  setAppointments: (appointments) => set({ appointments }),
  setDoctors: (doctors) => set({ doctors }),
  setPayments: (payments) => set({ payments }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  clearError: () => set({ error: null }),
}));

export const useNotificationStore = create((set) => ({
  notifications: [],
  
  addNotification: (notification) => set((state) => ({
    notifications: [
      ...state.notifications,
      {
        id: Date.now(),
        ...notification,
      },
    ],
  })),
  
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter((n) => n.id !== id),
  })),
  
  clearNotifications: () => set({ notifications: [] }),
}));