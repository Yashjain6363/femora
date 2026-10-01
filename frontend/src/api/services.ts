import api from './axios';
import type { AuthResponse, User } from '../types';

export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post<{ success: boolean; data: AuthResponse }>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post<{ success: boolean; data: AuthResponse }>('/auth/login', data),

  logout: () => api.post('/auth/logout'),

  getProfile: () => api.get<{ success: boolean; data: User }>('/auth/profile'),
};

export const periodApi = {
  getAll: () => api.get('/periods'),
  create: (data: object) => api.post('/periods', data),
  update: (id: string, data: object) => api.put(`/periods/${id}`, data),
  delete: (id: string) => api.delete(`/periods/${id}`),
};

export const cravingApi = {
  getAll: () => api.get('/cravings'),
  create: (data: object) => api.post('/cravings', data),
  update: (id: string, data: object) => api.put(`/cravings/${id}`, data),
  delete: (id: string) => api.delete(`/cravings/${id}`),
  getSuggestions: (category: string) => api.get(`/cravings/suggestions/${category}`),
};

export const symptomApi = {
  getAll: () => api.get('/symptoms'),
  create: (data: object) => api.post('/symptoms', data),
  update: (id: string, data: object) => api.put(`/symptoms/${id}`, data),
  delete: (id: string) => api.delete(`/symptoms/${id}`),
};

export const wellnessApi = {
  getAll: () => api.get('/wellness'),
  getToday: () => api.get('/wellness/today'),
  upsert: (data: object) => api.post('/wellness', data),
  update: (id: string, data: object) => api.put(`/wellness/${id}`, data),
  delete: (id: string) => api.delete(`/wellness/${id}`),
};

export const appointmentApi = {
  getAll: () => api.get('/appointments'),
  create: (data: object) => api.post('/appointments', data),
  update: (id: string, data: object) => api.put(`/appointments/${id}`, data),
  delete: (id: string) => api.delete(`/appointments/${id}`),
};

export const dashboardApi = {
  getSummary: () => api.get('/dashboard'),
};
