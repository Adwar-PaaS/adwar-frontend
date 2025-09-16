import { AUTH_CONFIG } from "../../../config/auth.config";
import axiosInstance from "./axiosInstance"; // Use the main axios instance
import { getCsrfToken } from "./tenantApi";

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

interface User {
  id: string;
  email: string;
  fullName: string;
  isOwner: boolean;
  role: {
    id: string;
    name: 'SUPER_ADMIN' | 'ADMIN' | 'OPERATION' | 'DRIVER' | 'PICKER' | 'CUSTOMER';
    permissions: any[];
  };
  tenant: {
    id: string;
    slug: string;
  };
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
    const csrfToken = await getCsrfToken();
const response = await authAxios.post(ENDPOINTS.LOGIN, data, {
    headers: {
      "X-CSRF-Token": csrfToken,
    },
  });  return response.data;
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
  const csrfToken = await getCsrfToken();
  const response = await authAxios.post(
    ENDPOINTS.LOGOUT,
    {},
    {
      headers: {
        "X-CSRF-Token": csrfToken,
      },
      withCredentials: true,
    }
  );
  return response.data;
};


export const authAPI = {
  login,
  refreshToken,
  checkAuth,
  logout,
};
