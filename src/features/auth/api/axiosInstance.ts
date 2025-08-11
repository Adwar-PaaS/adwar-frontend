import axios from "axios";

const instance = axios.create({
  baseURL: "https://adwar-backend-project.onrender.com",
});

instance.interceptors.request.use((config) => {
  const authData = localStorage.getItem("auth");
  if (authData) {
    try {
      const { token } = JSON.parse(authData);
      config.headers.Authorization = `Bearer ${token}`;
    } catch {
      localStorage.removeItem("auth");
    }
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
