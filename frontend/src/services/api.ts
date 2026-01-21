import axios from 'axios';
import { AuthStorage } from './authStorage';

const baseURL = (process.env.APP_HOSTNAME && process.env.APP_PORT) ? `http://${process.env.APP_HOSTNAME}:${process.env.APP_PORT}/api` : 'http://localhost:8000/api';

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

api.interceptors.request.use((config) => {
  const token = AuthStorage.getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
