import React, { type ReactNode, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setUser, clearUser, setInitialized } from '../../store/slices/authSlice';
import { authAPI } from '../../features/auth/api/authApi';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { initialized } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Check authentication status on app startup
    const checkAuthStatus = async () => {
      if (initialized) return; // Already checked

      try {
        const response = await authAPI.checkAuth();
        dispatch(setUser(response.data.user));
      } catch (error) {
        // User not authenticated
        dispatch(clearUser());
      } finally {
        dispatch(setInitialized());
      }
    };

    checkAuthStatus();
  }, [dispatch, initialized]);

  return <>{children}</>;
};

export default AuthProvider;
