import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: 'SUPERADMIN' | 'ADMIN' | 'OPERATIONS' | 'DRIVER' | 'PICKER' | 'USER';
  tenantId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  initialized: boolean; // Track if we've checked auth status on app start
}

// Initial state - secure approach using HTTP-only cookies only
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false, // start false so no spinner initially
  error: null,
  initialized: false,
};

// Auth slice with only synchronous actions
// Components will handle API calls and update state using these actions
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Set loading state (for login, logout, etc.)
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Set error message
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Clear error message
    clearError: (state) => {
      state.error = null;
    },

    // Set user after successful login or auth check
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
      state.initialized = true;
    },

    // Clear user data (logout or auth failure)
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      state.initialized = true;
    },

    // Mark auth as initialized (after checking auth status)
    setInitialized: (state) => {
      state.initialized = true;
      state.isLoading = false;
    },

    // Reset entire auth state
    resetAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      state.initialized = true;
    },
  },
});

// Export actions for use in components
export const {
  setLoading,
  setError,
  clearError,
  setUser,
  clearUser,
  setInitialized,
  resetAuth,
} = authSlice.actions;

// Export reducer
export default authSlice.reducer;
