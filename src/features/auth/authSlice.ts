import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// Define Permission type
export interface Permission {
  entity: string;
  actions: string[];
}

// Define Role type
export interface Role {
  id: string;
  name: "SUPER_ADMIN" | "ADMIN" | "OPERATION" | "DRIVER" | "PICKER" | "CUSTOMER";
  permissions: Permission[];
}

// Define User type
export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string | null;
  isOwner: boolean;
  role: Role;                      
  userPermissions?: Permission[];  
  tenant: {
    id: string;
    slug: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

// Define AuthState
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Start login (set loading true, clear errors)
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    // Login success (set user, mark authenticated)
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },

    // Login failure (set error, stop loading)
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Logout (clear everything)
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },

    // Set user manually (e.g., restoring from token/session)
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
  },
});

// Export actions
export const { loginStart, loginSuccess, loginFailure, logout, setUser } =
  authSlice.actions;

// Export reducer
export default authSlice.reducer;
