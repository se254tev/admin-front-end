import axios from 'axios';

// Get API base URL from environment variable
// In Vercel: Set VITE_API_URL as an environment variable in project settings
// Locally: Define in .env file
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Validate that API URL is defined
if (!API_BASE_URL) {
  const errorMsg = 'VITE_API_URL environment variable is not defined. Please configure it in your deployment platform.';
  if (import.meta.env.DEV) {
    console.warn(errorMsg);
  } else {
    console.error(errorMsg);
  }
}

const apiClient = axios.create({
  baseURL: API_BASE_URL || 'https://bingo-meal-backend.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
