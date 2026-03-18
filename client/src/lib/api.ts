import axios from "axios";
import { getToken, clearAuth } from "./authStorage";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api"
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // If token is invalid/expired, clean local auth state
    if (err?.response?.status === 401) {
      clearAuth();
    }
    return Promise.reject(err);
  }
);

