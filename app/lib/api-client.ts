import axios from 'axios';
import { auth } from './firebase/config';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'https://civentra-ai-backend.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the Firebase token
apiClient.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
