
import axios from "axios";
import { useUserStore } from "../stores/tokenStore";

export const api = axios.create({
  // baseURL: "http://192.168.1.67:5007/api/v1/",
  baseURL: "http://127.0.0.1:8000/api/v1/",
});

// Setup request interceptor
api.interceptors.request.use(
  (config) => {
    const token = useUserStore.getState().userProfile?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
