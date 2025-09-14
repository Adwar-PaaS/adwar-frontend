import { store } from "../store";
import { clearUser } from "../store/slices/authSlice";
import { authAPI } from "../features/auth/api/authApi";

export const handleLogout = async () => {
  try {
    await authAPI.logout();
  } catch (error) {
    // ignore backend error
  } finally {
    store.dispatch(clearUser());
  }
};
