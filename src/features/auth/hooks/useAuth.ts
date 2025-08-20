import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { clearUser } from '../../../store/slices/authSlice';
import { authAPI } from '../api/authApi';
import type { User } from '../../../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);

  const logout = async () => {
    try {
      await authAPI.logout();
      dispatch(clearUser());
      window.location.href = "/login";
    } catch (error) {
      // Even if logout fails on backend, clear local state
      dispatch(clearUser());
      window.location.href = "/login";
    }
  };

  return {
    // State
    user: authState.user as User | null,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    error: authState.error,
    initialized: authState.initialized,
    
    // Actions
    logout,
  };
};
