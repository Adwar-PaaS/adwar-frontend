import { AUTH_CONFIG } from "../../../config/auth.config";
import axiosInstance from "./axiosInstance"; // Use the main axios instance

const { ENDPOINTS } = AUTH_CONFIG;

interface LoginPayload {
  email: string;
  password: string;
}

interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface Role {
  id: string;
  name: 'SUPER_ADMIN' | 'ADMIN' | 'OPERATIONS' | 'DRIVER' | 'PICKER' | 'USER';
  permissions: string[];
}

interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: {
    id: string;
    name: 'SUPER_ADMIN' | 'ADMIN' | 'OPERATIONS' | 'DRIVER' | 'PICKER' | 'USER';
    permissions: any[];
  };
  userTenants: Array<{
    tenantId: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface LoginResponse {
  user: User;
}

interface AuthResponse {
  user: User;
}

// Create axios instance with credentials - use the main instance to avoid conflicts
const authAxios = axiosInstance;

export const login = async (data: LoginPayload): Promise<ApiResponse<LoginResponse>> => {
  const response = await authAxios.post(ENDPOINTS.LOGIN, data);
  return response.data;
};

export const refreshToken = async (): Promise<ApiResponse<AuthResponse>> => {
  const response = await authAxios.post(ENDPOINTS.REFRESH);
  return response.data;
};

export const checkAuth = async (): Promise<ApiResponse<AuthResponse>> => {
  const response = await authAxios.get(ENDPOINTS.CHECK_AUTH);
  return response.data;
};

export const logout = async (): Promise<ApiResponse<null>> => {
  const response = await authAxios.post(ENDPOINTS.LOGOUT);
  return response.data;
};

export const authAPI = {
  login,
  refreshToken,
  checkAuth,
  logout,
};
