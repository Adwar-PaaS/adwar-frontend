// Authentication configuration
export const AUTH_CONFIG = {
  // Token refresh interval (in milliseconds)
  // Refresh every 14 minutes for 15-minute token expiry
  TOKEN_REFRESH_INTERVAL: 14 * 60 * 1000,
  
  // Base URL for authentication endpoints
  // Use proxy in development to avoid CORS issues
  BASE_URL: import.meta.env.DEV ? '/api' : 'https://adwar-backend-project.onrender.com',
  
  // Endpoints
  ENDPOINTS: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh-token',
    CHECK_AUTH: '/auth/me',
  },
  
  // Redirect paths
  ROUTES: {
    LOGIN: '/login',
    DASHBOARD: '/superadmin/tenants',
  },
  
  // Cookie names (must match backend exactly!)
  COOKIES: {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    SESSION_ID: 'session_id',
  },
} as const;
