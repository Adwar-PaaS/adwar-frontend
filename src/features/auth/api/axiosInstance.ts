import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.DEV ? "/api" : "https://adwar-backend-project.onrender.com",
  withCredentials: true, // Important for cookies
});

// Request interceptor
instance.interceptors.request.use(
  async (config) => {
    // Don't set Content-Type for FormData - browser handles this automatically
    // FormData needs multipart/form-data with boundary, not application/json
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }

    // Add user role to all requests if user is authenticated
    try {
      // Import store dynamically to avoid circular dependency
      const { store } = await import("../../../store");
      const user = store.getState().auth.user;
      
      if (user && user.role) {
        config.headers["X-User-Role"] = user.role;
        
        // Also add tenant ID for tenant-specific roles
        if (user.tenantId && user.role.name !== 'SUPER_ADMIN') {
          config.headers["X-Tenant-ID"] = user.tenantId;
        }
      }
    } catch (error) {
      // If store is not available, continue without headers
      console.warn("Could not access store for user role:", error);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If we get a 401 and haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Check if we have cookies before attempting refresh
      const hasCookies =  document.cookie.includes('session');
      // document.cookie.includes('access') ||

      if (!hasCookies) {
        // Import store dynamically to avoid circular dependency
        const { store } = await import("../../../store");
        const { resetAuth } = await import("../../../store/slices/authSlice");
        
        store.dispatch(resetAuth());
        
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        
        return Promise.reject(error);
      }

      try {
        // Import store dynamically to avoid circular dependency
        const { store } = await import("../../../store");
        const { setUser } = await import("../../../store/slices/authSlice");
        const { authAPI } = await import("./authApi");
        
        // Try to refresh the token via direct API call
        const refreshResponse = await authAPI.refreshToken();
        
        // Update user in store if refresh successful
        store.dispatch(setUser(refreshResponse.data.user));
        
        // Retry the original request
        return instance(originalRequest);
      } catch (refreshError) {
        
        // If refresh fails, clear auth state and redirect to login
        const { store } = await import("../../../store");
        const { resetAuth } = await import("../../../store/slices/authSlice");
        
        store.dispatch(resetAuth());
        
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
