import axios from "axios";

const instance = axios.create({
  baseURL: "https://adwar-backend-project.onrender.com",
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  config.headers["Content-Type"] = "application/json";
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
