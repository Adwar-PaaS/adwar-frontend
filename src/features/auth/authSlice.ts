import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { User } from "./types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    loginSuccess: (state, action: PayloadAction<User>) => {
      console.log("Dispatching loginSuccess with:", action.payload);
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      console.log("Auth state update", {
        action: action.type,
        newState: { ...state, ...action.payload },
      });
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
    initializeAuth: (state) => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      if (token && user) {
        try {
          state.user = JSON.parse(user);
          state.isAuthenticated = true;
        } catch {
          state.user = null;
          state.isAuthenticated = false;
        }
      }
      state.loading = false;
    },
    stabilizeAuth: (state) => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      if (token && user) {
        try {
          state.user = JSON.parse(user);
          state.isAuthenticated = true;
        } catch {
          state.user = null;
          state.isAuthenticated = false;
        }
      }
      state.loading = false;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  setUser,
  initializeAuth,
  stabilizeAuth,
} = authSlice.actions;
export default authSlice.reducer;
