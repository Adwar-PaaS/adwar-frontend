import { store } from "../store";
import { clearUser } from "../store/slices/authSlice";
import { authAPI } from "../features/auth/api/authApi";

export const handleLogout = async () => {
  try {
    await authAPI.logout();
    store.dispatch(clearUser());
  } catch (error) {
    // Even if logout fails on backend, we should clear local state
    store.dispatch(clearUser());
  }
  
  // Redirect to login page
  window.location.href = "/login";
};
