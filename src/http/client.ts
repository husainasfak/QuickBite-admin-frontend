import axios from "axios";
import { useAuthStore } from "../store";
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
const AUTH_SERVICE = '/api/auth'
const refreshToken = async () => {
  await axios.post(
    `${import.meta.env.VITE_BACKEND_API_URL}${AUTH_SERVICE}/auth/refresh`,
    {},
    {
      withCredentials: true,
    }
  );
};

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (err.response.status === 401 && !originalRequest._isRetry) {
      try {
        originalRequest._isRetry = true; // avoid infinite loop
        const headers = { ...originalRequest.headers };
        // Not using api.get('/auth/refresh') beacuse it will chnage the output of original request
        await refreshToken();
        return api.request({
          ...originalRequest,
          headers,
        });
      } catch (err) {
        console.error("token refresh error", err);
        useAuthStore.getState().logout();
        return Promise.reject(err);
      }
    }
    return Promise.reject(err);
  }
);

export default api;
