import axios from "axios";

const instance = axios.create({
  baseURL: "https://adwar-backend-project.onrender.com",
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

export default instance;
