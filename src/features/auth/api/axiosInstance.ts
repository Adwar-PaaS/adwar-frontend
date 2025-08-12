import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.DEV ? "/api" : "https://adwar-backend-project.onrender.com",
  withCredentials: true, // Important for cookies
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  // Don't set Content-Type for FormData - browser handles this automatically
  // FormData needs multipart/form-data with boundary, not application/json
  if (!(config.data instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);
export default instance;
