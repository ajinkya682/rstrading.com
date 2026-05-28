import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true,
  timeout: 15000,
});

// Attach JWT token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('rs_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global error handling
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('rs_token');
      localStorage.removeItem('rs_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default API;
