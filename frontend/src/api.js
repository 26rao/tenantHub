import axios from 'axios';

// Use hardcoded API URL since VITE_API_URL is not set
const API = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api; 