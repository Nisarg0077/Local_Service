import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor — attach JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('slms_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || 'Something went wrong.';

    if (status === 401) {
      localStorage.removeItem('slms_token');
      localStorage.removeItem('slms_user');
      window.location.href = '/login';
      toast.error('Session expired. Please log in again.');
    } else if (status === 403) {
      toast.error('Access denied.');
    } else if (status === 404) {
      toast.error('Resource not found.');
    } else if (status >= 500) {
      toast.error('Server error. Please try again later.');
    } else if (!error.response) {
      toast.error('Network error. Check your connection.');
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

// ── API Methods (mock-ready, connect backend when ready) ──

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  profile: () => api.get('/auth/profile'),
};

export const servicesAPI = {
  getAll: (params) => api.get('/services', { params }),
  getById: (id) => api.get(`/services/${id}`),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
};

export const bookingsAPI = {
  create: (data) => {
    return api.post('/bookings/', data)
    console.log(data)
  },
  getMyBookings: () => api.get('/bookings/my'),
  getByUser: (userId) => api.get(`/bookings/user/${userId}`),
  getById: (id) => api.get(`/bookings/${id}`),
  cancel: (id) => api.patch(`/bookings/${id}/cancel`),
  reschedule: (id, data) => api.patch(`/bookings/${id}/reschedule`, data),
};

export const usersAPI = {
  getProfile: () => api.get('/userroutes/profile'),
  updateProfile: (data) => api.put('/userroutes/profile', data),
  getFavorites: (userId) => api.get(`/userroutes/favorites/${userId}`),
  toggleFavorite: (serviceId) => api.post(`/userroutes/favorites/${serviceId}`),
  updateFav: (userId, favorites) => api.post(`/userroutes/favorites`, { userId, favorites }),
  getUser: (uid) => api.get(`/userroutes/${uid}`),
  updateUser: (uid, data) => {
    return api.put(`/userroutes/${uid}`, data)
  },
};

export const providerAPI = {
  getAll: () => api.get('/providers/'),
  getDashboard: () => api.get('/provider/dashboard'),
  toggleAvailability: () => api.patch('/provider/availability'),
  getBookings: () => api.get('/provider/bookings'),
  getProvider: (providerId) => api.get(`/providers/${providerId}`),
  updateProvider: (providerId, data) => api.put(`/providers/${providerId}`, data),
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  getProviders: (params) => api.get('/admin/providers', { params }),
  approveProvider: (id) => api.patch(`/admin/providers/${id}/approve`),
};


export const reviewsAPI = {
  getAll: () => api.get('/reviews'),
  getApproved: () => api.get('/reviews/approved'),
  getByUser: (userId) => api.get(`/reviews/user/${userId}`),
  getByService: (serviceId) => api.get(`/reviews/approved/${serviceId}`),
  create: (data) => api.post('/reviews', data),
  approve: (id) => api.put(`/reviews/approve/${id}`),
  delete: (id) => api.delete(`/reviews/${id}`),
};

export default api;
