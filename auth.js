import { supabase } from '../config/supabase';

export const authService = {
  // Sign up new user
  signUp: async (email, password, userData) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            phone: userData.phone,
            role: userData.role || 'patient',
          },
        },
      });

      if (error) throw error;

      // Store UUID in localStorage
      if (data.user) {
        localStorage.setItem('userUUID', data.user.id);
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Sign in existing user
  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Store UUID in localStorage
      if (data.user) {
        localStorage.setItem('userUUID', data.user.id);
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Sign out
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      localStorage.removeItem('userUUID');
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  },

  // Get current session
  getSession: async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      return { data: data.session, error };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      return { data: data.user, error };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Reset password
  resetPassword: async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { data, error };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Update password
  updatePassword: async (newPassword) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      return { data, error };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Listen to auth state changes
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  },
};

export default authService;