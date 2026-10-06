import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// REQUEST INTERCEPTOR: Selalu sertakan token terbaru
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// RESPONSE INTERCEPTOR: Tangani Token Expired / Invalid (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Jika server merespons status 401 (Unauthorized / Token Expired)
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        // Clear seluruh session login
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Cegah infinite redirect loop
        if (!window.location.pathname.startsWith('/auth')) {
          window.location.href = '/auth?session=expired';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;