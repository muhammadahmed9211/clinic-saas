import axios from 'axios';

const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

// Create axios instance
const apiClient = axios.create({
  baseURL: APPS_SCRIPT_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add user UUID to all requests
    const userUUID = localStorage.getItem('userUUID');
    if (userUUID) {
      config.params = {
        ...config.params,
        uuid: userUUID,
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const errorMessage = error.response?.data?.error || error.message || 'An error occurred';
    console.error('API Error:', errorMessage);
    return Promise.reject(new Error(errorMessage));
  }
);

// API functions
export const api = {
  // Appointments
  createAppointment: async (appointmentData) => {
    return apiClient.post('', {
      action: 'createAppointment',
      data: appointmentData,
    });
  },

  getAppointments: async (userId) => {
    return apiClient.post('', {
      action: 'getAppointments',
      userId,
    });
  },

  updateAppointment: async (appointmentId, updates) => {
    return apiClient.post('', {
      action: 'updateAppointment',
      appointmentId,
      updates,
    });
  },

  cancelAppointment: async (appointmentId) => {
    return apiClient.post('', {
      action: 'cancelAppointment',
      appointmentId,
    });
  },

  // Payments
  createPaymentSession: async (paymentData) => {
    return apiClient.post('', {
      action: 'createPaymentSession',
      data: paymentData,
    });
  },

  getPaymentStatus: async (transactionId) => {
    return apiClient.post('', {
      action: 'getPaymentStatus',
      transactionId,
    });
  },

  getPayments: async (userId) => {
    return apiClient.post('', {
      action: 'getPayments',
      userId,
    });
  },

  // Doctors
  getDoctors: async () => {
    return apiClient.post('', {
      action: 'getDoctors',
    });
  },

  getAvailableSlots: async (doctorId, date) => {
    return apiClient.post('', {
      action: 'getAvailableSlots',
      doctorId,
      date,
    });
  },

  // User management
  updateProfile: async (userId, profileData) => {
    return apiClient.post('', {
      action: 'updateProfile',
      userId,
      data: profileData,
    });
  },

  // Dashboard stats
  getDashboardStats: async (userId, role) => {
    return apiClient.post('', {
      action: 'getDashboardStats',
      userId,
      role,
    });
  },
};

export default api;